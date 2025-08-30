var mysql = require("mysql");
const cors = require('cors');
var express = require("express");
var app = express();

var port = 3020;
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' http://localhost:3020");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: '3306',
    password: "root123",
    database: "mi_baza"
});

// Povezivanje na bazu podataka
conn.connect(function(err) {
    if (err) {
        console.error('Greška pri povezivanju sa bazom podataka: ' + err.stack);
        return;
    }
    console.log('Povezano sa bazom podataka kao ID ' + conn.threadId);
});

// Ruta za dobavljanje podataka iz tabele `pro_odel`
app.get('/profodel', (req, res) => {
    const query = 'SELECT * FROM profodel';

    conn.query(query, (error, results) => {
        if (error) {
            console.error('Greška pri izvršavanju upita: ', error);
            res.status(500).send('Greška pri dobavljanju podataka');
        } else {
            res.json(results);
        }
    });
});

// Pokretanje servera
app.listen(port, () => {
    console.log(`Server je pokrenut na portu ${port}`);
});