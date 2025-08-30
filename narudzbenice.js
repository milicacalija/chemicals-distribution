//de generisati PDFNe u mixin.js – mixin.js je frontend (Vue) i nema pristup serveru, bazama i SMTP.PDF i slanje mejla mora ići preko backend-a, npr. u narudzbenice.js ili posebnom fajlu za mail/PDF.Razlog: samo backend ima:pristup bazi da dobije stavke narudžbine,mogućnost da šalje mail preko SMTP-a,mogućnost da generiše i sačuva PDF.


//Ne, POST je u potpunosti ispravan za ubacivanje stavki u bazu. Evo zašto:POST se koristi kada pravimo novi resurs na serveru, što je upravo tvoj slučaj:Kreiraš novu narudžbenicu u narudzbenice.Ubacuješ nove stavke u stavke.PUT se obično koristi za izmenu postojećeg resursa:Ako bi menjao već postojeću narudžbenicu ili njene stavke, tada bi PUT bio ispravan.Dakle:POST /narudzbenice → kreira novu narudžbenicu i stavke.PUT /narudzbenice/:id → menja narudžbenicu ili njene podatke.

//Zašto dobijaš CORS Failed,,Ako ti je frontend na http://localhost:3000, to su različiti portovi, pa browser blokira zahtev osim ako server eksplicitno ne dozvoli.Zato axios javlja: "Response body is not available to scripts (Reason: CORS Failed)
const express = require('express');
const mysql = require('mysql');
const moment = require('moment-timezone');
//Za kreiranje pdf dokumnata putem emaila, ali da ne budu izopacena slova koristi se paket instaliran puppeteer
const puppeteer = require('puppeteer');
const fs = require("fs");
    const path = require('path');

const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const cors = require('cors'); // <---- OVO DODAJES

// Inicijalizacija aplikacije
const app = express();

const port = 3005;
// Middleware za parsiranje JSON tela

// Umesto da rucno ne podesavamo  cors paket, zato koristimo opciju dole ispod
// 🔹 Koristimo cors paket umesto ručnog podešavanja, e da bi ovo funkcionisalo prethodno definisati cont cors i npm install cors za ovaj paket
app.use(cors({
  origin: 'http://localhost:8080', // frontend adresa
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));




const conn = mysql.createConnection({
    /*Onda saljemo objekat kao argument*/
    host: "localhost",
    user: "root",
    port:'3306',
    password:"root123",
    database: "hemikalije_baza"
});
module.exports = conn;


conn.connect((err) => {
    if(err) throw err;
    console.log("MySql Connected");


});
//Ovo mora biti pre svih ruta (app.post(...) itd).

app.use(express.json());



//Vidim šta se desilo 🙂U tvom backend kodu na ruti /narudzbenice napravila si problem sa beskonačnim pozivom – sama ruta poziva samu sebe preko axios.post('http://localhost:3005/narudzbenice', narudzbenicaData).👉 To pravi "petlju" jer se svaki POST na /narudzbenice ponovo šalje na /narudzbenice i nikad ne završi.Kako da ispraviš:U backendu ti ne treba axios da šalješ zahtev samoj sebi. Backend samo prima podatke, obrađuje ih i vraća odgovor. Axios se koristi na frontendu.Evo ispravljene verzije app.post('/narudzbenice', ...) bez nepotrebnog axios dela:




/*zatim treba napraviti konekciju uz pomoc var conn taj sam malo kasnije zapisala, kod var conn imamo host to je lokalhot, user, to je kod nas rooter, password koji koristim za mysql, database je naziv seme koju zelim da povezem */

/*Da bismo napravili konekciju kazemo, ako se desi glupost izbaci gresku, greske mogu biti posledica ako nesto iz podataka kao sto je username, password, schema itd nije tacno uneto, i ako se ne uhvati exception rusi se celo okruzenje servera, to nam je veoma vazno, da ne bi ispalo da server radi a nema nikakvu konekciju sa bazom!*/

/*Da ne bi ispalo da server ne radi nista, ako nam neko dodje na HOME stranu, mi cemo njega da pozdravimo i kazemo HELLO! Ovo je primer najbanalnijeg servera*/
app.get("/",function(req,res){ /*F-je koje imaju zahteve, moraju da imaju HTTP req i HTTP res, to su argumenti u zagradi u f-ji*/
    res.json({message:"Hello"})
});


// Dohvatanje svih narudžbenica, u suprtonom nece moci get zahtev obraditi
// Dohvatanje svih narudžbenica sa podacima o korisniku
app.get('/narudzbenice', (req, res) => {
    const query = `
        SELECT narudzbenice.*, users.usr_email AS email, users.usr_name AS name 
        FROM narudzbenice 
        JOIN users ON narudzbenice.fk_nar_usr_id = users.usr_id
        JOIN stavke  ON stavke.fk_stv_nar_id = narudzbenice.nar_id
    JOIN proizvodi  ON proizvodi.pro_id = stavke.fk_stv_pro_id
    LEFT JOIN proizslike  ON proizslike.fk_prs_pro_id = proizvodi.pro_id
    `;
    conn.query(query, (err, results) => {
        if (err) {
            console.error('Greška prilikom dohvaćanja narudžbenica:', err);
            return res.status(500).json({ error: 'Greška prilikom dohvaćanja narudžbenica' });
        }
        

        // Konvertuj datume u Europe/Belgrade
        results.forEach(order => {
            order.nar_datum = moment(order.nar_datum).tz('Europe/Belgrade').format('YYYY-MM-DD HH:mm:ss');
        });

        res.json(results);
    });
});
/*Hocu da podatke prikazem sa baze na frontendu, npr tabela kompanije, komuniciramo sa appijem preko GET metode*/

app.get('/narudzbenice/:nar_id', (req, res) => {
    const { nar_id } = req.params;

    if (!nar_id) {
        return res.status(400).json({ error: 'ID narudžbenice nije prosleđen' });
    }

    const query = 'SELECT * FROM narudzbenice WHERE nar_id = ?';

    conn.query(query, [nar_id], (err, results) => {
        if (err) {
            console.error('Greška prilikom dohvaćanja narudžbenice:', err);
            return res.status(500).json({ error: 'Greška prilikom dohvaćanja narudžbenice' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Narudžbenica nije pronađena' });
        }

        // Konvertovanje vremena u 'Europe/Belgrade'
        const date = new Date(results[0].nar_datum);
        results[0].nar_datum = date.toLocaleString('en-US', { timeZone: 'Europe/Belgrade', hour12: false });

        res.json(results[0]);
    });
});

//endOrderPDFEmail je helper funkcija koju samo koristiš unutar rute, ona ne treba da bude u samoj app.post.Ako je definisana pre rute, Node.js zna za nju u trenutku kada se ruta pozove → i onda je možeš normalno zvati sa:
///eferenceError: generateOrderPDF is not defined obično znači da:Ili funkcija generateOrderPDF nije definisana u istom fajlu gde se pozivaIli je definisana posle upotrebe, pa je Node ne prepoznaje (ako koristiš const generateOrderPDF = ... sintaksu umesto function generateOrderPDF)

// Funkcija za generisanje PDF-a pomoću Puppeteer-a
// Funkcija za generisanje PDF-a pomoću Puppeteer-a

//Na vrh vajla dodajmo putanju za sliku z, logo firme


async function generateOrderPDF(orderData, pdfPath) {
  console.log ("Email poslat", orderData)//da vidimo uopset da li email stize do ove

  // Učitaj PNG i konvertuj u base64 da bi se PNG ocitala u pdf skripti, Greška ENOENT znači da fajl ne postoji tamo gde Node misli da je.
  const chemicalLogoPath = path.resolve(__dirname, 'src/assets/chemical.png');
const chemicalLogo = fs.readFileSync(chemicalLogoPath, { encoding: 'base64' });
  // HTML template za PDF
  const html = `
  <!DOCTYPE html>
  <html lang="sr">
  <head>
    <meta charset="UTF-8">
    <title>Narudžbenica #${orderData.nar_id}</title>

    
    <style>
.logo-header {
  display: flex;
  align-items: center;
}
.logo-header img {
  width: 65px;
  height: auto;
}
.logo-header p {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 34px;
  color: #6a1d1d;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
  margin-bottom: 8px;
}
      body { font-family: Arial, sans-serif; margin: 30px; line-height: 1.4; }
      h1 { text-align: center; }
      h2 { text-align: right; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #000; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      .footer { margin-top: 40px; font-size: 12px; text-align: center; }
      .note { margin-top: 20px; font-size: 14px; }
    </style>
  </head>
  <body>
   <div class="logo-header">
   
      <img src="data:image/png;base64,${chemicalLogo}" alt="Chemical Logo" />
      <p>CHEMICALS</p>
    </div>

  
    <h1>Narudžbenica</h1>

    <p><strong>ID narudžbenice:</strong> ${orderData.nar_id}</p>
    <p><strong>Datum:</strong> ${orderData.nar_datum}</p>
    <p><strong>Kupac:</strong> ${orderData.kupac_ime || "-"}</p>
    <p><strong>Firma:</strong> ${orderData.kupac_firma || "-"}</p>
    <p><strong>Email:</strong> ${orderData.kupac_email || "-"}</p>
    <p><strong>Adresa isporuke:</strong> ${orderData.kupac_adresa || "-"}</p>
    <p><strong>Način plaćanja:</strong> Plaćanje pouzećem</p>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Proizvod</th>
          <th>Količina</th>
          <th>Cena</th>
          <th>Ukupno</th>
        </tr>
      </thead>
      <tbody>
        ${orderData.stavke.map((s, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${s.naziv}</td>
            <td>${s.stv_kolicina}</td>
            <td>${s.stv_cena} RSD</td>
            <td>${s.uk_stv_cena} RSD</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>Ukupno: ${orderData.nar_cena} RSD</h2>

    <p class="note">
      <strong>Napomena:</strong> Plaćanje se vrši isključivo <u>gotovinom prilikom isporuke</u>.  
      Molimo Vas da pripremite tačan iznos. 
    </p>

    <div class="footer">
      <p>Hvala što ste naš kupac!</p>
      <p>Za pitanja i podršku obratite se na: chemicals@chemistry.com</p>
    </div>
  </body>


  </html>
  `;

  // Pokretanje Puppeteer-a i kreiranje PDF-a
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  await browser.close();

  console.log(`✅ PDF kreiran: ${pdfPath}`);
  return pdfPath;
}

module.exports = generateOrderPDF;

// 2️⃣ Funkcija za slanje mejla sa PDF-om
async function sendOrderPDFEmail(toEmail, orderData) {
  console.log("Email koji pokušavamo da pošaljemo:", orderData.kupac_email);
  const pdfPath = `./narudzbenica_${orderData.nar_id}.pdf`;
  await generateOrderPDF(orderData, pdfPath);


  

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "kavon.klocko6@ethereal.email", // ubaci podatke sa Ethereal-a
      pass: "kmTyGFBCkkMWq3QYuW"
    },
    tls: { rejectUnauthorized: false }
  });

  let info = await transporter.sendMail({
    from: `"Test App" <kavon.klocko6@ethereal.email>`,
    to: toEmail,
    subject: `Narudžbenica #${orderData.nar_id}`,
    text: "U prilogu se nalazi PDF vaše narudžbenice.",
    attachments: [
      { filename: `narudzbenica_${orderData.nar_id}.pdf`, path: pdfPath }
    ]
  });

  console.log("📨 Mejl sa PDF-om poslat:", nodemailer.getTestMessageUrl(info));
}




//Ukratko: nar_id se nikad ne šalje iz fronta, već ga MySQL generiše sam.Zato ti provera trenutno uvek pada jer nar_id nije u req.body.

//Problem: ti tražiš i nar_id u telu zahteva, ali nar_id je AUTO_INCREMENT primarni ključ u bazi, znači ne šalje se sa frontenda — baza ga sama kreira, nikad Auto increment primarni kljuc ne definise u konstanti u okviru post zahteva, jer baza ga sam kreira, znaci ne moze korisnik id da posalje
app.post('/narudzbenice', (req, res) => {
  const { fk_nar_usr_id, nar_datum, nar_cena, nac_plat, stavke = [] } = req.body;

  if (!fk_nar_usr_id || !nar_datum || !nar_cena || !nac_plat) {
    return res.status(400).json({ error: 'Nedostaju obavezni podaci' });
  }

  // 1) Ubacivanje narudžbenice
  const sqlNar = `
    INSERT INTO narudzbenice (nar_datum, fk_nar_usr_id, nar_cena, nac_plat)
    VALUES (?, ?, ?, ?)
  `;
  //conn.query callback ne sme da se zatvori sa ) pre nego što završiš telo funkcije. Ispravno je ovako:
  conn.query(sqlNar, [nar_datum, fk_nar_usr_id, nar_cena, nac_plat], (err, insertResult) => {
    if (err) {
      console.error('Greška pri dodavanju narudžbenice:', err);
      return res.status(500).json({ error: 'Greška pri dodavanju narudžbenice' });
    }

    //tvovoj nar_id je definisan unutar callback-a conn.query za narudžbenicu, ali kod za ubacivanje stavki je van tog callback-a. Zato Node.js javlja ReferenceError: nar_id is not defined — jednostavno, u tom delu koda nar_id ne postoji.🔑 Bitno: Sve što zavisi od nar_id mora biti unutar callback-a gde je nar_id definisan.

    const nar_id = insertResult.insertId;

    
  // 2) Ako nema stavki
    if (!Array.isArray(stavke) || stavke.length === 0) {
      return res.status(201).json({
        success: true,
        message: 'Narudžbenica sačuvana (bez stavki)',
        nar_id
      });
//  // 3) Bulk INSERT stavki — mora biti unutar callback-a jer koristi nar_id
    } // 3) Bulk INSERT stavki
    const values = stavke.map(s => {
      const kolicina = Number(s.stv_kolicina) || 0;
      const cena     = Number(s.stv_cena) || 0;
      const ukCena   = kolicina * cena;
      return [kolicina, cena, s.fk_stv_pro_id, nar_id, ukCena];
  
  });

 const sqlStavke = `
      INSERT INTO stavke (stv_kolicina, stv_cena, fk_stv_pro_id, fk_stv_nar_id, uk_stv_cena)
      VALUES ?
    `;
    conn.query(sqlStavke, [values], (err2) => {
  if (err2) {
    console.error('Greška pri dodavanju stavki:', err2);
    return res.status(500).json({ error: 'Greška pri dodavanju stavki' });
  }

  // 4) Dohvati email korisnika iz users tabele
  const sqlUser = `SELECT usr_email FROM users WHERE usr_id = ?`;
  conn.query(sqlUser, [fk_nar_usr_id], (err3, results) => {
    if (err3 || results.length === 0) {
      console.error('Greška pri dohvaćanju korisnikovog emaila:', err3);
      return res.status(500).json({ error: 'Greška pri dohvaćanju korisnikovog emaila' });
    }

    const korisnikovEmail = results[0].usr_email;
    console.log('✅ Narudžbenica i stavke ubačene, nar_id =', nar_id)

     // 5) Dohvati nazive proizvoda i cene za stavke
    const proIds = stavke.map(s => s.fk_stv_pro_id);
    const sqlProizvodi = `SELECT pro_id, pro_iupac, pro_cena FROM proizvodi WHERE pro_id IN (?)`;

    conn.query(sqlProizvodi, [proIds], (err4, proRez) => {
      if (err4) {
        console.error('Greška pri dohvaćanju proizvoda:', err4);
        return res.status(500).json({ error: 'Greška pri dohvaćanju proizvoda' });
      }

      const stavkeSaNazivima = stavke.map(s => {
        const p = proRez.find(pr => pr.pro_id === s.fk_stv_pro_id);
        console.log('➡️ Stavka:', s, '=> Proizvod:', p);
        return {
          naziv: p ? p.pro_iupac : "Nepoznata stavka",
          stv_kolicina: s.stv_kolicina || 1,
          stv_cena: p ? p.pro_cena : 0,
          uk_stv_cena: (s.stv_kolicina || 1) * (p ? p.pro_cena : 0),
        };
      });

      //Pre nego sto prosledimo sendOrderPDF moramo reba da napraviš jedan objedinjeni objekat orderData koji uključuje:informacije o narudžbenici (nar_id, nar_datum, nar_cena)informacije o kupcu (kupac_ime, kupac_email, kupac_firma, kupac_adresa)stavke sa nazivima i cenama (stavkeSaNazivima)I onda ga proslediš funkciji sendOrderPDFEmail:
      // U narudzbenice.js, nakon što ubaciš stavke u bazu
const sqlUser = `
  SELECT users.usr_id, users.usr_name, users.usr_email, kompanije.kmp_adresa, kompanije.kmp_naziv 
  FROM users 
  LEFT JOIN kompanije ON users.fk_usr_kmp_id = kompanije.kmp_id
  WHERE users.usr_id = ?
`;

conn.query(sqlUser, [fk_nar_usr_id], (errUser, resultsUser) => {
  if (errUser || resultsUser.length === 0) {
    return res.status(500).json({ error: "Greška pri dohvatanju korisnika" });
  }

  const userData = resultsUser[0];

  const orderData = {
    nar_id,
    nar_datum,
    nar_cena,
    kupac_ime: userData.usr_name,
    kupac_firma: userData.kmp_naziv || "-",
    kupac_email: userData.usr_email,
    kupac_adresa: userData.kmp_adresa || "-",
    stavke: stavkeSaNazivima
  };



    // 5) Pošalji mejl sa PDF-om
sendOrderPDFEmail(userData.usr_email, orderData)
  .then(() => {
    res.status(201).json({
      success: true,
      message: 'Narudžbenica i stavke uspešno sačuvane, mejl poslat',
      nar_id
    });
  })
  .catch(err => {
    console.error("❌ Greška pri slanju mejla:", err);
    res.status(500).json({ error: 'Greška pri slanju mejla' });
  });


   
    });
    }); // ← ovo zatvara conn.query callback
})
});
});
});


    

    

     
   
//Ah, vidim gde je problem – kod ti je trenutno nepravilan jer map vraća objekat, a ti pomešaš return za map sa JSON odgovorom (res.status(201)…). Zato ti se pojavljuju undefined i NaN.





    //Greska tipa XHRPOSThttp://localhost:3005/narudzbenice[HTTP/1.1 500 Internal Server Error 187ms]error	"Greška prilikom kreiranja narudžbenice"details	"ER_NO_REFERENCED_ROW_2: Cannot add or update a child row: a foreign key constraint fails (`hemikalije_baza`.`narudzbenice`, CONSTRAINT `fk_nar_stv_id` FOREIGN KEY (`fk_nar_stv_id`) REFERENCES `stavke` (`stv_id`))"
    // Proveri da li su svi obavezni podaci prisutni
    
    // Konvertovanje vremena u Beogradsku vremensku zonu
   
    // SQL upit za kreiranje narudžbenice . Narudžbenice ↔ Stavkeveza 1:N (jedna narudžbenica ima više stavki)svaka stavka mora znati kojoj narudžbenici pripada (fk_stv_nar_id).2. Stavke ↔ Proizvodiveza N:1 (jedna stavka se odnosi na tačno jedan proizvod)ovde ide fk_stv_pro_id.3. Narudžbenice ↔ Proizvodi nema direktne veze ✔️jer narudžbenica sama po sebi ne "zna" proizvode → ona ih dobija preko stavki.
    
    
//INSERT je obavezan, jer kreira red u bazi.SELECT (taj getQuery) nije obavezan, ali je praktičan jer frontend odmah dobije sve podatke o narudžbenici, uključujući i nar_id koji je generisan u bazi.Ako ti na frontendu treba da znaš ID nove narudžbenice (da bi dodala stavke, pratila status, prikazala korisniku potvrdu itd.), onda getQuery ostavi.Ako ti nije bitan ID i samo ti treba poruka "Uspešno kreirano", možeš ga izbaciti.
      // SQL upit za dobijanje svih podataka o kreiranoj narudžbenici
       
            

            //Problem je kombinacija opsega promenljivih i redosleda:stavke mora da se izvuče iz req.body (inače je undefined).forrEach koristiš s (jednu stavku), ne stavke.Ne šalji response (res.status(...).json(...)) pre nego što upišeš sve stavke – tvoj kod trenutno radi res.json(results[0]), pa tek onda pokušava da radi insert stavki (što i da radi, opet bi bacio “Cannot set headers after they are sent”).Tačno ✅ – u tabeli narudzbenice nema kolone stavke, i ne treba je dodavati u INSERT za narudzbenice.Ali u backend kodu ti stavke služi kao promenljiva koja dolazi iz frontenda i predstavlja niz proizvoda koje korisnik kupuje. Ti ih ne ubacuješ u narudzbenice, već ih koristiš za ubacivanje u tabelu stavke, gde već imaš kolone:
    // vrati prvu pronađenu narudžbenicu
 
       
   

app.put('/narudzbenice/:id', (req, res) => {
    const { id } = req.params;
    const { fk_nar_user_id, fk_nar_kmp_id, nar_cena } = req.body;
    const nar_datum = moment().tz('Europe/Belgrade').format('YYYY-MM-DD HH:mm:ss');

    // Ažuriranje narudžbenice
    const query = 'UPDATE narudzbenice SET nar_datum = ?, fk_nar_user_id = ?, fk_nar_kmp_id = ?, nar_cena = ? WHERE nar_id = ?';
    conn.query(query, [nar_datum, fk_nar_user_id, fk_nar_kmp_id, nar_cena, id], (err) => {
        if (err) {
            console.error('Error during UPDATE:', err);
            return res.status(500).json({ error: 'Došlo je do greške prilikom ažuriranja narudžbenice.' });
        }

        // Brisanje postojećih stavki
        const deleteQuery = 'DELETE FROM narudzbenice_stavke WHERE nar_id = ?';
        conn.query(deleteQuery, [id], (err) => {
            if (err) {
                console.error('Error during DELETE:', err);
                return res.status(500).json({ error: 'Došlo je do greške prilikom brisanja stavki.' });
            }

            // Dodavanje novih stavki
            if (stavke && stavke.length > 0) {
                const queryStavke = 'INSERT INTO narudzbenice_stavke (nar_id, stv_id, fk_naruid, fk_stavid, narst_kolicina) VALUES ?';
                const values = stavke.map(stavka => [id, stavka.stv_id, stavka.fk_naruid, stavka.fk_stavid, stavka.narst_kolicina]);

                conn.query(queryStavke, [values], async (err) => {
                    if (err) {
                        console.error('Error inserting order items:', err);
                        return res.status(500).json({ error: 'Error inserting order items' });
                    }

                    // Ažuriranje ukupne cene narudžbenice
                    await updateOrderTotalPrice(id);

                    res.json({ id: id });
                });
            } else {
                // Ako nema stavki, samo ažurirajte cenu
                 updateOrderTotalPrice(id);
                res.json({ id: id });
            }
        });
    });
});

/*APPI pozovemo za brisnje*/

/*APPI pozovemo za brisnje*/

app.delete("/narudzbenice", function(req,res){

    /*Problem sa specifikacijom za DELETE, pa umseto body poslacemo podatke preko URL, tj query*/
var id= req.query.id;
/*Imala sam gresku sa upitom u smislu nije hteo da mi obrise zato sto u sintaksi nisam imala zarez na kraju upitnika , kad se obrise komapnija, server tu infromaciju ne komentarise*/
conn.query("DELETE FROM narudzbenice WHERE nar_id=?",[id],
function(err,result,fields){
    if(err) throw err;
    res.json({"Result":"OK"});
    /*Kad budemo radili validaciju, npr ako je result OK refresh usere ako je result error, prikazi msg */
});
});
    
app.listen(port,function(){
console.log ("web server radi!");
});
