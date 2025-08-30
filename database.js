var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: 'root123',     
  database: 'hemikalije_baza'
}); 
conn.connect(function(err) {
  if (err) throw err;
  console.log('MySql connected !');
});
module.exports = conn;