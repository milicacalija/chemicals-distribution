<template>
  <div>
    <h1>Narudzbenica</h1>
    <table>
      <thead>
        <tr>
          <th>Nar ID</th>
          <th>Nar Datum</th>
          <th>User ID</th>
          
          <th>Cena</th>
         
          <th>Akcije</th>
        </tr>
      </thead>
      <tbody>
    <tr v-if="narudzbenice.length > 0" :key="narudzbenice[0].nar_id">
        <td>{{ narudzbenice[0].nar_id }}</td>
        <td>{{ formatDateToTimeZone(narudzbenice[0].nar_datum, 'Europe/Belgrade') }}</td>
        <td>{{ narudzbenice[0].fk_nar_user_id }}</td>
        <td>{{ narudzbenice[0].nar_cena }}</td>
    
        <td>
            <ul>
                <li v-for="stavka in narudzbenice[0].stavke" :key="stavka.stv_id">
                    Stavka ID: {{ stavka.stv_id }} - Količina: {{ stavka.stv_kolicina }}
                </li>
            </ul>
        </td>
        <td>
            <button @click="editNarudzbenica(narudzbenice[0])">Izmeni</button>
        </td>
    </tr>
</tbody>
    </table>

    <button @click="goToKupovina" class="add-korpa"> Nastavi sa kupovinom</button>
    <h2>Dodaj/Izmeni Narudzbenicu</h2>
    <form @submit.prevent="saveNarudzbenica">
      <div>
        <label for="nar_datum">Datum:</label>
        <input type="date" v-model="form.nar_datum" required />
      </div>
      <div>
        <label for="fk_nar_user_id">User ID:</label>
        <input type="number" v-model="form.fk_nar_user_id" required />
      </div>
      <div>
        <label for="fk_nar_kmp_id">Kmp ID:</label>
        <input type="number" v-model="form.fk_nar_kmp_id" required />
      </div>
      <div>
        <label for="nar_cena">Cena:</label>
        <input type="number" v-model="form.nar_cena" required />
      </div>
      <div>
        <label for="stavke">Stavke:</label>
        <select v-model="selectedStavkaId">
          <option v-for="stavka in stavke" :key="stavka.stv_id" :value="stavka.stv_id">
            Stavka ID: {{ stavka.stv_id }} - Količina: {{ stavka.stv_kolicina }}
          </option>
        </select>
        <button @click="addStavkaToNarudzbenica">Dodaj Stavku</button>
      </div>
      <button type="submit">Sačuvaj</button>
    </form>
  </div>
</template>
  
<script>
import axios from 'axios';
import moment from 'moment-timezone';

export default {
  data() {
    return {
      
      narudzbenice: [],
      stavke: [], // Dodajemo listu stavki
      form: {
        nar_id: null,
        nar_datum: '',
        fk_nar_user_id: '',//Ovde se postavlja userId
        fk_nar_kmp_id: '',
        nar_cena: '',
        stavke: [] // Dodajemo polje za stavke
      },
      selectedStavkaId: null // Dodajemo polje za selektovanu stavku
    };
  },
  
  methods: {
    async startOrder() {
    const usr_id = localStorage.getItem('usr_id');
  
    if (!usr_id) {
        console.error('Korisnički ID nije pronađen u localStorage.');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3005/narudzbenice', { fk_nar_usr_id: usr_id });

        if (response && response.data && response.status === 200) {
            const nar_id = response.data.nar_id;
            if (nar_id) {
                localStorage.setItem('nar_id', nar_id);
                console.log('ID narudžbenice sačuvan u localStorage:', nar_id);
            } else {
                console.error('ID narudžbenice nije pronađen u odgovoru.');
            }
        } else {
            console.error('Neuspešan zahtev ili neispravan odgovor od servera.');
        }
    } catch (error) {
        console.error('Greška prilikom kreiranja narudžbenice:', error);

        if (error.response) {
            console.error('Status odgovora:', error.response.status);
            console.error('Podaci o grešci:', error.response.data);
        } else if (error.request) {
            console.error('Zahtev nije uspeo da dođe do servera.');
        } else {
            console.error('Došlo je do greške prilikom postavljanja zahteva:', error.message);
        }
    }
},

async fetchNarudzbenice() {
    // Prvo dohvatite čitavu narudžbenicu iz localStorage
    const savedNarudzbenica = localStorage.getItem('narudzbenica');

    if (!savedNarudzbenica) {
        console.error('Narudžbenica nije pronađena u localStorage.');
        return;
    }

    // Parsirajte dohvaćenu narudžbenicu kako biste dobili objekat
    const narudzbenica = JSON.parse(savedNarudzbenica);
    const nar_id = narudzbenica.nar_id;

    try {
        const response = await axios.get(`http://localhost:3005/narudzbenice/${nar_id}`);
        
        if (response && response.data) {
            this.narudzbenice = [response.data]; // Pretvaranje u niz ako trebate samo jedan objekat
            console.log('Trenutna narudžbenica uspešno preuzeta:', this.narudzbenice);
        } else {
            console.error('Neuspešan zahtev ili neispravan odgovor od servera.');
        }
    } catch (error) {
        console.error('Došlo je do greške pri preuzimanju trenutne narudžbenice:', error);
    }
},
    fetchStavke() {
      axios.get('http://localhost:3009/stavke') 
        .then(response => {
          this.stavke = response.data.data || [];
        })
        .catch(error => {
          console.error('There was an error fetching stavke!', error);
        });
    },
    calculateTotalPrice() {
      let total = 0;
      this.form.stavke.forEach(stavka => {
        total += stavka.kolicina * stavka.stv_cena;
      });
      return total;
    },
    saveNarudzbenica() {
    this.form.nar_cena = this.calculateTotalPrice();

    if (this.form.nar_id) {
      axios.put(`http://localhost:3005/narudzbenice/${this.form.nar_id}`, this.form)
        .then(response => {
          this.fetchUserNarudzbenice();
          this.resetForm();

          // Spremi narudžbenicu u localStorage
          localStorage.setItem('narudzbenica', JSON.stringify(response.data));
          console.log('Narudžbenica ažurirana i spremljena u localStorage:', response.data);

        })
        .catch(error => {
          console.error('Došlo je do greške!', error);
        });
    } else {
      axios.post('http://localhost:3005/narudzbenice', this.form)
        .then(response => {
          this.fetchUserNarudzbenice();
          this.resetForm();

          // Spremi narudžbenicu u localStorage
          localStorage.setItem('narudzbenica', JSON.stringify(response.data));
          console.log('Narudžbenica kreirana i spremljena u localStorage:', response.data);

        })
        .catch(error => {
          console.error('Došlo je do greške!', error);
        });
    }
  },
    editNarudzbenica(narudzbenica) {
      this.form = { ...narudzbenica };
    },
    addStavkaToNarudzbenica() {
      if (this.selectedStavkaId) {
        const stavka = this.stavke.find(stavka => stavka.stv_id === this.selectedStavkaId);
        if (stavka) {
          this.form.stavke.push({ 
            stv_id: stavka.stv_id,
            kolicina: stavka.stv_kolicina,
            stv_cena: stavka.stv_cena
          });
          this.selectedStavkaId = null;
        }
      }
    },
    resetForm() {
      this.form = {
        nar_id: null,
        nar_datum: this.getCurrentDate(),
        fk_nar_user_id: localStorage.getItem('usr_id'),
        fk_nar_kmp_id: '',
        nar_cena: '',
        stavke: []
      };
    },
    setCurrentDateTime() {
      const currentDateTime = moment().tz('Europe/Belgrade').format('YYYY-MM-DD HH:mm:ss');
      this.form.nar_datum = currentDateTime;
      console.log('Trenutno vreme u Beogradu:', currentDateTime);
    },
    formatDateToTimeZone(dateString, timeZone = 'Europe/Belgrade') {
      return moment(dateString).tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
    },
    goToKupovina() {
    this.$router.replace('/nastkupovine');
  }},
  //Created ide uvek posle methods
  created() {
    this.form.fk_nar_user_id = localStorage.getItem('userId'); // Postavi userId iz localStorage
    this.fetchNarudzbenice(); // Pozovi funkciju za preuzimanje trenutne narudžbenice
    this.fetchStavke(); // Pozovi funkciju za preuzimanje stavki
    this.setCurrentDateTime(); // Postavi trenutno vreme
     // Možda imate nešto ovde što uzrokuje višestruko pozivanje
  this.goToKupovina(); 
},}
</script>
  
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #f2f2f2;
    text-align: left;
  }
  .add-korpa {
  width: 150px; /* Širina dugmeta, prilagodite prema potrebama */
  padding: 10px; /* Dodajte padding za bolji izgled */
  background-color: #4e2fa5; /* Pozadina dugmeta */
  color: white; /* Boja teksta na dugmetu */
  border: none; /* Uklonite obrub dugmeta */
  border-radius: 5px; /* Oblikovanje radijusa */
  font-size: 16px; /* Veličina fonta */
  cursor: pointer; /* Promeni kursor kada je dugme u fokusu */
  text-align: center; /* Centriranje teksta unutar dugmeta */
  transition: background-color 0.3s, transform 0.2s; /* Dodajte prelaz za efekte */
}

.add-korpa:hover {
  background-color: #2a1564; /* Promena boje pozadine pri prelazu miša */
}

.add-korpa:active {
  transform: scale(0.98); /* Efekat pritiska dugmeta */
}

  </style>
  