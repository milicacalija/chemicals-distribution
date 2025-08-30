var mysql = require("mysql");
const cors = require('cors');
var express = require("express");
var app = express();

var port = 3015;
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
    if (err) {
        console.error("Error connecting to MySQL:", err);
        throw err;
    }
    console.log("MySql Connected");
});

app.get("/", function (req, res) {
    res.json({ message: "Hello" });
});

app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
});

// Ruta za dobijanje svih proizvoda sa slikama
app.get("/proizslike", function (req, res) {
    const query = `
        SELECT proizslike.*, proizvodi.pro_iupac,pro_cena
        FROM proizslike
        JOIN proizvodi ON proizslike.fk_prs = proizvodi.pro_id
    `;

    conn.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Database query error" });
            return;
        }

        results.forEach(row => {
            if (row.str_blob && row.prs_blob) {
                try {
                    row.str_image_base64 = Buffer.from(row.str_blob).toString('base64');
                    row.prs_image_base64 = Buffer.from(row.prs_blob).toString('base64');
                    delete row.str_blob;
                    delete row.prs_blob;
                } catch (conversionError) {
                    console.error("Error converting BLOB to Base64:", conversionError);
                    res.status(500).json({ error: "Conversion error" });
                    return;
                }
            }
        });

        res.json({ "data": results });
    });
});

// Ruta za dobijanje specifičnog proizvoda sa slikama na osnovu ID
app.get("/product/:id", (req, res) => {
    const productId = req.params.id;
    const query = `
        SELECT proizslike.*, proizvodi.pro_iupac, pro_cena
        FROM proizslike
        JOIN proizvodi ON proizslike.fk_prs = proizvodi.pro_id
        WHERE proizvodi.pro_id = ?
    `;

    conn.query(query, [productId], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Database query error" });
            return;
        }

        results.forEach(row => {
            if (row.str_blob && row.prs_blob) {
                try {
                    row.str_image_base64 = Buffer.from(row.str_blob).toString('base64');
                    row.prs_image_base64 = Buffer.from(row.prs_blob).toString('base64');
                    delete row.str_blob;
                    delete row.prs_blob;
                } catch (conversionError) {
                    console.error("Error converting BLOB to Base64:", conversionError);
                    res.status(500).json({ error: "Conversion error" });
                    return;
                }
            }
        });

        res.json(results);
    });
});

// Ruta za preuzimanje slike
app.get("/image/:id", (req, res) => {
    const imageId = req.params.id;
    const query = `SELECT prs_blob FROM proizslike WHERE prs_id = ?`;

    conn.query(query, [imageId], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Database query error" });
            return;
        }

        if (results.length > 0) {
            const img = results[0].prs_blob;
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',  // ili 'image/png' zavisno od formata slike
                'Content-Length': img.length
            });
            res.end(img);
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    });
});

app.listen(port, function () {
    console.log("web server radi na portu " + port);
});