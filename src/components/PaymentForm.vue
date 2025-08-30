
    
  <!-- Tu ide forma za plaćanje (Stripe),, Greška koju opisuješ — da ni naslov ni dugmad nisu vidljivi, a ništa se ne prikazuje osim praznog dela za unos kartice — najverovatnije dolazi iz pogrešnog ugnježđivanja HTML elemenata, posebno <div id="card-element">, koji je i kontejner za Stripe element i parent za sve ostalo, što ne bi smeo da bude.
   The selector you specified (#card-element) applies to no DOM elements that are currently on the page.
Make sure the element exists on the page before calling mount().

znači da Stripe pokušava da se poveže sa HTML elementom koji ne postoji u trenutku kada mount() funkcija bude pozvana.

Stripe mora da mountuje svoj #card-element u TAČNO JEDAN PRAZAN div, inače sve ostalo može nestati, ne prikazivati se, ili prekriti stranicu.... -->
<template>
  <div>
    <div>
    <div class="cart-container">
    <h2 class="cart-title">Vaša porudžbina</h2>
    <ul class="cart-list">
      <li 
        v-for="(item, index) in cartItems" 
        :key="item.fk_stv_pro_id + '-' + index" 
        class="cart-item"
      >
        <strong>Naziv hemikalije:</strong> {{ getProductIUPAC(item.fk_stv_pro_id) }}  
        &nbsp;|&nbsp; <strong>Količina:</strong> {{ item.stv_kolicina }}  
        &nbsp;|&nbsp; <strong>Ukupna cena:</strong> {{ item.uk_stv_cena }} RSD
      </li>
    </ul>
    <p v-if="cartItems.length === 0" class="empty-cart">Vaša korpa je prazna.</p>
  </div>
    </div>

    <div class="payment-container">
    <div class="card-options">
      <!-- Tu možeš staviti slike kartica ili nešto kasnije -->
    </div>
<h3>Popuni prazna polja</h3>
    <!-- Stripe card element -->
    <div id="card-element"></div>

    <!-- Prikaz grešaka -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <!-- Forma i dugme za plaćanje -->
    <form @submit.prevent="submitPayment" class="payment-form">
      <button type="submit" class="pay-button">Potvrdi kupovinu</button>
    </form>
  </div></div>
</template>
<script>
//Pozivamo axios, da bi komunicirali sa appijem preko post zahteva
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
//PaymentForm komponenta očekuje prop cartItems koji je označen kao required (obavezan).Kad Vue renderuje PaymentForm, taj prop nije prosleđen ili je undefined u smislu komponenta payment form gde se prosledjuje nije prosledjena kako treba.Zato Vue baca grešku Missing required prop: "cartItems".
export default {
  ////Ako cartItems stiže iz roditelja, ne diraj data za cartItems.Ako nema roditelja, izbaci props i definiši cartItems u data sa localStorage.
props: {
  
  
},

data() {
  return {
    showCardOptions: false,
      
   cartItems: JSON.parse(localStorage.getItem('cart')) || [],//Da se prosledi iz Nast kupovine i proizvodi preko localStorage koritim kljuc cart
    items: JSON.parse(localStorage.getItem('products')) || [],
        order: JSON.parse(localStorage.getItem('order')) || {},  // Ako nema, koristi prazan objekat
    processing: false,
    errorMessage: '',
    stripe: null,
    elements: null,
    cardElement: null,
     
  };
},
  async mounted() {
    //Kad zelimo da nesto conosle log, Ako želiš da proveriš odmah po učitavanju komponente: u mounted ili u metodi gde radimo sa cartItems
      console.log('cartItems u Payment form:', this.cartItems);
    this.stripe = await loadStripe('pk_test_51Pqfe9ClRBiTfY1yAzZnjTicUjNtNURPMHgd9rcgHeknyUM2nHYaPjnvbTvarzvsCtBNGT5DrdxRvnwWoDom7hx300robF55p8'); // Zameniti sa stvarnim Stripe public key-em
    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card');
    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event) => {
      this.errorMessage = event.error ? event.error.message : '';
    });
  },
  created() {
  //Da povuce proizvode iz Local storace kad se klikne dodaj u korpu, U created() pokušavaš da direktno dodeliš vrednost this.cartItems = ...Ali to ne smeš raditi sa prop-ovima, jer su oni read-only u child komponenti.Vue neće dozvoliti da menjaš vrednost prop direktno.
  const savedCart = localStorage.getItem('cartItems');
  if (savedCart) {
    this.cartItems = JSON.parse(savedCart);//
    console.log('Učitani cartItems iz localStorage:', this.cartItems);
  }
},
//beforeDestroy ne mora da ide pre methods, ali je dobra praksa da lifecycle hooks (created, mounted, beforeDestroy, itd.) stoje pre methods.
 beforeDestroy() {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  },
  methods: {
    getProductIUPAC(pro_id) {
      // Proveri da li je items definisan kao niz
      if (!Array.isArray(this.items)) {
        console.error('items nije definisan ili nije niz.');
        return 'Nepoznata hemikalija';
      }
      const product = this.items.find(item => item.pro_id ==pro_id);
      return product ? product.pro_iupac : 'Nepoznata hemikalija';},
    openModal() {
      this.showCardOptions = true;
    },
    selectedCard(card) {
      this.selectedCard = card;
      alert(`Izabrali ste: ${card}`);
      this.showCardOptions = false;
    },
  
   
    
    //Da, logika ti je uglavnom dobra, ali imaš jedan ključni problem sa sintaksom:Metoda submitPayment ti je definisana unutar objekta methods, ali ti si methods zatvorio pre nego što je funkcija završena, ili si beforeDestroy stavio unutar methods, što nije ispravno Metoda submitPayment nije unutar objekta methods — u tvojoj komponenti, methods objekat je zatvoren pre submitPayment, i zato Vue ne može da nađe tu funkciju kad je pozoveš (daje grešku Invalid handler for event "click": got undefined)..
   async submitPayment() {
     console.log('submitPayment pozvana');
      this.processing = true;
      this.errorMessage = '';
      try {
        //Baca gresku network jer je bio pogresan port na backendu jedan a ovde na frontendu potpuno drugi, a kad baci gresku cannot post, treba sagledati naziv rute posto se salje preko api moramo u nazivu rute imati api,, URL https://api.hcaptcha.com/getcaptcha/20000000-ffff-ffff-ffff-000000000002 je API endpoint koji pripada hCaptcha servisu.Šta znači?hCaptcha je servis za zaštitu od botova i spam-a (kao Google reCAPTCHA).Ovaj URL je poziv na dohvatanje (get) podataka o specifičnoj Captcha sesiji ili izazovu sa ID-em 20000000-ffff-ffff-ffff-000000000002.Drugim rečima, to je URL koji klijent (npr. tvoj browser ili aplikacija) poziva da bi dobio podatke za određeni hCaptcha izazov koji treba da se prikaže korisniku.//Greška status 500 Invalid integer: NaN znači da je backend (server) dobio vrednost koja se očekuje da bude ceo broj (integer), ali je zapravo NaN (Not a Number).Najčešće se dešava kada:Pokušavaš da konvertuješ ili koristiš neki podatak koji nije broj, a očekuje se broj.Npr. šalješ undefined, null ili string koji se ne može parsirati u broj na mesto gde je očekivan broj. 
        const response = await axios.post('http://localhost:3013/api/create-payment-intent', {
          cartItems: this.cartItems,
          order: this.order,
        });

        const clientSecret = response.data.clientSecret;

        const result = await this.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.cardElement
          }
        });

        if (result.error) {
          this.errorMessage = result.error.message;
          this.processing = false;
        } else if (result.paymentIntent.status === 'succeeded') {
          this.processing = false;
            alert('Plaćanje je uspešno završeno!');
          this.$emit('payment-success', result);
        }
      } catch (err) {
        this.errorMessage = 'Greška pri plaćanju: ' + err.message;
        this.processing = false;
      }
    }}}
 
  
</script>

<style scoped>
.payment-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

#card-element {
  border: 1px solid #ccc;
  padding: 12px 15px;
  border-radius: 6px;
  box-shadow: inset 0 1px 5px rgba(0,0,0,0.07);
  font-size: 1rem;
  background: #fafafa;
}
.error-message {
  color: #d93025;
  font-weight: 600;
  margin-top: 5px;
  text-align: center;
}

.payment-form {
  text-align: center;
}

.pay-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 123, 255, 0.6);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.pay-button:hover {
  background-color: #0056b3;
  box-shadow: 0 5px 12px rgba(0, 86, 179, 0.8);
}
.cart-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 8px;
  background: #fff;
}

.cart-title {
  font-weight: bold;
  font-size: 1.8em;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.cart-list {
  list-style-type: none;
  padding: 0;
}
.cart-item {
  padding: 12px 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  background: #f9f9f9;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  font-size: 1.1em;
  color: #444;
}

.empty-cart {
  text-align: center;
  color: #999;
  font-style: italic;
}
.payment-wrapper {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-width: 500px;
  margin: 0 auto;
}

.card-options {
  margin-bottom: 20px;
  text-align: center;
}

.card-logo {
  width: 80px;
  height: auto;
}

.stripe-input {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}

.pay-button,
.cancel-button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

.pay-button {
  background: #6772e5;
  color: white;
}

.cancel-button {
  background: #ccc;
}
</style>
