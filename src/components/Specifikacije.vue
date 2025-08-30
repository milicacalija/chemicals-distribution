<template>
  <div>
    <h1>Specifikacije</h1>
    
    <table border="2">
      <thead>
        <tr>
          <th>ID</th>
          <th>Izgled</th>
          <th>Klasifikacija</th>
          <th>Prva pomoć</th>
          <th>Rukovanje/skladištenje</th>
          
        </tr>
      </thead>
      <tbody>
        <tr v-for="spek in spekk" :key="spek.spe_id">
          <td>{{ spek.spe_id }}</td>
          
          <td>{{ spek.spe_izgled }}</td>
          <td>{{ spek.spe_klashemikal }}</td>
          <td>{{ spek.spe_prvapomoc }}</td>
          <td>{{ spek.spe_ruksklad }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
// Importujte router ako koristite Vue Router, U ovom primeru, router.push će preusmeriti korisnika na rutu "/nova-stranica" nakon 3 sekunde. 

export default {
  data() {
    return {
      spekk: [] // Inicijalno prazan niz koji će sadržati podatke iz baze
    };
  },
  mounted() {
    
    this.getSpekk(); // Pozivamo funkciju za dobijanje podataka kada se komponenta montira
  },
  methods: {
    getSpekk() {
      
      // Šaljemo GET zahtev na server da dobijemo podatke iz baze
      axios.get('http://localhost:3010/specifikacije')
        .then(response => {
          
          
          this.spekk = response.data.data; // Postavljamo podatke iz odgovora u users niz
        })
        .catch(error => {
          console.error('Greška prilikom dobijanja podataka:', error);
        });
    }
  }
};
</script>
<style scoped>
/* Dodajte stilove po potrebi */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>