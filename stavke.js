const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3009;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: '3306',
  password: "root123",
  database: "hemikalije_baza"
});

// Provera konekcije sa bazom
conn.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
  }
  console.log("MySQL connected");
});

// GET handler za stavke
app.get('/stavke', (req, res) => {
  conn.query('SELECT * FROM stavke', (err, results) => {
    if (err) {
      console.error('Error fetching stavke:', err);
      return res.status(500).json({ error: 'Error fetching stavke' });
    }
    res.json(results); // Proverite da li ovo vraća niz objekata
  });
});
// GET handler za proizvode
app.get('/proizvodi', (req, res) => {
  conn.query('SELECT * FROM proizvodi', (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ data: results });
  });
});
// GET endpoint za preuzimanje stavki iz korpe
app.get('/cart-items', (req, res) => {
  // Upit za preuzimanje svih stavki korpe
  const selectQuery = `
    SELECT * FROM stavke;  // Prilagodi upit prema svojoj strukturi baze
  `;

  conn.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Greška prilikom izvršavanja upita:', error);
      return res.status(500).json({ error: 'Greška u bazi podataka' });
    }
    res.json(results);
  });
});

//POST endpoint Ovaj kod koristi transakcije da osigura da se sve operacije izvrše uspešno ili se sve ponište u slučaju greške. Pokušajte ovu metodu i proverite da li reši vaš problem.
// POST ruta za dodavanje stavke u korpu i ažuriranje zaliha
app.post('/stavke', (req, res) => {
  const { stv_id, fk_stv_pro_id, fk_stv_nar_id, stv_kolicina, stv_cena, uk_stv_cena } = req.body;

  if (!stv_id ||    !fk_stv_pro_id ||  !fk_stv_nar_id || !stv_kolicina || !stv_cena || !uk_stv_cena) {
    return res.status(400).json({ error: 'Nedostaju obavezna polja' });
  }

  // SQL upit za proveru stanja zaliha
  const checkStockQuery = 'SELECT pro_lager FROM proizvodi WHERE pro_id = ?;';
  
  conn.query(checkStockQuery, [fk_stv_pro_id], (checkError, checkResults) => {
    if (checkError) {
      console.error('Greška prilikom proveravanja stanja zaliha:', checkError);
      return res.status(500).json({ error: 'Greška u bazi podataka', details: checkError });
    }

    if (checkResults.length === 0) {
      return res.status(404).json({ error: 'Proizvod nije pronađen' });
    }

    const currentStock = checkResults[0].pro_lager;

    if (currentStock < stv_kolicina) {
      return res.status(400).json({ error: 'Nema dovoljno proizvoda na stanju' });
    }

    // SQL upit za dodavanje proizvoda u korpu
    const insertQuery = `
      INSERT INTO stavke (fk_stv_pro_id, fk_stv_nar_id, stv_kolicina, stv_cena, uk_stv_cena)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE stv_kolicina = stv_kolicina + VALUES(stv_kolicina), uk_stv_cena = stv_cena * stv_kolicina;
    `;

    conn.query(insertQuery, [fk_stv_pro_id, fk_stv_nar_id, stv_kolicina, stv_cena, uk_stv_cena], (insertError, insertResults) => {
      if (insertError) {
        console.error('Greška prilikom izvršavanja upita:', insertError);
        return res.status(500).json({ error: 'Greška u bazi podataka', details: insertError });
      }

      const stv_id = insertResults.insertId; // Generisani ID stavke

      // Ažuriranje stanja zaliha
      const updateQuery = 'UPDATE proizvodi SET pro_lager = pro_lager - ? WHERE pro_id = ?;';
      
      conn.query(updateQuery, [stv_kolicina, fk_stv_pro_id], (updateError, updateResults) => {
        if (updateError) {
          console.error('Greška prilikom ažuriranja stanja zaliha:', updateError);
          return res.status(500).json({ error: 'Greška prilikom ažuriranja stanja zaliha', details: updateError });
        }

        // Vraćanje stv_id u odgovoru
        res.json({ message: 'Stavka uspešno dodata', stv_id: stv_id });
      });
    });
  });
});

// PUT endpoint za ažuriranje stavke
app.put('/stavke', (req, res) => {
  const { fk_stv_pro_id, stv_kolicina, stv_cena, uk_stv_cena } = req.body;

  const query = `
    INSERT INTO stavke (fk_stv_pro_id, stv_kolicina, stv_cena, uk_stv_cena)
    VALUES (fk_stv_pro_id, stv_kolicina, stv_cena, uk_stv_cena)
    ON DUPLICATE KEY UPDATE
        stv_kolicina = VALUES(stv_kolicina),
        stv_cena = VALUES(stv_cena),
        uk_stv_cena = VALUES(uk_stv_cena);
  `;

  conn.query(query, [fk_stv_pro_id, stv_kolicina, stv_cena, uk_stv_cena], (err, results) => {
    if (err) {
      console.error('Error updating stavka:', err);
      return res.status(500).send('Error updating stavka');
    }
    res.send('Stavka updated successfully');
  });
});

// DELETE endpoint za brisanje svih stavki
app.delete('/stavke', (req, res) => {
  const { nar_id } = req.body;

  if (!nar_id) {
    return res.status(400).send('ID narudžbenice nije naveden.');
  }

  const deleteQuery = 'DELETE FROM narudzbenice_stavke WHERE nar_id = ?';
  
  conn.query(deleteQuery, [nar_id], (err) => {
    if (err) {
      console.error('Error deleting cart items:', err);
      return res.status(500).send('Error deleting cart items.');
    }

    res.send('Stavke uspešno obrisane.');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

