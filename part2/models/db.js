const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // or your actual password
  database: 'Account'    // ✅ Your new database
});
module.exports = pool;