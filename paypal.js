const express = require('express');
const cors = require('cors');

 const Stripe = require('stripe');
const paypal = require('@paypal/checkout-server-sdk');
const stripe = Stripe('sk_test_51Pqfe9ClRBiTfY1yudZE8hL0x7pd1klsYMnVsZAscTXWdHKb6lcAhSUuuglkFXTjqoNmOvSJwO47Yo3irjtIY2Cm00Fdl0ERs1');
const app = express();

app.use(cors());
// Poruka Cannot GET paypal.js znači da tvoj backend server nema definisanu GET rutu za paypal.js.To je potpuno normalno, jer tvoj backend služi samo POST rute (/process-payment i /capture-payment), a ne fajlove ili GET zahteve za paypal.js.Zašto se ovo dešava? Ako u browseru otvoriš http://localhost:3012/paypal.js, dobiješ tu poruku jer ta ruta ne postoji.Tvoj backend je API, nije server za statičke fajlove.Šta treba da radiš?Ne otvaraj http://localhost:3012/paypal.js u browseru.Tvoj frontend treba da šalje POST zahteve na /process-payment i /capture-payment — to već radiš kroz PayPal dugme.Ako vidiš ovu poruku slučajno, ignoriši je.

//app.use(express.json()); Šta radi: Omogućava Express serveru da parsira JSON telo zahteva (req.body) u POST i PUT zahtevima. Zašto je bitno: Bez ove linije, req.body će biti undefined kada šalješ JSON sa frontendaSecret key (sk_test_...) se koristi samo na backendu — ovo je tajni ključ koji nikad ne sme da bude dostupan korisniku ili u frontendu.Publishable key (pk_test_...) ide u frontend i koristi se za kreiranje tokena ili klijentske autorizacije.Primer:Backend:
;
//Šta ova linija znači i šta trebaš da znaš za Stripe? Ova linija inicijalizuje Stripe klijent biblioteku za frontend ili backend (zavisno gde je korišćena).Ključ 'sk_test_YOUR_SECRET_KEY' je tvoj tajni (secret) ključ sa Stripe dashboard-a, koji koristiš na backendu za sigurnu komunikaciju sa Stripe API-jem.Za frontend se obično koristi publishable key (počinje sa pk_test_...), a za backend secret key (počinje sa sk_test_...).
//const stripe = Stripe('sk_test_YOUR_SECRET_KEY'); // zameni sa tvojim test ključem

//ako krece za http, to je url za paypal i to ne ide za backedn nego frontend
app.use(express.json())
let environment = new paypal.core.SandboxEnvironment(
  'sk_test_51Pqfe9ClRBiTfY1yudZE8hL0x7pd1klsYMnVsZAscTXWdHKb6lcAhSUuuglkFXTjqoNmOvSJwO47Yo3irjtIY2Cm00Fdl0ERs1' // stripe CLIENT SECRET - OBAVEZNO PRAVI KLJUČ
);
let client = new paypal.core.PayPalHttpClient(environment);

//Imam dva app post ChatGPT said:Ne, nije konfuzno — dva app.post() metoda su potpuno u redu i potrebna su, jer svaki služi drugoj svrsi u procesu PayPal plaćanja. Evo šta koji radi,  app,post process-payment = "Započni plaćanje, pošalji mi iznos."✔ app.post capture-payment = "Završi plaćanje, potvrdi novac."
//Super pitanje!PayPal-ove rute process-payment i capture-payment su specifične za PayPal API — ne mogu se direktno iskoristiti za Stripe.Stripe i PayPal imaju potpuno različite API-je i načine komunikacije, pa:Ne možeš koristiti PayPal-ove rute (process-payment, capture-payment) za Stripe.Za Stripe ti treba backend ruta koja pravi Payment Intent i eventualno potvrđuje uplatu, pošto Stripe ima svoj protokol.



  
  
    

const port = 3012;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});