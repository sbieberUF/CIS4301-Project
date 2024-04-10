const express = require("express");
require("dotenv").config();
const { initDB } = require("./db");

const app = express();

const connPromise = initDB();

const PORT = process.env.PORT || 5001;

// root route
app.get("/", async (req, res) => {
  // resolve the promise, for the connection, change the credentials in .env file
  const conn = await connPromise;

  // pass in the query to execute
  const result = await conn.execute("SELECT * FROM POPULATION");

  // get the result
  console.log(result.rows);
  return res.send(result.rows);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
