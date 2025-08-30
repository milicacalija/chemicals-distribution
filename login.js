let mysql = require("mysql");
let express = require ("express");
/*Na pocetku mi je izbacivalo gresku cors is not defined, zato sto uopste nisam definisala promenljivu cors, a kad izbaci gresku module not found to znaci da cors paket treba instalirati */
const cors = require('cors');


const app = express();
var port = 3003;


app.use(express.json());


// Primena CORS middleware samo na određene rute

app.use((req,res,next)=>{/*Ovaj app nam sluzi da mozemo pristupamo preko AJAX, tri hedera koja kazu browseru da sme da se obrati sa bilo kog Origin, sa bilo kog domena to znaci ova zvezdica u zagradi
 Zatimsa bilo koje metode moze da se obrati u zagradi su navdene metode
 Dozvoljava cak i Header Content type, i onda ce browser da izvrsi AJAX*/
    res.append('Access-Control-Allow-Origin',["*"]);
    res.append('Access-Control-Allow-Methods',['GET,PUT,POST, DELETE, PATCH']);
    res.append('Access-Control-Allow-Headers','Content-Type');
    next();
});
const conn = mysql.createConnection({
  host: "localhost", 
  user: "root",      
  password: "root123", 
  port: "3306",    
  database: "hemikalije_baza"
}); 
conn.connect(function() {
  
  console.log('MySql connected !');
});





app.listen(port, ()=>{
  console.log("App listening on: "+port);
});



app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  console.log("Email:", email);
  console.log("Password:", password);

  conn.query(
    //Da pri logovanju odmah znamo email i naziv kompanije korisnika, informacije hvatamo u local storage
    "SELECT usr_id, usr_name, usr_email, usr_password, usr_phone, usr_level, fk_nar_id,  kompanije.kmp_naziv FROM users LEFT JOIN kompanije ON users.fk_usr_kmp_id = kompanije.kmp_id WHERE usr_email=? AND usr_password=?",
    [email, password],
    (err, rows, fields) => {
      if (err) {
        console.error('Greška prilikom izvršavanja SQL upita:', err);
        res.status(500).json({"Result": "ERR", "Message": "Internal Server Error"});
        return;
      }
      console.log('Rows from database:', rows);

      if (rows.length === 0) {
        res.status(401).json({"Result": "ERR", "Message": "Invalid credentials"});
        return;
      }

      res.json({"Result": "OK", "data": rows[0]});
      console.log('JSON odgovor:', {"Result": "OK", "data": rows[0]});
    }
  );
});
    

