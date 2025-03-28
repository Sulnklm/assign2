const mysql = require("mysql2");  // Import the mysql2 library

// Create a MySQL database connection using mysql2
const db = mysql.createConnection({
  host: "localhost",  // Database host (localhost for local development)
  user: "root",       // Username for the database (root user in this case)
  password: "root",   // Password for the database user (root password in this case)
  database: "travelcard",  // Name of the database to connect to
});

// Attempt to connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);  // Log the error if connection fails
    return;  // Stop further execution if there's a connection error
  }

  console.log("Database connected successfully");  // Log success if the connection is successful
});

// Export the database connection to be used in other files
module.exports = db;
