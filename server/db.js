const OracleDB = require("oracledb");
require("dotenv").config();

async function initDB() {
  const connection = OracleDB.getConnection({
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    connectString: `${process.env.HOSTNAME}:${process.env.DBPORT}/${process.env.SID}`,
  });

  return connection;
}

module.exports = { initDB };
