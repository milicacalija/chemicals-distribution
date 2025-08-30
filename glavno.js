// script.js
const express = require('express');
const session = require('express-session');
const cors = require("cors");


const app = express();

app.use(express.json()); // Ako koristiš JSON u zahtevima
app.use(express.urlencoded({ extended: true })); // Ako koristiš URL-encoded podatke
app.use(cors()); // dozvoljava sve origin-e

// Konfiguriši sesije
app.use(session({
    secret: 'your_secret_key', // Promeni ovo na stvarnu tajnu
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Postavi na true ako koristiš HTTPS
}));

process.env.TZ = 'Europe/Belgrade';
const now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Belgrade' });
console.log('Current server time:', now);
const fs = require('fs');
const { exec } = require('child_process');

//CartMixinl.js se ne poziva kao backend fajl vec kao frontend i on samo tako radi
const files = ['kompanije.js', 'narudzbenice.js', 'piktogrami.js' ,  'tipoviprimene.js', 'server.js',   'specifikacije.js', 'proizslike.js',  'proizvodi.js',  'stavke.js', 'paypal.js',  'users.js', 'login.js' ];

files.forEach((file) => {
  console.log(`Pokrećem fajl: ${file}`);
  exec(`node ${file}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Greška prilikom pokretanja ${file}: ${stderr}`);
    } else {
      console.log(`Izlaz iz ${file}: ${stdout}`);
    }
  });
});
