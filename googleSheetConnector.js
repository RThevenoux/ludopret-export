const sheets = require('googleapis').google.sheets('v4');

class GoogleSheet {

  constructor(auth, spreadsheetId) {
    this.auth = auth;
    this.spreadsheetId = spreadsheetId;
  }

  async writeData(range, data) {
    const request = {
      spreadsheetId: this.spreadsheetId,
      range: range,
      valueInputOption: "RAW",
      resource: { values: data },
      auth: this.auth,
    };

    return (await sheets.spreadsheets.values.update(request)).data;
  }
}

module.exports = GoogleSheet;