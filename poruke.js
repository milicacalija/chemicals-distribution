const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3014;

//Importovanje fajla poruke.js rute ide dalje na index.js

const router = express.Router();

// ✉️ Dodavanje nove poruke
router.post('/', (req, res) => {
  const { fk_user_id_sender, user_id_receiver, por_content, tip } = req.body;

  if (!fk_user_id_sender || !por_content) {
    return res.status(400).json({ message: 'Sender i sadržaj su obavezni' });
  }

  const query = `
    INSERT INTO poruke (fk_user_id_sender, user_id_receiver, por_content, tip)
    VALUES (?, ?, ?, ?)
  `;

  conn.query(query, [fk_user_id_sender, user_id_receiver || null, por_content, tip || 'pitanje'], (err, result) => {
    if (err) return res.status(500).json({ message: 'Greška pri upisu poruke', err });
    res.json({ message: 'Poruka uspešno poslata!', id: result.insertId });
  });
});

// 🔹 Dohvatanje svih poruka (admin)
router.get('/all', (req, res) => {
  conn.query('SELECT * FROM poruke ORDER BY por_time DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Greška pri dohvatanju poruka' });
    res.json(rows);
  });
});

// 🔹 Promena statusa poruke (admin)
router.put('/:id/status', (req, res) => {
  const por_id = req.params.id;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: 'Status je obavezan' });

  conn.query('UPDATE poruke SET status=? WHERE por_id=?', [status, por_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Greška pri ažuriranju statusa' });
    res.json({ message: 'Status uspešno promenjen' });
  });
});
module.exports = router;  // <-- OBAVEZNO exportovati router

