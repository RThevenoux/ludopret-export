const fs = require('fs').promises;
const readline = require('readline');
const { google } = require('googleapis');

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'conf/token.json';
const CREDENTIAL_PATH = 'conf/credentials.json';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
async function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    try {
        const tokenData = await fs.readFile(TOKEN_PATH);
        const token = JSON.parse(tokenData);
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    } catch (err) {
        return getNewToken(oAuth2Client);
    }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
async function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    const code = await questionCode(authUrl);
    const token = await getToken(oAuth2Client, code);

    oAuth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    await fs.writeFile(TOKEN_PATH, JSON.stringify(token))
    console.log('Token stored to', TOKEN_PATH);

    return oAuth2Client;
}

async function questionCode(authUrl) {
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve, reject) => {
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            resolve(code);
        })
    }
    );
}

async function getToken(oAuth2Client, code) {
    return new Promise((resolve, reject) => {
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        })
    });
}

module.exports = async function auth() {
    // Load client secrets from a local file.
    const content = await fs.readFile(CREDENTIAL_PATH);
    //  console.log('Error loading client secret file:', err);
    const credentials = JSON.parse(content);
    return await authorize(credentials);
}