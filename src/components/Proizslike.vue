<template>
  <div>
    <h1>Dobrodošli na stranicu hemikalije</h1>
    <div class="cart-icon-container" @click="togglePopup">
      <img src="@/assets/korpica circle.png" class="korpa" alt="Cart" />

      <div class="quantity-circle" v-if="localQuantity > 0">
        {{ localQuantity }}
      </div>
      
      <div class="popup" v-if="isPopupVisible">
        <div v-if="cartItems.length === 0">
          Korpa je prazna
        </div>
        <div v-else>
          <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
            <h3>{{ item.pro_iupac }}</h3>
            <p>Cena: {{ item.pro_cena }}</p>
            <p>Količina: {{ item.stv_kolicina }}</p>
            <p>Ukupno: {{ item.pro_cena * item.stv_kolicina }} RSD</p>
            <button @click="updateItem(item)">Update</button>
          </div>
          <div class="total-amount">
            <strong>Ukupna vrednost korpe: {{ ukupnaVrednostKorpe }} RSD</strong>
          </div>
          <button @click="clearCart">Obriši sve iz korpe</button>
        </div>
        <router-link :to="{ name: 'Korpa', query: { cartItems: JSON.stringify(cartItems) } }">Prikaži korpu</router-link>
      </div>
      
    </div>

    <div v-for="slika in proizslike" :key="slika.prs_id" class="slika-container">
      <h3>{{ slika.pro_iupac }}</h3>
      <p>Cena: {{ slika.pro_cena }} RSD</p>
      <img :src="'data:image/jpeg;base64,' + slika.str_image_base64" class="slika" />
      <img :src="'data:image/jpeg;base64,' + slika.prs_image_base64" class="slika" />

      <div class="quantity-controls">
        <button @click="dodajKolicinu(slika)" class="quantity-button">
          <strong>+</strong>
        </button>
        <span>{{ slika.kolicina }}</span>
        <button @click="oduzmiKolicinu(slika)" class="quantity-button" v-if="slika.kolicina > 0">
          <strong>-</strong>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CartIcon',
  props: {
    quantity: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      proizslike: [],
      stavke: [],
      proizvodi: [],
      isPopupVisible: false,
      cartItems: [],
      selectedProductId: null,
      localQuantity: 0 // Initialize localQuantity
    };
  },
  
  computed: {
    ukupnaVrednostKorpe() {
      return this.cartItems.reduce((total, item) => total + (item.pro_cena * item.stv_kolicina), 0);
    }
  },
  methods: {
    loadData() {
      //Promise all sluzi da se axios zahtevi ne pozvaju zasebno svaki put vec u jednom koraku, to olaksava ucitavanje stranice
      Promise.all([
        axios.get('http://localhost:3007/proizvodi'),
        axios.get('http://localhost:3009/stavke'),
        axios.get('http://localhost:3015/proizslike')
      ])
      .then(responses => {
        this.proizvodi = responses[0].data.data;
        this.stavke = responses[1].data.data;
        this.proizslike = responses[2].data.data.map(slika => ({
          ...slika,
          kolicina: 0
        }));
        this.fetchCartItems();
      })
      .catch(error => {
        console.error('Error loading data:', error);
      });
    },
    dodajKolicinu(slika) {
      if (typeof slika.kolicina === 'undefined') {
        slika.kolicina = 0;
      }

      slika.kolicina++;
      const proizvod = this.proizvodi.find(p => p.pro_id === slika.fk_prs);

      if (!proizvod) {
        console.error('Proizvod nije pronađen za sliku:', slika);
        return;
      }

      const stavkeZaProizvod = this.stavke.filter(stavka => stavka.fk_stv_pro_id === proizvod.pro_id);

      if (stavkeZaProizvod.length === 0) {
        this.addStavkaInDatabase({
          fk_stv_pro_id: proizvod.pro_id,
          stv_kolicina: slika.kolicina,
          stv_cena: proizvod.pro_cena,
          uk_stv_cena: parseFloat(proizvod.pro_cena) * parseInt(slika.kolicina)
        });
      } else {
        stavkeZaProizvod.forEach(stavka => {
          const ukStvCena = parseFloat(proizvod.pro_cena) * parseInt(slika.kolicina);

          if (isNaN(ukStvCena)) {
            console.error('ukStvCena is NaN:', ukStvCena);
            return;
          }

          this.updateStavkaInDatabase({
            fk_stv_pro_id: proizvod.pro_id,
            stv_kolicina: slika.kolicina,
            stv_cena: proizvod.pro_cena,
            uk_stv_cena: ukStvCena
          });
        });
      }

      this.updateLocalQuantity();
    },
    oduzmiKolicinu(slika) {
      if (typeof slika.kolicina === 'undefined') {
        slika.kolicina = 0;
      }

      if (slika.kolicina > 0) {
        slika.kolicina--;

        const proizvod = this.proizvodi.find(p => p.pro_id === slika.fk_prs);

        if (!proizvod) {
          console.error('Proizvod nije pronađen za sliku:', slika);
          return;
        }

        const stavkeZaProizvod = this.stavke.filter(stavka => stavka.fk_stv_pro_id === proizvod.pro_id);

        if (stavkeZaProizvod.length === 0) {
          console.error('Nema stavki za proizvod:', proizvod);
          return;
        }

        stavkeZaProizvod.forEach(stavka => {
          const ukStvCena = parseFloat(proizvod.pro_cena) * parseInt(slika.kolicina);

          if (isNaN(ukStvCena)) {
            console.error('ukStvCena is NaN:', ukStvCena);
            return;
          }

          this.updateStavkaInDatabase({
            fk_stv_pro_id: proizvod.pro_id,
            stv_kolicina: slika.kolicina,
            stv_cena: proizvod.pro_cena,
            uk_stv_cena: ukStvCena
          });
        });

        this.updateLocalQuantity();
      }
    },
    addStavkaInDatabase(stavkaData) {
      axios.post('http://localhost:3009/stavke', stavkaData)
        .then(response => {
          console.log('Uspešno dodata stavka:', response.data);
          this.fetchCartItems();
        })
        .catch(error => {
          console.error('Greška prilikom dodavanja stavke:', error.response ? error.response.data : error.message);
        });
    },
    updateStavkaInDatabase(stavkaData) {
      axios.put('http://localhost:3009/stavke', stavkaData)
        .then(response => {
          
          this.fetchCartItems();
        })
        .catch(error => {
          console.error('Greška prilikom ažuriranja stavke:', error.response ? error.response.data : error.message);
        });
    },
    fetchCartItems() {
      axios.get('http://localhost:3009/cart-items')
        .then(response => {
          this.cartItems = response.data.data.map(item => ({
            ...item,
            ukupno: item.pro_cena * item.stv_kolicina
          }));
          this.updateLocalQuantity();
        })
        .catch(error => {
          console.error('Error fetching cart items:', error);
        });
    },
    updateLocalQuantity() {
      this.localQuantity = this.cartItems.reduce((total, item) => total + item.stv_kolicina, 0);
    },
    togglePopup() {
      this.isPopupVisible = !this.isPopupVisible;
    },
    clearCart() {
  this.cartItems = []; // Očisti prikaz korpe
  localStorage.removeItem('cart'); // ✅ OBRIŠI LOKALNU KORPU

  axios.delete('http://localhost:3009/cart-items')
    .then(response => {
      this.cartItems = [];
      this.updateLocalQuantity();
      console.log('Korpa je obrisana:', response.data);
    })
    .catch(error => {
      console.error('Greška prilikom brisanja korpe:', error);
    });
}

  },
  mounted() {
    this.loadData();
  },
  created() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    this.cartItems = JSON.parse(savedCart);
  }
  localStorage.removeItem('cart');
}
  
};
</script>


<style scoped>
.korpa {
  width: 50px;
  height: 50px;
  position: fixed;
  top: 50px;
  right: 50px;
  cursor: pointer;
  z-index: 1000;
}
.popup {
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  position: fixed;
  top: 80px;
  right: 60px; /* Pomerili smo pop-up prozor malo ulevo od ivice stranice */
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}
.quantity-circle {
  position: fixed;
  top: 30px;
  right: 40px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 5px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 1002;
}
.slika-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.slika {
  width: 300px;
  height: 300px;
  object-fit: contain;
  border: 1px solid #ccc;
}
.quantity-controls {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.quantity-button {
  width: 30px;
  height: 30px;
  padding: 5px;
  background-color: white;
  color: black;
  border: 1px solid black;
  cursor: pointer;
  margin-right: 5px;
  font-size: 16px;
  flex-shrink: 0;
}
.cart-item {
  margin-bottom: 10px;
}
</style>