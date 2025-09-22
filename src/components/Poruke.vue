<template>
  <div>
    <h2>Poruke</h2>

    <!-- Forma za slanje nove poruke -->
    <div v-if="userLevel === 1" class="nova-poruka">
      <textarea v-model="por_content" placeholder="Unesite poruku"></textarea>
      <select v-model="tip">
        <option value="pitanje">Pitanje</option>
        <option value="predlog">Predlog</option>
        <option value="pritužba">Pritužba</option>
      </select>
      <button @click="posaljiPoruku">Pošalji</button>
    </div>

    <!-- Lista poruka (samo admin vidi sve) -->
    <div v-if="userLevel === 0" class="admin-poruke">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Poruka</th>
            <th>Tip</th>
            <th>Status</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in poruke" :key="p.por_id">
            <td>{{ p.por_id }}</td>
            <td>{{ p.fk_user_id_sender }}</td>
            <td>{{ p.por_content }}</td>
            <td>{{ p.tip }}</td>
            <td>{{ p.status }}</td>
            <td>
              <select v-model="p.status" @change="promeniStatus(p)">
                <option value="nov">Nov</option>
                <option value="u obradi">U obradi</option>
                <option value="reseno">Rešeno</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="message">{{ message }}</p>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      poruka: '',
      poruke: []
    };
  },
  methods: {
    async posaljiPoruku() {
      try {
        const res = await axios.post('http://localhost:3014/poruke', {
          por_content: this.poruka,
          fk_user_id_sender: 1,  // primer, id trenutnog korisnika
          user_id_reciver: 2      // primer, kome šalješ
        });
        console.log(res.data.message);
      } catch (err) {
        console.error(err);
      }
    },
    async ucitajPoruke() {
      try {
        const res = await axios.get('http://localhost:3014/poruke');
        this.poruke = res.data;
      } catch (err) {
        console.error(err);
      }
    }
  }
};
//Šta se dešava,Korisnik (userLevel 1) vidi samo formu za slanje poruke.Admin (userLevel 0) vidi tabelu sa svim porukama i može menjati status., tip i status su ENUM polja, pa Vue selektuje opcije.message prikazuje feedback za oba tipa korisnika.
</script>
