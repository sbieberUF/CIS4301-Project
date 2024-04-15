const express = require("express");
require("dotenv").config();
const { initDB } = require("./db");

const app = express();

var cors = require("cors");
app.use(cors());

const connPromise = initDB();

const PORT = process.env.PORT || 5001;

// root route
app.get("/", async (req, res) => {
  // resolve the promise, for the connection, change the credentials in .env file
  try {
    const { query } = req.query;

    const conn = await connPromise;

    // pass in the query to execute
    const result = await conn.execute(query);

    // get the result
    return res.json(result.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
