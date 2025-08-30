<template>

  <div>
    <h2>Detalji plaćanja porudžbenice</h2>
     <!-- Dugmad za akcije  Jasno, želiš da ceo taj blok sa informacijama o plaćanju i izborom metode bude sa desne strane ekrana, dok sa leve strane ostaje lista proizvoda. Možeš to uraditi koristeći flexbox ili grid u CSS-u. Evo primer kako da organizuješ HTML i stilove:-->
<div class="checkout-page">
  <!-- Leva strana: Korpa / lista proizvoda -->
         <Korpa
           
  :cart-items="cartItems"
  :items-map="itemsMap"
  @remove-item="removeFromCart"
  @clear-cart="clearCart"
  @checkout="placanjePouzecem"
  @go-to-checkout="goToCheckout"
/>
 <!-- Desna strana: plaćanje i informacije  //Tvoj <button> sa @click="placanjePouzecem()" se nalazi unutar <form>, ali nije type="button", što znači da se ponaša kao type="submit" dugme po defaultu. Zato se:

Swal.fire() samo na trenutak prikaže, pa stranica odmah "refreshuje" jer form pokušava da se pošalje. -->
    <div class="payment-sidebar">
   <div class="shipping-advice">
      <strong> Rok za isporuku porudžbine 3-5 dana.</strong> 
      Prilikom izbora načina plaćanja kliknite na kružić!
    </div>
  
    

    <form id="myForm">
      <label class="payment-label">
        <span class="payment-span"><strong>Izaberite način plaćanja:</strong></span>
      </label>
        <!-- DODATO type="button" -->
  <button type="button" class="add-korpa" @click="placanjePouzecem()">Plati pouzećem</button>

  <!-- DODATO type="button" -->
  <button type="button" class="add-korpa" @click="goToCheckout()">Naruči proizvod</button>

      <div>
  <label for="card">Kreditna ili debitna kartica</label>
  <input
  type="radio"
  id="card"
  value="card"
  v-model="selectedPaymentMethod"
  @change="openModal"
/>
</div>
      <!-- Modal za plaćanje karticom, da ne bi bila greska missing cartItem prop mora se u paymentform roditeljskoj komponenti pored oreder dodeliti cartitems(to je dodato ispod u kodu, u payment formi mora se koristiti direkto camelCase, naci vodi racuna da tkao isto prosledis i kao prop, zato se vraca prazan niz cartItems, nije isto bilo u payment-form i u prop,,,Ali u Vue template-u moraš koristiti kebab-case (sa crticama), NE camelCase.), dakle nije dobro cart-Itemsm, mora sve malim slovima sa crticom izmedju cart-items je ispravo -->
<div v-if="isModalOpen">
  
  <div>
    <h2>Nastavak kupovine</h2>
    <p>{{ cartItems }}</p> <!-- da proveriš da li je definisan -->
    <payment-form :cart-items="cartItems" :order="order" />

  </div>

   </div>
 

     

      <div>
        <label for="bank_transfer">Bankovni transfer</label>
        <input type="radio" id="bank_transfer" value="bank_transfer" v-model="selectedPaymentMethod">
      </div>

      <div>
        <label for="cash_on_delivery">Plaćanje pouzećem</label>
        <input type="radio" id="cash_on_delivery" value="cash_on_delivery" v-model="selectedPaymentMethod">
      </div>
    </form>
    <button @click="potvrdiPorudzbinu">Potvrdi poruddžbinu</button>
<!-- U nastKupovine.vue, u delu gde koristiš PaymentForm, moraš da dodaš :order="nekiObjekat".
Ako već imaš neki podatak o porudžbini (npr. proizvod koji je korisnik izabrao), onda:  Rešenje je da u trenutku prosleđivanja prop-a u PaymentForm garantuješ da order uvek bude objekat, makar prazan. greska ovog tipa znaci Invalid prop: type check failed for prop "order". Expected Object, got String with value "proizvod || {}".
, U template-u kad prosleđuješ prop, treba da koristiš dvotačku (:) da označiš da šalješ izraz, a ne string litera, Bez Vue tretira vrednost kao string "proizvod || {}" umesto da izvrši <izraz class=" nikako paymentForm, vue ne dozvoljava, payment-form moze-
Da bi radilo koristiti v-if model za payment-form-->



</div></div></div>
</template>

<script>
import Korpa from '@/components/Korpa.vue';
import cartMixin from '@/mixins/cartMixin';
import Stavke from '@/components/Stavke.vue';


//U tvom template-u imaš komponentu PaymentForm koja zahteva prop order, ali u script delu nisi povezala taj prop sa bilo čim. Tako da Vue baca grešku da je order prop obavezan, a ti ga ne prosleđuješ.
import PaymentForm from '@/components/PaymentForm.vue';// Invalid prop: type check failed for prop "order". Expected Object, got Null,, ova greska znaci payment form prosledjuemo order koji je null a ocekuje se da je objekat 
export default {
  mixins: [cartMixin],
 name: 'Nastkupovine',
 
  //moramo definisati ime komponente prvo ide components pa onda inde props
 
 components: {
    PaymentForm,
    Korpa,
    Stavke
//Ako cartItems stiže iz roditelja, ne diraj data za cartItems.Ako nema roditelja, izbaci props i definiši cartItems u data sa localStorage.
  },
  
  data() {
    //Greška "Missing required prop: 'order'" znači da komponenta (npr. PaymentForm) očekuje order kao prop, ali joj ne prosleđuješ ništa., fali cartItems, a mora da se prenose proizvodi koji su u korpi do trenutka placanja

    return {
                // povlačimo iz localStorage da bi lista uvek postojala
          order: {},//bilo je null ali msilim da ta vrednost ne sme biti za order, nego treba da ga vuce kao objekat
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
         // 👉 čuvanje korpe i prebacivanje na checkout stranicu
     
      
       // 👉 otvori modal ako korisnik izabere karticu
    openModal() {
    if (this.selectedPaymentMethod === 'card') {
      // Pre nego što odeš na PaymentForm, sačuvaj potrebne podatke
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      localStorage.setItem('items', JSON.stringify(this.items));
      
      // Idi na stranicu PaymentForm
      this.$router.push({ name: 'PaymentForm' }); // prilagodi ako koristiš path umesto name
    }},
  
    closeModal() {
      this.isModalOpen = false;
    },
    
  //dugme placanje pouzecem, ne obradjuje se jedna proizvod nego cel korpa pa se prosledjuje  cartItems
   
//handlePayment(cardDetails) → koristi se kada plaćaš karticom preko PaymentForm.vue (Stripe ili slično). To ti treba da obradiš uspešno plaćanje i zatvoriš modal.potvrdiPorudzbinu() → koristi se kada korisnik izabere način plaćanja (radio button) i klikne na Potvrdi porudžbinu. To je univerzalno dugme – proverava da li je odabran način plaćanja, i reaguje u skladu sa tim.

    },
 
  mounted() {
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
    const storedOrder = localStorage.getItem('order');
    if (storedOrder) {
      this.order = JSON.parse(storedOrder);
    }
  }
  }
  //Da li prvo ide mounted ili method apsolutno je svejedno Vue ce rendovati kako treba, samo voditi racuna da posle data ide methods ili mounted

  
 
</script>

<style scoped>
.checkout-page {
  display: flex;
  align-items: flex-start;
  gap: 10px; /* razmak između leve i desne strane */
  padding: 20px;
  margin-top: 0; /* pomera sidebar više nadole ili gore */}


.payment-sidebar {
  width: 300px; /* fiksna širina sidebar-a */
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  margin-left: 0; /* maksimiziramo da bude blizu Korpe */
  margin-top: 150px; /* pomeranje malo dole */
}
.shipping-advice {
  background-color: #f9f9f9; /* Svetlo siva pozadina */
  border: 2px solid #ddd; /* Svetla ivica */
  padding: 15px; /* Unutrašnje margine */
  margin: 20px auto; /* Gornja i donja margina, automatsko centriranje */
  border-radius: 8px; /* Zaobljeni uglovi */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Blaga senka za efekat izdizanja */
  font-size: 18px; /* Veličina fonta */
  line-height: 1.5; /* Prostor između linija teksta */
  max-width: 600px; /* Maksimalna širina box-a */
  width: 90%; /* Box će zauzimati 90% širine ekrana do max-width */
}
.button-container {
  display: flex;
  justify-content: center; /* Centriranje horizontalno */
  margin-top: 10px; /* Razmak od drugih elemenata */
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

.payment-label {
  display: block;
  margin-bottom: 10px;
}

.card-selection {
  margin-top: 10px;
}

.card-logo {
  width: 50px;
  margin-right: 10px;
}

button {
  margin-top: 20px;
}
.cart-container {
  max-width: 100px;
  margin: 0 auto;
  padding: 20px;
}

.cart-item {
   max-width: 100px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 15px 0;
}

.cart-img {
  width: 80px;   /* smanjena širina */
  height: 80px;  /* smanjena visina */
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

.cart-details {
  flex: 1;
}
</style>