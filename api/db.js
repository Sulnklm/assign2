const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "travelcard",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }

  console.log("Database connected successfully");
});

module.exports = db;
