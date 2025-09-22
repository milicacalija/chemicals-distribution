<template>
  <div class="admin-report">
<!-- Dugme za otvaranje -->
 
    <h1>Admin panel</h1>
    <!-- Ovde ubacuješ profil, To je rekurzija, jer Admin.vue importuje samu sebe ili se Vue Router na neki način petlja.Kad Vue pokuša da renderuje <Admin /> unutar Admin.vue, on opet pokuša da renderuje <Admin /> → beskonačna petlja → „too much recursion“. -->
    
  

    <!-- Pretraga korisnika -->
    <div class="search-container">
      <input v-model="searchUser" placeholder="Pretraži korisnike po imenu ili emailu" />
    </div>

    <!-- Statistika korisnika i narudžbenica -->
    <div class="stats-container">
      <div class="stat-card">
        <strong>Ukupno korisnika:</strong> {{ users.length }}
      </div>
      <div class="stat-card">
        <strong>Ukupno narudžbenica:</strong> {{ totalNarudzbenica }}
      </div>
      <div class="stat-card">
        <strong>Ukupna vrednost narudžbenica:</strong> {{ ukupnaVrednost }} RSD
      </div>
    </div>

    <!-- Tabela korisnika -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Ime</th>
            <th>Email</th>
            <th>Nivo</th>
            <th>Narudžbenice</th>
            <th>Datumi</th>
            <th>Ukupna cena</th>
            <th>Način plaćanja</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.usr_id">
            <td>{{ user.usr_name }}</td>
            <td>{{ user.usr_email }}</td>
            <td>{{ user.usr_level }}</td>

            <!-- Broj narudžbenica -->
 <td>
  <span v-if="user.narudzbenice && user.narudzbenice.length > 0" class="tooltip-container">
    {{ user.narudzbenice.length }}

    <!-- Tooltip koji se prikazuje na hover -->
    <div class="tooltip-content">
      <strong>Narudžbenice:</strong>
      <div class="tooltip-grid">
        <div v-for="nar in user.narudzbenice" :key="nar.nar_id" class="narudzbenica-row">
          <!-- Levo: broj narudžbenice -->
          <div class="nar-id"><strong>ID:</strong> {{ nar.nar_id }}</div>
          <!-- Desno: stavke -->
          <div class="stavke">
            <ul>
              <li v-for="stavka in nar.stavke" :key="stavka.fk_stv_pro_id">
                {{ stavka.pro_iupac }} — Količina: {{ stavka.stv_kolicina }}, Cena: {{ stavka.uk_stv_cena }} RSD
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </span>
  <span v-else>Nema narudzbenica</span>
</td>

            <!-- Tooltip sa datumima narudžbenica -->
            <td>
  <span v-if="user.narudzbenice && user.narudzbenice.length > 0"
        class="tooltip"
        :data-title="user.narudzbenice.map(n => formatDate(n.nar_datum)).join(', ')">
    {{ mesecRecima(user.narudzbenice[0].nar_datum) }}
  </span>
  <span v-else>-</span>
</td>



            <!-- Ukupna cena -->
  <td>
    <span v-if="user.narudzbenice && user.narudzbenice.length > 0">
      {{ ukupnaCena(user) }}
    </span>
    <span v-else>-</span>
  </td>
            <!-- Način plaćanja sa tooltip-om -->
            <td>
              <span v-if="user.narudzbenice && user.narudzbenice.length > 0"
                    class="tooltip"
                    :data-title="user.narudzbenice.map(n => n.nac_plat).join(', ')">
                {{ nacPlat(user) }}
              </span>
              <span v-else>-</span>
            </td>

            <!-- Dugme za brisanje -->
            <td>
              <button class="logout-btn" @click="deleteUser(user.usr_id)">Obriši</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Poruka ako nema korisnika u pretrazi -->
    <div v-if="searchUser && filteredUsers.length === 0" class="no-result">
      Nema korisnika koji odgovara pretrazi.
    </div>

    <!-- Pregled poslednja 2 proizvoda -->
    <section class="admin-section">
      <h2>Poslednja dva proizvoda unesena u bazu podataka</h2>
      <input type="text" v-model="searchProducts" placeholder="Pretraži proizvode po IUPAC nazivu" />
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Cena</th>
              <th>Količina</th>
              <th>Akcija</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts.slice(-2)" :key="product.pro_id">
              <td>{{ product.pro_iupac }}</td>
              <td>{{ product.pro_cena }}</td>
              <td>{{ product.pro_kolicina }}</td>
              <td>
                <button class="logout-btn" @click="deleteProduct(product.pro_id)">Obriši</button>
              </td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </section>

    <!-- Dodavanje novog proizvoda -->
    <section class="admin-section">
      <h2>Dodaj novi proizvod</h2>
      <div class="form-grid">
        <input type="text" v-model="newProduct.pro_iupac" placeholder="Naziv proizvoda" />
        <input type="number" v-model.number="newProduct.pro_cena" placeholder="Cena" />
        <input type="number" v-model.number="newProduct.pro_kolicina" placeholder="Količina" />
        <input type="text" v-model="newProduct.pro_jedinicamere" placeholder="Jedinica mere" />
        <input type="number" v-model.number="newProduct.pro_rok" placeholder="Rok trajanja" />
        <input type="number" v-model.number="newProduct.pro_lager" placeholder="Lager" />
        <input type="text" v-model="newProduct.tip_hemikalije" placeholder="Tip hemikalije" />
      </div>
      <button class="logout-btn" @click="addProduct">Dodaj proizvod</button>
    </section>
      <button class="logout-btn" @click="logout">Odjavi se</button>


  </div>
</template>

<script>
import axios from 'axios';
import '@/components/table.css';


export default {
  name: "Admin",
    components: {
    
  },
  data() {
    return {
      users: [],
      searchUser: '',
      products: [],
      searchProducts: '',
      newProduct: { pro_iupac:'', pro_cena:null, pro_kolicina:null, pro_jedinicamere:'', pro_rok:null, pro_lager:null, tip_hemikalije:'' }
    };
  },
  computed: {
   filteredUsers() {
      if (!this.searchUser) return this.users;
      return this.users.filter(u =>
        u.usr_name.toLowerCase().includes(this.searchUser.toLowerCase()) ||
        u.usr_email.toLowerCase().includes(this.searchUser.toLowerCase())
      );
    },
    totalNarudzbenica() {
      return this.users.reduce((acc, u) => acc + (u.narudzbenice?.length || 0), 0);
    },
    ukupnaVrednost() {
    // Sabira nar_cena svih narudžbenica svih korisnika
    return this.users.reduce((acc, user) => {
      return acc + (user.narudzbenice?.reduce((sum, nar) => {
        return sum + parseFloat(nar.nar_cena || 0);
      }, 0) || 0);
    }, 0);
  },
    filteredProducts() {
      if (!this.searchProducts) return this.products;
      return this.products.filter(p => p.pro_iupac.toLowerCase().includes(this.searchProducts.toLowerCase()));
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    },
    mesecRecima(datum) {
    if (!datum) return '';
    const meseci = [
      'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
      'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
    ];
    const d = new Date(datum);
    return meseci[d.getMonth()];
  },
    ukupnaCena(user) {
  return user.narudzbenice?.reduce((sum, n) => sum + parseFloat(n.nar_cena), 0) || 0;
},
    nacPlat(user) {
      return user.narudzbenice?.[0]?.nac_plat || '-';
    },
    async addProduct() {
  try {
    const response = await axios.post('http://localhost:3007/proizvodi/', this.newProduct);
    this.products.push(response.data); // dodajemo proizvod u lokalni array
    // Reset forme
    this.newProduct = { pro_iupac:'', pro_cena:null, pro_kolicina:null, pro_jedinicamere:'', pro_rok:null, pro_lager:null, tip_hemikalije:'' };
    Swal.fire({ icon: 'success', title: 'Proizvod dodat', showConfirmButton: false, timer: 1500 });
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Greška pri dodavanju proizvoda' });
  }
},
async deleteProduct(id) {
  try {
    await axios.delete(`http://localhost:3007/proizvodi/${id}`);
    this.products = this.products.filter(p => p.pro_id !== id);
    Swal.fire({ icon: 'success', title: 'Proizvod obrisan', showConfirmButton: false, timer: 1500 });
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Greška pri brisanju proizvoda' });
  }
},

async deleteUser(id) {
  try {
    await axios.delete(`http://localhost:3006/admin/users/${id}`);
    this.users = this.users.filter(u => u.usr_id !== id);
    Swal.fire({ icon: 'success', title: 'Korisnik obrisan', showConfirmButton: false, timer: 1500 });
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Greška pri brisanju korisnika' });
  }
},

    async fetchData() {
      const usersRes = await axios.get('http://localhost:3006/admin/users/');
      this.users = usersRes.data.map(u => ({
        ...u,
        narudzbenice: typeof u.narudzbenice === 'string' ? JSON.parse(u.narudzbenice) : u.narudzbenice
      }));
      const productsRes = await axios.get('http://localhost:3007/proizvodi/');
      this.products = productsRes.data.data;
    },
    logout() {
      localStorage.clear();
      this.$router.push("/"); // ili "/" ako nemaš login rutu
    },
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<
