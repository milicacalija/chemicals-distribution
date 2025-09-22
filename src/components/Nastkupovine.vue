<template>
  <div class="checkout-page">

    <!-- Leva strana: Korpa / lista proizvoda -->
    <div class="cart-column">
      <div class="cart-details" v-if="cartItems.length > 0">
        <h3>Stavke u korpi</h3>

        <div v-for="item in cartItems" :key="item.fk_stv_pro_id" class="cart-item">
          <!-- Slika proizvoda -->
          <img
            :src="getImageUrl(itemsMap[item.fk_stv_pro_id])"
            :alt="itemsMap[item.fk_stv_pro_id]?.pro_iupac || 'Nepoznat proizvod'"
            @error="handleImageError($event, itemsMap[item.fk_stv_pro_id]?.pro_iupac)"
            class="cart-item-image"
          />

          <!-- Info o proizvodu -->
          <div class="cart-item-info">
            <span class="product-name">{{ itemsMap[item.fk_stv_pro_id]?.pro_iupac || 'Nepoznat proizvod' }}</span>
            <span class="quantity">Količina: {{ item.stv_kolicina }} kom</span>
            <span class="price">Cena: {{ item.uk_stv_cena.toFixed(2) }} RSD</span>
          </div>

          <!-- Akcije na stavku -->
          <div class="cart-item-actions">
             <button type="button" class="logout-btn" @click="removeFromCart(item)">
Ukloni        </button>
          </div>
        </div>

      </div>

      <!-- Prazna korpa -->
      <div v-else class="empty-cart">
        <p>Vaša korpa je prazna.</p>
      </div>
    </div>
<!-- Desna strana: plaćanje i informacije -->
<div class="payment-sidebar">
  <div class="shipping-advice">
  <strong><span class="shipping-text">Rok za isporuku porudžbine 3-5 dana.</span></strong>
  <p>Prilikom izbora načina plaćanja kliknite na kružić!</p>
</div>

  <!-- Modal za karticu -->
  <div v-if="isModalOpen">
    <div class="payment-modal">
      <h2>Nastavak kupovine</h2>
      <payment-form :cart-items="cartItems" :order="order" />
    </div>
  </div>

  <!-- Forma plaćanja -->
  <form id="myForm">
    <label class="payment-label">
      <strong>Izaberite način plaćanja:</strong>
    </label>

    <!-- Plaćanje pouzećem -->
    <div class="payment-option">
      <input 
        type="radio" 
        id="pouzece" 
        value="pouzece" 
        v-model="selectedPaymentMethod"
        @click="kreirajNarudzbenicu('Pouzećem')"
      />
      <label for="pouzece">Plaćanje pouzećem</label>
    </div>

    <!-- Kreditna kartica -->
    <div class="payment-option">
      <input
        type="radio"
        id="card"
        value="card"
        v-model="selectedPaymentMethod"
    @click="kreirajNarudzbenicu('Kartica')"       />
      <label for="card">Kreditna ili debitna kartica</label>
    </div>
  </form>
</div>
</div>

  
</template>

<script>
import Korpa from '@/components/Korpa.vue';
import cartMixin from '@/mixins/cartMixin';
import { getImageUrl } from '@/components/korpaimg.js';



//U tvom template-u imaš komponentu PaymentForm koja zahteva prop order, ali u script delu nisi povezala taj prop sa bilo čim. Tako da Vue baca grešku da je order prop obavezan, a ti ga ne prosleđuješ.
import PaymentForm from '@/components/PaymentForm.vue';// Invalid prop: type check failed for prop "order". Expected Object, got Null,, ova greska znaci payment form prosledjuemo order koji je null a ocekuje se da je objekat 
export default {
  mixins: [cartMixin],
 name: 'Nastkupovine',
 

  //moramo definisati ime komponente prvo ide components pa onda inde props
 
 components: {
    PaymentForm,
    Korpa,
   
    
//Ako cartItems stiže iz roditelja, ne diraj data za cartItems.Ako nema roditelja, izbaci props i definiši cartItems u data sa localStorage.
  },
  
  
  data() {
    //Greška "Missing required prop: 'order'" znači da komponenta (npr. PaymentForm) očekuje order kao prop, ali joj ne prosleđuješ ništa., fali cartItems, a mora da se prenose proizvodi koji su u korpi do trenutka placanja

    return {
                // povlačimo iz localStorage da bi lista uvek postojala
          order: {},//bilo je null ali msilim da ta vrednost ne sme biti za order, nego treba da ga vuce kao objekat
              cartItems: [],  // obavezno inicijalizovati!
    stripe: null,
    elements: null,
    cardElement: null,
    processing: false,
    errorMessage: '',
    successMessage: '',
      proizvod: {},  // inicijalno prazan objekat, ne null, prenosi se iz proizvodi.vue
      selectedPaymentMethod: null,
      isModalOpen: false,
      selectedProduct: null, // ili neki početni objekat, npr. {}
      
    };
  },
  //Ako hoćeš da ova stranica NastavakKupovine.vue sama povlači korpu iz localStorage, onda ti nije potreban props.Tvoj script deo bi trebalo da izgleda ovako:/*
 //Ah, sad je jasno — greška “Getter is missing for computed property 'methods'” se javlja zato što si u computed delu definisala nešto što nije funkcija, ili si slučajno stavila methods unutar computed.
  
  methods: {
     getImageUrl(item) {
      return getImageUrl(item);
    },
    handleImageError(event, pro_iupac) {
  console.warn(`Slika nije pronađena za: ${pro_iupac}`);
  if (event && event.target) {
    event.target.src = '/images/korpica.png'; // fallback
  }
    console.warn(`Slika nije pronađena za: ${pro_iupac}`);
  },
         // 👉 čuvanje korpe i prebacivanje na checkout stranicu
     
      
       // 👉 otvori modal ako korisnik izabere karticu
// 👉 Dugme "Kreditna kartica" automatski kreira narudžbenicu i vodi na PaymentForm, U openModal() ti pozivaš odmah this.kreirajNarudzbenicu('Kartica'), ali ne otvaraš modal.✅ Rešenje: umesto toga prvo otvori modal, pa tek onda pozovi narudžbenicu ili unutar PaymentForm.
 openModal() {
  if (this.selectedPaymentMethod === 'card') {
    this.isModalOpen = true; // otvori modal
    // ovde možeš ili odmah kreirati narudžbenicu,
    // ili čekati da PaymentForm to završi
  }
},
  
    closeModal() {
      this.isModalOpen = false;
    },
    
  //dugme placanje pouzecem, ne obradjuje se jedna proizvod nego cel korpa pa se prosledjuje  cartItems
   
//handlePayment(cardDetails) → koristi se kada plaćaš karticom preko PaymentForm.vue (Stripe ili slično). To ti treba da obradiš uspešno plaćanje i zatvoriš modal.potvrdiPorudzbinu() → koristi se kada korisnik izabere način plaćanja (radio button) i klikne na Potvrdi porudžbinu. To je univerzalno dugme – proverava da li je odabran način plaćanja, i reaguje u skladu sa tim.

    },
 
  mounted() {

    // Debug: provera slika za sve stavke
  this.cartItems.forEach(item => {
      console.log('[DEBUG] Stavka u korpi:', item);
    const url = this.getImageUrl(item);
    console.log('[DEBUG] Stavka:', item.fk_stv_pro_id, '-> URL:', url);
  });
    // Proveri da li postoji 'msg' u query parametrima, da lepo poruku umesto URL vidimo na frontendu , da je uspesno porucen proizvod
    if (this.$route.query.msg) {
      alert(decodeURIComponent(this.$route.query.msg));  // Prikazi alert sa porukom
    }
},
  created() {
    // Učitaj iz localStorage, s obzirod da je cartItem data slobodno mozemo u created manipulasati podacima u Localstorage
    const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    this.cartItems = JSON.parse(savedCart); // Učitaj korpu iz localStorage
  }
     // Ako imaš i porudžbinu:
    //Imaš grešku da order nije objekat. Ti si ga inicijalizovala sa {} i to je ok, ali kad ga učitavaš iz localStorage, možda se upisuje string ili null.Rešenje: pri parsiranju obavezno fallback (vracanje greske):
    const storedOrder = localStorage.getItem('order');
    if (storedOrder) {
      try {
    this.order = JSON.parse(storedOrder) || {};
  } catch (e) {
    this.order = {};
  }
}
  }}
  //Da li prvo ide mounted ili method apsolutno je svejedno Vue ce rendovati kako treba, samo voditi racuna da posle data ide methods ili mounted

  
 
</script>

<style scoped>

.checkout-page {
  display: flex;
  justify-content: center;  /* centriranje u horizontalnoj ravni */
  align-items: flex-start;  /* poravnanje na vrh */
  gap: 30px;                /* razmak između leve i desne kolone */
  padding: 40px 20px;       /* razmak od ivica prozora */
  flex-wrap: wrap;           /* ako je ekran uži, kolone idu jedna ispod druge */
}

.cart-column {
  width: 500px;             /* širina leve kolone */
  max-height: 80vh;
  overflow-y: auto;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 240px;       /* znatno veća širina */
  height: 240px;      /* proporcionalna visina */
  object-fit: contain; /* slika se ne seče */
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  margin-right: 15px;
}
.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}
.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.cart-item-actions {
  margin-left: auto;
  display: flex;
  gap: 5px;
}

.cart-item-actions button:hover {
  background-color: #641515;
}
.product-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.quantity, .price {
  font-size: 0.9rem;
  color: #555;
}




.empty-cart {
  text-align: center;
  color: #888;
  padding: 20px;
}
.logout-btn {
  margin-top: 20px;
  padding: 10px 40px; /* veći padding = veće dugme */
  border-radius: 20px;
    background-color: #7c3b3b;

  color: white;
  border: none;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
  font-weight: normal;
  font-size: 16px; /* povećava tekst u dugmetu */
}


/* Cela desna strana */
.payment-sidebar {
  width: 320px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
}

/* Rok za isporuku */
.shipping-advice {
  margin-bottom: 20px;
}
.shipping-advice strong {
  font-weight: 600;
  font-size: 16px;
  color: #641515;
}
.shipping-advice p {
  font-size: 14px;
  color: #333;
}

/* Forma plaćanja */
form#myForm {
  display: flex;
  flex-direction: column;
}

/* Label "Izaberite način plaćanja" */
.payment-label {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* Pojedinačna opcija plaćanja */
.payment-option {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

/* Radio dugme */
.payment-option input[type="radio"] {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  accent-color: #641515; /* boja kada je selektovano */
  cursor: pointer;
}

/* Label pored radio dugmeta */
.payment-option label {
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

/* Dugme Plati pouzećem */
.logout-btn {
  margin-top: 10px;
  padding: 12px 20px;
  border-radius: 20px;
  background-color: #641515;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: inline-block;
  text-align: center;
}

.logout-btn:hover {
  background-color: #800000;
  transition: 0.3s;
}


</style>