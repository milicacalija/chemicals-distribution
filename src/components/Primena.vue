<template>
    <div>
      <h1>
        Primena hemikalija
      </h1>
      <input 
        type="text" 
        v-model="searchQuery" class="input"
        placeholder="Ukucaj naziv proizvoda po IUPAC ili naziv primene"
        @input="searchData"
      />
      <div class="table-container">
       <!-- Prikaz slika izvan tabele -->
    <div v-if="filteredItems.length">
      <h3> {{ selectedImagePrimena }}</h3>
      <img :src="getImageUrl(selectedImagePrimena)" :alt="selectedImagePrimena" class="primena-slika"/>
    </div>
      <table v-if="filteredItems.length">
        <thead>
          <tr>
            <th>Hemikalije</th>
          
           
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.pro_iupac">
            <td>{{ item.pro_iupac }}</td>
           
          </tr>
        </tbody>
      </table>
   
      <p v-else>No data found</p>
      
    </div>
  </div>
  </template>
  

<script>
import axios from 'axios';

export default {
  name: 'Primena',
  data() {
    return {
      items: [],
      searchQuery: '',// Inicijalizacija na prazan string
      selectedImagePrimena: ''
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.items;
      }
      const query = this.searchQuery.toLowerCase();
      return this.items.filter(item =>
        item.pro_iupac.toLowerCase().includes(query) ||
        item.primene.some(primena => primena.toLowerCase().includes(query))
      );
    }
  },
  watch: {
    searchQuery(newQuery) {
      this.searchData();
    }
  },
  methods: {
    async searchData() {
      try {
        const url = `http://localhost:3000/tipoviprimene?search=${encodeURIComponent(this.searchQuery)}`;
        console.log('Request URL:', url); // Debugging
        const response = await axios.get(url);
        console.log('Response Data:', response.data); // Debugging

        // Agregacija podataka
      const aggregatedItems = response.data.data.reduce((acc, item) => {
        if (!acc[item.pro_iupac]) {
          acc[item.pro_iupac] = { pro_iupac: item.pro_iupac, primene: [] };
        }
        acc[item.pro_iupac].primene.push(item.tpr_naziv);
        return acc;
      }, {});

      this.items = Object.values(aggregatedItems);
    
    // Postavljanje prve pronađene primene za prikaz slike
    if (this.items.length > 0) {
        this.selectedImagePrimena = this.items[0].primene[0];
      } else {
        this.selectedImagePrimena = '';
      }
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    }
  },

    getImageUrl(tpr_naziv) {
      try {
        if (tpr_naziv.toLowerCase() === 'nafta') {
          return require('@/assets/naftna industrija.jpeg');
        }
        return require(`@/assets/${tpr_naziv.toLowerCase()}.jpeg`);
      } catch (e) {
        // Ako slika ne postoji, vratite putanju do default slike ili praznu string
        return require('@/assets/korpica circle.png');
      }
    }
  },
  mounted() {
    this.searchData();
    this.searchQuery = ''; // Resetovanje pretrage pri učitavanju komponente
  }
};
</script>
<style scoped>
.input{
  width: 300px;
  height: 30px;
  border-radius: 20px;
}
.table-container{
  
margin: 20px; /* Dodavanje margine oko tabele */
justify-content: center;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px; /* Dodavanje margine između input polja i tabele */
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  text-align: center; /* Centriranje teksta u tabeli */
}

th {
  background-color: #f2f2f2;
}

.primena-slika {
  width: 607px;
  height: 377px;
  margin-top: 20px;
}
h3 {
  text-align: center; /* Centriranje naslova */
}

img {
  display: block;
  margin: 0 auto; /* Centriranje slike */
}
</style>