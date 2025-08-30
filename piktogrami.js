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

app.get("/favicon.ico", (req, res) => {
    res.status(204); // No Content
    res.end();
});

app.get("/piktogrami", function (req, res) {
    var search = req.query.search;

    const queryCallback = (err, results, fields) => {
        if (err) throw err;

        // Convert BLOB to Base64
        results.forEach(row => {
            if (row.pkt_blob) {
                // Convert Buffer to Base64
                const base64String = Buffer.from(row.pkt_blob).toString('base64');
                console.log("Original BLOB data: ", row.pkt_blob);
                console.log("Converted Base64 data: ", base64String);
                row.image_base64 = base64String;
                delete row.pkt_blob;
            } else {
                console.log("No BLOB data found for row:", row);
            }
        });

        console.log("Final JSON response: ", JSON.stringify(results, null, 2));
        res.json({ "data": results });
    };

    if (search === undefined) {
        conn.query("SELECT * FROM piktogrami", queryCallback);
    } else {
        conn.query("SELECT * FROM piktogrami WHERE pkt_iupac LIKE ?", ["%" + search + "%"], queryCallback);
    }
});

app.listen(port, function () {
    console.log("web server radi na portu " + port);
});