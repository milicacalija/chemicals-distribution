const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const app = express(); // Prvo se mora definisati app

//_dirname je putanja do foldera gde je server.js, zatim ideš u src/router/payment.js
const paymentRoutes = require(path.join(__dirname, 'src', 'router', 'payment'));



// Omogućava CORS za sve rute
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; connect-src 'self'; style-src 'self'; script-src 'self';");
  next();
});
// Konfiguracija MySQL konekcije
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306, // '3306' je broj, ne treba navodnike
  password: "root123",
  database: "mi_baza"
});

// Provera konekcije
conn.connect((err) => {
  if (err) {
    console.log("Error connecting to the database: ", err);
  } else {
    console.log("Connected to the database");
  }
});

// Init middleware for req.body
app.use(express.json());



// Definišite rute ovde (ako su potrebne)
// app.use('/api', require('./routes/api'));

// Postavljanje porta
const PORT = process.env.PORT || 3013;
app.use('/api', paymentRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});