const express = require("express");
require("dotenv").config();
const { initDB } = require("./db");

const app = express();

var cors = require('cors');
app.use(cors());

const connPromise = initDB();

const PORT = process.env.PORT || 5001;

const totaltupletext = 'SELECT SUM(c) FROM ((SELECT COUNT(*) AS c FROM MIRANDABARNES.observation) UNION (SELECT COUNT(*) AS c FROM MIRANDABARNES.cash_receipt) UNION (SELECT COUNT(*) AS c FROM MIRANDABARNES.insect) UNION (SELECT COUNT(*) AS c FROM MIRANDABARNES.intermediate_product_expense) UNION (SELECT COUNT(*) AS c FROM MIRANDABARNES.inventory_change_value) UNION (SELECT COUNT(*) AS c FROM MIRANDABARNES.state) UNION (SELECT COUNT(*) AS c FROM "A.KUMAWAT".co2_emission) UNION (SELECT COUNT(*) AS c FROM "A.KUMAWAT".country_data) UNION (SELECT COUNT(*) AS c FROM "A.KUMAWAT".policy_expenditure_datum) UNION (SELECT COUNT(*) AS c FROM "A.KUMAWAT".population_datum) UNION (SELECT COUNT(*) AS c FROM "JASON.LI1".counties) UNION (SELECT COUNT(*) AS c FROM "JASON.LI1".storm_event) UNION (SELECT COUNT(*) AS c FROM "JASON.LI1".storm_fatality) UNION (SELECT COUNT(*) AS c FROM "JASON.LI1".storm_loc) UNION (SELECT COUNT(*) AS c FROM "SBIEBER".avgtemperaturebystatecounty) UNION (SELECT COUNT(*) AS c FROM "SBIEBER".mortalitybystatecounty))';

// root route
app.get("/", async (req, res) => {
  // resolve the promise, for the connection, change the credentials in .env file
  const conn = await connPromise;

  // pass in the query to execute
  const result = await conn.execute(totaltupletext);

  // get the result
  res.send(result.rows);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
