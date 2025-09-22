const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: 'root123',     
  database: 'hemikalije_baza'
}); 

conn.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected!');
});

module.exports = conn;
