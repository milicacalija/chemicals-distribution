<template>
  <div class="register-page">
    <div class="register-card">
      <h1>Kreiraj nalog</h1>
      <div class="kontakt-forma">
        <!-- Podaci o kompaniji -->
        <input v-model="novi_pib" placeholder="Unesi PIB" />
        <span class="error" v-if="errors.novi_pib">{{ errors.novi_pib }}</span>
        <input v-model="nova_kompanija" placeholder="Unesi naziv kompanije" />
                <span class="error" v-if="errors.novi_pib">{{ errors.novq_kompanija }}</span>

        <input v-model="nova_adresa" placeholder="Unesi adresu" />

        <!-- Podaci o korisniku -->
        <input v-model="usr_name" placeholder="Vaše ime i prezime" />
        <span class="error" v-if="errors.usr_name">{{ errors.usr_name }}</span>
        <input v-model="usr_phone" placeholder="Unesi telefon" />
        <span class="error" v-if="errors.usr_phone">{{ errors.usr_phone }}</span>
        <input v-model="usr_email" placeholder="Unesi email" />
        <span class="error" v-if="errors.usr_email">{{ errors.usr_email }}</span>
        <input v-model="usr_password" type="password" placeholder="Unesi lozinku" />
        <span class="error" v-if="errors.usr_password">{{ errors.usr_password }}</span>
        <input v-model="usr_password_repeat" type="password" placeholder="Ponovi lozinku" />
        <span class="error" v-if="errors.usr_password_repeat">{{ errors.usr_password_repeat }}</span>

        <button class="button-input" @click="registerUser">Potvrdi</button>

      </div>
    </div>
  </div>
</template>


<script>
import Nalog from '@/components/Nalog.vue';
import axios from 'axios';

export default {
  name: 'NalogView',
  components: { Nalog },
  data() {
    //Bila je greska, da nova_kompanije nije definisana, zato je treba staviti u data
    
    return {
      fk_usr_kmp_id: null,       // id izabrane kompanije
    nova_kompanija: '',         // tekst unesene nove kompanije
    kompanije: [],
   novi_pib: '',
   nova_adresa: '',     
   usr_name: '',
    usr_email: '',
    usr_phone: '',
    usr_password: '',
        usr_password_repeat: '',  // novo polje
            errors: {}  // ovde ćemo čuvati greške za svaki input
     
    };
  },
  methods: {
//Validacija forme, u smislu ne moze bilo kakv karakter se upisivati
     validateForm() {
    this.errors = {}; // resetujemo greške

    // Ime i prezime – mora biti minimalno 3 karaktera, samo slova i razmaci
    if (!this.usr_name || this.usr_name.length < 3 || !/^[a-zA-Z\s]+$/.test(this.usr_name)) {
      this.errors.usr_name = 'Ime mora imati najmanje 3 slova i ne sme sadržati brojeve ili specijalne karaktere.';
    }

    // Email – osnovna provera
    if (!this.usr_email || !/^\S+@\S+\.\S+$/.test(this.usr_email)) {
      this.errors.usr_email = 'Unesite validan email.';
    }

    // Telefon – samo brojevi, min 6, max 15 cifara
    if (!this.usr_phone || !/^\d{6,15}$/.test(this.usr_phone)) {
      this.errors.usr_phone = 'Telefon mora sadržati samo brojeve (6-15 cifara).';
    }

    // PIB – npr. samo brojevi, tačno 8 cifara
    if (!this.novi_pib || !/^\d{8}$/.test(this.novi_pib)) {
      this.errors.novi_pib = 'PIB mora sadržati tačno 8 cifara.';
    }

    // Lozinka – minimalno 6, maksimalno 20 karaktera
    if (!this.usr_password || this.usr_password.length < 6 || this.usr_password.length > 20) {
      this.errors.usr_password = 'Lozinka mora imati 6-20 karaktera.';
    }

    // Ponovljena lozinka mora da se poklapa
    if (this.usr_password !== this.usr_password_repeat) {
      this.errors.usr_password_repeat = 'Lozinke se ne poklapaju.';
    }

    // Naziv kompanije i adresa – obavezno
    if (!this.nova_kompanija) {
      this.errors.nova_kompanija = 'Unesite naziv kompanije.';
    }
    if (!this.nova_adresa) {
      this.errors.nova_adresa = 'Unesite adresu kompanije.';
    }

    // Ako ima grešaka, vratimo false
    return Object.keys(this.errors).length === 0;
  },
    async registerUser() {

      if (!this.validateForm()) {
      // Ako forma nije validna, prikazujemo greške
      return;
    }
  try {
     // Provera da li se lozinke poklapaju
    if (this.usr_password !== this.usr_password_repeat) {
      this.message = "Lozinke se ne poklapaju!";
      return;
    }

    let idKompanije = this.fk_usr_kmp_id;

    // Ako je unesena nova kompanija, prvo je ubaci na 3004
    if (!idKompanije && this.nova_kompanija) {
      const resKmp = await axios.post('http://localhost:3004/kompanije', {
  kmp_pib: this.novi_pib,
  kmp_naziv: this.nova_kompanija,
  kmp_adresa: this.nova_adresa,
  kmp_telefon: this.usr_phone,  // korisnikov telefon
  kmp_email: this.usr_email,    // korisnikov email
  kmp_osoba: this.usr_name      // ime i prezime korisnika

});
      idKompanije = resKmp.data.id; // id nove kompanije
    }

    // Registracija korisnika na 3013
    const res = await axios.post('http://localhost:3013/nalog/register', {
      usr_name: this.usr_name,
      usr_email: this.usr_email,
      usr_password: this.usr_password,
      usr_phone: this.usr_phone,
      
  fk_usr_kmp_id: idKompanije       // id kompanije ako postoji  
    });

    this.message = res.data.message;

  // 1) Prikaz poruke korisniku
    alert(res.data.message || 'Nalog uspešno kreiran!');

    // 2) Sačuvaj podatke u localStorage
    localStorage.setItem('usr_id', res.data.id);
    localStorage.setItem('userName', this.usr_name);
    localStorage.setItem('userEmail', this.usr_email);
    localStorage.setItem('userPhone', this.usr_phone);
        localStorage.setItem('usr_pib', this.novi_pib);
    localStorage.setItem('userLevel', 1);

    alert('Nalog je uspešno kreiran! Sada se možete prijaviti.');
this.$router.push('/login'); // preusmeri na login formu

  } catch (err) {
    console.error('Greška axios:', err);
    alert(err.response?.data?.message || 'Greška na serveru');
  }}}}
//Treba to standardizovati na async/await ili na .then/.catch, a ne mešati obe stvari.
</script>

    <style scoped>
* {
  box-sizing: border-box;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}
.error {
  color: red;             /* crvena boja */
  font-size: 16px;        /* malo veći font da se vidi */
  font-weight: bold;      /* naglašeno */
  margin-top: 2px;        /* razmak od inputa */
  display: block;         /* da zauzima ceo red ispod inputa */
}

.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
}

.register-card {
  background-color: #fff;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.register-card h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #334e68;
}

.kontakt-forma {
  display: grid;
  gap: 15px;
}

.kontakt-forma input {
  width: 100%;
  padding: 12px 15px;
  border: 1.5px solid #641515;
  border-radius: 8px;
  font-size: 1em;
}

.button-input {
  background-color: #4a90e2;
  color: #fff;
  font-weight: bold;
  font-size: 1em;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.button-input:hover {
  background-color: #357ab8;
  transform: translateY(-2px);
}

.message {
  text-align: center;
  color: #d9534f; /* crvena za greške ili obaveštenja */
  margin-top: 15px;
}
</style>