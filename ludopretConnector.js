const ADODB = require('node-adodb');
ADODB.debug = true;

function connect(config) {
  let connectionString = `Provider=${config.provider};Data Source=${config.datasource};`
  if (config.password) {
    console.log("With Password");
    connectionString += `Jet OLEDB:Database Password=${password}`;
  } else {
    console.log("No Password");
  }
  connectionString += "Persist Security Info=False;"

  const connection = ADODB.open(connectionString);
  return new LudoPret(connection);
}

const TABLE_INSCRITS = "tblInscrits";
class LudoPret {

  constructor(connection) {
    this.connection = connection;
  }

  async exportInscrits() {
    return await this.connection.query(`SELECT * FROM [${TABLE_INSCRITS}]`);
  }
}

module.exports = {connect};