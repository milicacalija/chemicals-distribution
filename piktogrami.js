var mysql = require("mysql");
const cors = require('cors');
var express = require("express");
var app = express();

var port = 3011;
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
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
    database: "hemikalije_baza"
});

conn.connect((err) => {
    if (err) throw err;
    console.log("MySql Connected");
});

app.get("/", function (req, res) {
    res.json({ message: "Hello" });
});



// 1️⃣ Vraća sve piktograme
app.get("/piktogrami", (req, res) => {
    const search = req.query.search;
    let query = "SELECT * FROM piktogrami";
    let params = [];

    if (search) {
        query += " WHERE pkt_iupac LIKE ?";
        params.push("%" + search + "%");
    }

    conn.query(query, params, (err, results) => {
        if (err) {
            console.error("Greška u SQL upitu:", err);
            return res.status(500).json({ error: "Greška servera" });
        }
        res.json(results);
    });
});

// 2️⃣ Vraća proizvode za selektovani piktogram
app.get("/piktogrami/proizvodi", (req, res) => {
    const pktId = req.query.piktogram;

    if (!pktId) {
        return res.status(400).json({ error: "Nedostaje parametar piktogram" });
    }

    const query = `
       SELECT proizvodi.pro_id, proizvodi.pro_iupac
FROM proizvodi
JOIN piktogrami_proizvodi ON proizvodi.pro_id = piktogrami_proizvodi.pro_id
JOIN piktogrami ON piktogrami.pkt_id = piktogrami_proizvodi.pkt_id
WHERE piktogrami.pkt_id = ?
    `;

    conn.query(query, [pktId], (err, results) => {
        if (err) {
            console.error("Greška u SQL upitu:", err);
            return res.status(500).json({ error: "Greška servera" });
        }
        res.json(results);
    });
});


app.listen(port, function () {
    console.log("web server radi na portu " + port);
});