const process = require("process");
const mysql = require("mysql2/promise");

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function connectDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to Database successfully: " + MYSQL_DATABASE);
    connection.release();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

async function disconnectDatabase() {
  try {
    await pool.end();
    console.log("Disconnected from Database");
  } catch (error) {
    console.error("Error disconnecting from database:", error);
  }
}

async function query(sql, values) {
  const connection = await pool.getConnection();
  try {
    const [results, fields] = await connection.execute(sql, values);
    return [results, fields];
  } finally {
    connection.release();
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
  query,
};
