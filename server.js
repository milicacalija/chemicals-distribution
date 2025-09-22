const express = require('express');
const cors = require('cors');
const app = express();

// Uvoz ruta
const nalogRoutes = require('./nalog'); // rute za korisnike
const porukeRouter = require('./poruke'); // <-- importuješ router

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));//Da se ogranici unos poruke, duzina poruke
// Security header (opciono, može i da se isključi dok testiraš)
//app.use((req, res, next) => {
  /*res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:; connect-src 'self'; style-src 'self'; script-src 'self';"
  );
  next();*/


// Test ruta
app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

// Rute
app.use('/nalog', nalogRoutes);
// koristi router
app.use('/poruke', porukeRouter);



// Port (ili iz okruženja ili 3013)
const PORT = process.env.PORT || 3013;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//Problemi, Dupliraš MySQL konekciju.Već si napravila database.js za konekciju, a ovde u server.js opet praviš novu. To pravi konfuziju (i može da pravi greške ako koristiš različite baze, mi_baza i hemikalije_baza).👉 Rešenje: izbaci konekciju iz server.js, koristi samo database.js.Dupli cors().Imaš dva puta app.use(cors());. Nije greška, ali nepotrebno.PORT promenljiva.Definišeš i const port = 3012; i const PORT = process.env.PORT || 3013;.👉 Zadrži samo jedan (PORT sa process.env.PORT je bolja praksa).


