//da se aktivira stripe za placanje putem kartica , o Stripe radi u backendu (ukratko):Kreiraš Payment Intent sa željenim iznosom, valutom itd.Vraćaš Payment Intent klijent strani (frontend-u)Frontend poziva Stripe SDK da potvrdi uplatu (npr. preko stripe.confirmCardPayment) Backend može slušati webhook za potvrdu (nije obavezno ali je preporučljivo)
// routes/payment.js

//Payment.js se nikad ne pokrece kao poseban file npr node payment.js jer je to u slopu router i to se pokrece iz glavnog foldera server.js gde je uslovljena glavna ruta u komuniciranju sa payment.js , kad se pokrene server.js onda se pokrece i payment.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51Pqfe9ClRBiTfY1yudZE8hL0x7pd1klsYMnVsZAscTXWdHKb6lcAhSUuuglkFXTjqoNmOvSJwO47Yo3irjtIY2Cm00Fdl0ERs1'); // zameni sa tvojim pravim ključem secret key

//payment_method iz req body brisemo i confirm možeš izostaviti u kreiranju PaymentIntenta, jer ćeš potvrdu (confirmation) da radiš sa Stripe.js na frontendu koristeći clientSecret.Backend samo kreira PaymentIntent i vraća clientSecret.Frontend onda koristi stripe.confirmCardPayment(clientSecret, {...}) da potvrdi uplatu//Nemoj potvrđivati uplatu u backend-u (confirmation_method: 'manual' i confirm: true možeš ukloniti).//Vraćaj JSON odgovor sa { clientSecret: paymentIntent.client_secret }.
//Na frontend-u često se šalju item.price i item.quantity kao stringovi. Na primer:U tom slučaju, item.price * item.quantity može dati NaN ako se implicitno ne konvertuje u broj. i zato vraca response NAN
router.post('/create-payment-intent', async (req, res) => {

  try {
    const { cartItems } = req.body;
console.log('Primljeni cartItems:', req.body.cartItems);
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Nema stavki u korpi.' });
    }

    // Izračunaj ukupnu cenu, bila je greska price undefined jer iz korpe koja se salje nemamo definisani item.price i item.quanitiy
    const ukupnaCena = cartItems.reduce((sum, item) => {
  console.log('price:', item.stv_cena, 'quantity:', item.stv_kolicina);
  return sum + item.stv_cena * item.stv_kolicina;
}, 0);
    const amount = Math.round(ukupnaCena * 100); // Stripe očekuje iznos u lipama/centima
 if (isNaN(ukupnaCena)) {
  return res.status(400).send({ error: 'Ukupna cena nije validna.' });
}
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'rsd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe greška:', err);
    res.status(500).send({ error: err.message });
  }
});




    
module.exports = router;
