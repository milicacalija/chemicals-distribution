<template>
  <div>
    <h1>Stavke</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Proizvod ID</th>
          <th>Količina</th>
          <th>Cena</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stavka in stavke" :key="stavka.stv_id">
          <td>{{ stavka.stv_id }}</td>
          <td>{{ stavka.fk_stv_pro_id }}</td>
          <td>{{ stavka.stv_kolicina }}</td>
          <td>{{ stavka.stv_cena }}</td>
          <td>
            <button @click="obrisiStavku(stavka.stv_id)" class="delete-stavka">Obriši</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Stavke',
  data() {
    return {
      stavke: []
    };
  },
  created() {
    this.ucitajStavke();
  },
  methods: {
  async ucitajStavke() {
    try {
      const response = await axios.get('http://localhost:3009/stavke');
      console.log('API odgovor:', response.data);

      if (Array.isArray(response.data)) {
        this.stavke = response.data;
      } else {
        console.error('Neispravan format podataka:', response.data);
      }
    } catch (error) {
      console.error('Greška pri učitavanju stavki:', error);
    }
  },
  async obrisiStavku(stv_id) {
  try {
    const response = await axios.delete(`http://localhost:3009/stavke`, { params: { id: stv_id } });
    console.log('Stavka obrisana:', stv_id);
    // Ponovo učitaj stavke nakon brisanja
    this.ucitajStavke();
  } catch (error) {
    console.error('Greška pri brisanju stavke:', error.response ? error.response.data : error.message);
  }
},
    async azurirajStavke() {
      // Ova metoda može biti korišćena za ažuriranje stavki ako je potrebno
      console.log('Azuriranje stavki...');

      // Primer za šalje podatke za ažuriranje
      // const proizvodiZaAzuriranje = this.stavke.filter(stavka => stavka.kolicina > 0);
      // await axios.put('http://localhost:3009/update-stavke', { stavke: proizvodiZaAzuriranje });
    }
  }
};
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
  background-color: #f4f4f4;
}
</style>