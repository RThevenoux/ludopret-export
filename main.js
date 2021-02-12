const ludoConnector = require('./ludopretConnector');
const googleAuth = require('./googleAuth');
const GoogleSheet = require('./googleSheetConnector');
const config = require('./conf/config.json');

main();

async function main() {
  // Connect to LudoPret database
  const ludo = ludoConnector.connect(config);
  
  // Retrieve data
  const inscrits = await ludo.exportInscrits();
  
  // Format data
  const mails = inscrits.map(user => [user.NomInscrit, user.PrenomInscrit, user.Tel, user.Mail, user.TypeAdher]);

  // Connect to Google API
  const auth = await googleAuth();
  
  // Export data to GoogleSheet
  const spreadsheetId = config.spreadsheetId;
  const sheet = new GoogleSheet(auth, spreadsheetId);

  await sheet.writeData('Feuille1!A3', mails);
  await sheet.writeData('Feuille1!B1', [[new Date()]]);
}

