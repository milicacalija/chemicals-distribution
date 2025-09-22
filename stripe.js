const express = require('express');
const cors = require('cors');
const app = express();
const stripe = require('stripe')('sk_test_51Pqfe9ClRBiTfY1yudZE8hL0x7pd1klsYMnVsZAscTXWdHKb6lcAhSUuuglkFXTjqoNmOvSJwO47Yo3irjtIY2Cm00Fdl0ERs1');
const db = require('./database.js'); // tvoja konekcija ka bazi

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

// Ruta za kreiranje PaymentIntent i insert u bazu
app.post('/api/save-payment', async (req, res) => {  try {
    const {
      fk_pa_usr_id,
      fk_pa_nar_id,
      cartItems,
      currency = 'rsd',
    } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Korpa je prazna.' });
    }

    if (!fk_pa_nar_id) {
      return res.status(400).json({ error: 'Nije definisana narudžbenica.' });
    }

    // Izračunaj ukupnu cenu iz cartItems
    const amount = cartItems.reduce((sum, item) => sum + (item.uk_stv_cena || 0), 0);

    // Kreiraj Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      //amount se računa direktno iz cartItems ako frontend ne šalje vrednost.
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
    });

    // Ubaci plaćanje u bazu
    const insertQuery = `
      INSERT INTO payments 
      (fk_pa_usr_id, fk_pa_nar_id, amount, currency, status, payment_method, stripe_payment_intent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
db.query(
      insertQuery,
      [fk_pa_usr_id, fk_pa_nar_id, amount, currency, 'pending', 'card', paymentIntent.id],
      (err, result) => {
        if (err) {
          console.error('Greška pri ubacivanju u bazu:', err);
          return res.status(500).json({ error: 'Greška pri ubacivanju plaćanja u bazu.' });
        } else {
          console.log('Plaćanje zabeleženo u bazi, id:', result.insertId);
          return res.json({ clientSecret: paymentIntent.client_secret });
        }
      }
    );

  } catch (err) {
    console.error('Stripe PaymentIntent error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Pokreni server
const port = 3015;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});