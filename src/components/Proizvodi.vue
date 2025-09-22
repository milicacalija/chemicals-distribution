<template>
  <div>
    <!-- Cart Icon sa tooltipom -->
    <div class="cart-icon"
      @mouseenter="hoverCart = true" 
     @mouseleave="hoverCart = false">
     <div class="cart-overlay" :class="{ show: showCartPopup }" @click="toggleCartPopup"></div>
<div class="cart-popup" :class="{ show: showCartPopup }">
  <!-- sadržaj korpe -->
</div>
      <img src="@/assets/korpica.png" alt="Korpa" @click="toggleCartPopup" />
      <!-- Brojač proizvoda -->
  <div v-if="cartCount" class="cart-count">{{ cartCount }}

  </div> 

  
   <!-- Tooltip na hover Da 👍 imaš zaštitu (v-if="itemsMap[item.fk_stv_pro_id]"), ali problem je što si je stavila unutra <div>, a ne na sam <li>.

👉 Vue ti uvek napravi <li> zbog v-for, ali ako itemsMap još nije spreman, <div> iznutra ne renderuje → pa u DOM-u ostaje prazan <li> koji se prikazuje kao tačkica.

Zato prvi proizvod vidiš kao tačku (prazan <li>), a drugi lepo radi jer mu itemsMap stigne na vreme. Samo pomeri v-if sa <div> na <li>:  Aha, jasno 👌
Vue 2 ti javlja upozorenje jer ne voli kombinaciju v-for + v-if na istom elementu (iako to tehnički radi).U šablonu koristi samo v-for, bez v-if:

Rešenje: prebaci logiku u computed property, da v-for uvek dobija već filtriran niz.  //U <img> moraš da proslediš $event, jer inače event u tvojoj metodi bude undefined.-->
      <div v-if="hoverCart" class="cart-tooltip">
  <div v-if="resolvedCartItems.length > 0">
    <strong>Vaša korpa:</strong>
    <ul>
      <li v-for="(item, index) in resolvedCartItems"
          :key="(item.stv_id || item.fk_stv_pro_id) + '-' + index"
          class="cart-item">
         
     <img 
  :src="getImageUrl(item)" 
  :alt="item.product?.pro_iupac || 'Proizvod'" 
  class="proizvod-slika" 
  @error="handleImageError($event, item.product?.pro_iupac)" 
/>
       <div class="cart-item-info">
  {{ item.product?.pro_iupac || 'Nepoznata stavka' }} - 
  {{ item.stv_kolicina }} kom - {{ item.uk_stv_cena.toFixed(2) }} RSD
</div>

      </li>
    </ul>
    <div>
  <strong>Ukupna cena: {{ calculateTotalPrice() }} RSD</strong>
</div>
<button class="add-korpa" @click="goToCheckout">Nastavak kupovine</button>
    
  </div>
  <div v-else>
    Korpa je prazna
  </div>
</div>
</div>



    
      <!-- Modal za prikaz korpe  Super 👌 znači dizajn smo rešili, sad je problem u logici brojača.

Trenutno ti cartCount pokazuje ukupan broj svih proizvoda iz baze (162), jer ga verovatno vezuješ direktno za stavke ili neku tabelu gde stoje sve narudžbine.
Ako hoćeš da kružić uvek broji od 0 i raste samo dok korisnik ubacuje proizvode u korpu, treba da ga računaš iz trenutnog stanja korpe na frontendu, a ne iz baze.

Najjednostavnije rešenje u Vue je ovako:  Popup korpe --> 
      <!-- Nova komponenta Korpa kao pop-up -->
<Korpa
  v-if="showCartPopup"
  :cart-items="cartItems"
  :items-map="itemsMap"
  @remove-item="removeFromCart"
  @clear-cart="clearCart"
  @checkout="placanjePouzecem"
  @go-to-checkout="goToCheckout"
/>


<div class="proizvodi-page">
  <div class="proizvodi-card">

    <!-- Naslov -->
    <h1>Hemikalije</h1>

    <!-- Pretraga , search query prati sta korisnik kuca-->
    <input 
      type="text" 
  v-model="searchQuery"  

        class="input"
      placeholder="Ukucaj naziv proizvoda po IUPAC"
      @input="searchData"
    />
    <p v-if="noResults" class="no-results">Nema proizvoda u pretrazi</p>

    <!-- Slika + tabela zajedno -->
      <div class="product-wrapper" v-if="selectedImageProizvod">
        
        <!-- Levo: Slika + količina + dugme, umesto filtereditems mora ici selectedImage proizvod da bi na osnovu jedne slike otvorio opis a ne da nam na osnovu svih mogucih stavki izbacuje opsi yza vise proizvoda -->
        <div class="selected-proizvod">
          <h3>{{ selectedImageProizvod.pro_iupac }}</h3>
          <img 
            :src="getImageUrl(selectedImageProizvod)" 
            :alt="selectedImageProizvod.pro_iupac" 
            class="proizvod-slika" 
            @error="handleImageError(selectedImageProizvod.pro_iupac)" 
          />

          <div class="quantity-container">
            <button @click="decreaseQuantity">-</button>
            <input 
              type="number" 
              v-model.number="productQuantity" 
              min="1" 
              class="quantity-input"
            />
            <button @click="increaseQuantity">+</button>
          </div>

          <div class="button-container">
            <button 
              @click="dodajUkorpu(selectedImageProizvod, productQuantity)" 
              class="add-korpa"
            >
              Dodaj u korpu
            </button>
          </div>
        </div>

        <!-- Desno: Tabela proizvoda -->
<div class="table-container" v-if="selectedImageProizvod">
  <table>
    <thead>
      <tr>
        <th>Opis proizvoda</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <p><strong>Naziv hemikalije po IUPAC:</strong> {{ selectedImageProizvod.pro_iupac }}</p>
          <p><strong>Cena:</strong> {{ selectedImageProizvod.pro_cena }} </p>
          <p><strong>Količina:</strong> {{ selectedImageProizvod.pro_kolicina }}</p>
          <p><strong>Jedinica mere:</strong> {{ selectedImageProizvod.pro_jedinicamere }}</p>
          <p><strong>Rok:</strong> {{ selectedImageProizvod.pro_rok }}</p>
          <p><strong>Lager:</strong> {{ selectedImageProizvod.pro_lager }}</p>
          <p><strong>Izgled:</strong> {{ selectedImageProizvod.spe_izgled || 'N/A' }}</p>
          <p><strong>Klasifikacija hemikalije:</strong> {{ selectedImageProizvod.spe_klashemikal || 'N/A' }}</p>
          <p><strong>Prva pomoć:</strong> {{ selectedImageProizvod.spe_prvapomoc || 'N/A' }}</p>
          <p><strong>Rukovanje i skladištenje:</strong> {{ selectedImageProizvod.spe_ruksklad || 'N/A' }}</p>
        </td>
      </tr>
    </tbody>
  </table>
        </div>

      </div> <!-- product-wrapper -->

    </div>
  </div></div>
</template>

<script>
import Korpa from '@/components/Korpa.vue';
import cartMixin from '@/mixins/cartMixin';
import axios from 'axios';
import moment from 'moment-timezone';
import '@/components/table.css';
import { getImageUrl } from '@/components/korpaimg.js';




export default {
   mixins: [cartMixin],
  name: 'Proizvodi',
    components: { Korpa, },
props: {
  proizvodId: {
    type: [String, Number],
    default: null
  }
},
computed: {
  cartCount() {
    return this.cartItems.reduce((acc, item) => acc + Number(item.stv_kolicina || 0), 0);
  }
},

watch: {
  // Kada se itemsMap promeni, možeš automatski ažurirati cart ili resolved stavke
  itemsMap: {
    handler(newMap) {
      console.log('🗺️ itemsMap je ažuriran:', newMap);
      // npr. možeš update-ovati resolvedCartItems ovde
    },
    deep: true,
    immediate: true
  },

  // Kada se promeni prop proizvodId
  proizvodId: {
    immediate: true,
    handler(id) {
      if (id) {
        this.loadProizvodById(id);
      }
    }
  },

  // Kada se promeni ruta (klik na novi proizvod iz piktograma)
  '$route.params.id'(newId) {
    if (newId) {
      this.loadProizvodById(newId);
    }
  }
},

  //Kad je nesto undefined, obavezno proveri da li si u data definisala, jer ako si ga pozvala u template ili u scripti u nekim funkcijama mora se kroz data definisati
  data() {
    return {
       proizvod: null,
      //Ako imaš items definisan kao niz svih proizvoda, tada ti ne treba posebno products – sve informacije koje ti trebaju (naziv, cena, lager, ID…) možeš da uzmeš direktno iz items.
    items: JSON.parse(localStorage.getItem('products')) || [], // svi proizvodi      
    selectedProduct: null,
      //Mora vrednost null u selectedImage Prioizvod

      selectedImageProizvod: null,
       searchQuery: '',
           noResults: false,  // <--- indikator da li nema rezultata
       productQuantity: 1,
        showCart: false, // Stanje za prikaz korpe
         //Roditelj da bi prenosio proizvod u ovom slucaju proizvodi vue komponente iz korpe mora biti definisan kao JSON parse, da bi helper funkcija radila moramo imaticartItems i items
    showCartPopup: false,   // dodatni toggle ako ti treba za modal

    //Ako u localStorage već imaš stare podatke (npr. 162 proizvoda), cartItems odmah dobija tu vrednost.cartCount u data() je 0, ali se nikada ne ažurira automatski dok ne pozoveš funkciju koja ga računa.Zato kružić uvek pokazuje stari broj iz localStorage dok ne izvršiš ručno ažuriranje.Rešenje: dodati ažuriranje cartCount odmah nakon učitavanja cartItems iz localStorage u mounted() i u loadCart():
          cartItems: JSON.parse(localStorage.getItem('cart')) || [],
           itemsMap: {},  // ← ovde je sada obična promenljiva, možeš joj dodeljivati vrednosti
          cartCount: 0,//Ovo cemo rucno azurirati
          hoverCart: false, // prati hover da se predje misesm preko korpe i prikaze stanje proizvoda
      
      
      
     

      // Pitala sam da li ce cartitems zavisiti od cart count, tj da li ce se dodati proizvodi u korpu prenositi sa roditeljske komponente ProizTi si već spomenuo da na „nastavak kupovine“ prenosiš podatke preko localStorage i JSON.stringify/parse (znam jer si imao localStorage.setItem('cart', JSON.stringify(this.cartItems)) u kodu).To znači da tvoji podaci o proizvodima nisu vezani za cartCount direktno, nego za cartItems (niz objekata). Dakle, roditeljska komponenta će se normalno prenositi, jer se prenosi cartItems, a cartCount je samo „prikaz“ broja iz cartItems.Praktično:Kada koristiš computed cartCount, on se računa uvek iz cartItems (koji već snimaš u localStorage).Na nastavku kupovine ti radiš JSON.parse(localStorage.getItem('cart')) i opet dobijaš cartItems.Pošto cartCount zavisi od cartItems, odmah će se ispravno prikazati.
      
      
      
     
    };
    //Inicijalizuješ cartItems iz localStorage odmah, što je OK: Međutim, imaš duplikate i preklapanja:items: [], items: JSON.parse(localStorage.getItem('products')) || [],showCart: false, Ispravno je imati samo jedan items niz i jedan showCart. Inače Vue uzima poslednju definiciju i može biti konfuzno.
  },

  //Ako vracas niz podataka onda je potrebno da ga incijalizujes kao niz obicno response.data.data bez ovog drugog data imaces gresku expected this items to be an array, but got...
  computed: {
    
  filteredItems() {
  if (!this.searchQuery) return this.proizvodi;

  const search = this.searchQuery.trim().toLowerCase();
  console.log('🔍 Search query:', search);

  return this.proizvodi.filter(p => {
    const naziv = p.pro_iupac.toLowerCase();
    const isMatch = naziv === search; // precizno podudaranje
    console.log('🧪 Proizvod:', naziv, '| Poklapa se:', isMatch);
    return isMatch;
  });
},
  },
  async mounted() {
  // 1) Prvo učitaj proizvode da itemsMap bude spreman
  await this.loadProducts();

 // 2. Povuci prethodno sačuvanu korpu iz localStorage, korisnik uvek rucno brise stavke iz korpe, ako te ne uradi stanje u korpi uvek ostaje isto
  this.loadCart();


  // 3) Ako želiš da povučeš staru korpu iz localStorage → koristi loadCart()
  // ⚠️ Ali NIKAKO odmah posle clearCart(), jer onda vraća stare podatke!
  // Odluka: ili krećeš od prazne korpe (clearCart) ili vraćaš stare podatke (loadCart), ali ne oba.
  
  // this.loadCart(); // koristiš samo ako hoćeš da vratiš prethodno sačuvanu korpu

  // 4) Ostali inicijalni podaci
  this.showCartPopup = false;
  this.searchData();
},

  created() {
    // Učitaj sve proizvode
    this.loadProducts();
    if (this.id) {
    this.loadProizvodById(this.id);
  }
  },
  
  
  
  methods: {
 
     getImageUrl(item) {
      return getImageUrl(item);
    },
   handleImageError(event, pro_iupac) {
  if (pro_iupac) {
    console.warn(`Slika nije pronađena za: ${pro_iupac}`);
  }
  if (event && event.target) {
    event.target.src = '/images/korpica.png'; // fallback
  }
},

    //U Vue, watch osluškuje promene vrednosti reactive data ili propova i izvršava se svaki put kad se ta vrednost promeni. Kada se watch event emitujeNa svaku promenu vrednosti koju gledaš (itemsMap u ovom slučaju). Ako staviš immediate: true, callback se poziva jednom odmah pri inicijalizaciji (kad se komponenta mountuje) čak i pre nego što se vrednost promeni.Ako staviš deep: true, Vue će osluškivati promene unutar objekta (dodavanje novih ključeva ili promena unutrašnjih vrednosti).
    //Prvo se otvara lista proizvoda, watch se stavlja posle methods
async loadProducts() {
  try {
    // 1) Učitaj sve proizvode
    const response = await axios.get('http://localhost:3007/proizvodi');
    this.items = response.data.data;

    // 2) Napravi mapu za brži pristup po ID
    this.itemsMap = this.items.reduce((map, item) => {
      map[String(item.pro_id)] = item; // obavezno string
      return map;
    }, {});

    // 3) Sačuvaj u localStorage (opciono)
    localStorage.setItem('itemsMap', JSON.stringify(this.itemsMap));

    console.log("✅ Svi proizvodi:", this.items.map(p => p.pro_id));
    console.log("🗺️ itemsMap ključevi:", Object.keys(this.itemsMap));

    // 4) Filtriraj proizvod po ID iz rute (ako postoji)
    const id = this.$route.params.id;
    if (id) {
      // konvertuj id u string jer su ključevi u itemsMap stringovi
      this.proizvod = this.itemsMap[String(id)] || null;
      if (!this.proizvod) {
        console.warn("⚠️ Proizvod sa ID-jem", id, "nije pronađen u itemsMap");
        // Opcionalno: fetch po ID-u ako ga nema
        // const res = await axios.get(`http://localhost:3007/proizvodi/${id}`);
        // this.proizvod = res.data;
      }
    }

    // 5) Proveri nedostajuće proizvode u korpi
    const missingIds = this.cartItems
      .map(ci => ci.fk_stv_pro_id)
      .filter(id => !this.itemsMap[String(id)]);
    if (missingIds.length) {
      console.warn('⚠️ Nedostajući proizvodi u itemsMap:', missingIds);
    }

  } catch (error) {
    console.error("❌ Greška pri učitavanju proizvoda:", error);
  }
},

   loadProizvodById(id) {
    // Pretpostavljam da itemsMap već ima sve proizvode
    const proizvod = this.itemsMap[String(id)];
    if (proizvod) {
      this.selectedImageProizvod = proizvod;
      console.log('✅ Učitano proizvod po ID-u:', proizvod);
    } else {
      // fallback: fetch sa API-ja ako ne postoji
      axios.get(`http://localhost:3007/proizvodi/${id}`)
        .then(res => {
          this.selectedImageProizvod = res.data;
        })
        .catch(err => {
          console.error('❌ Greška pri učitavanju proizvoda po ID-u:', err);
          this.selectedImageProizvod = null;
        });
    }
  },

   
    //Drugo otvara se korpa, medjutim proizvodi u komponenti su bili undefined, jer sam ih obrisala iz data, Ispravno je da koristiš this.items: 
     loadCart() {
      //loadCart() treba da samo učitava lokalnu kopiju iz localStorage
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.cartItems = cart;
    this.cartCount = cart.reduce((sum, item) => sum + (item.stv_kolicina || 0), 0);
    console.log('Cart items:', this.cartItems);
    console.log('Cart count:', this.cartCount);
  },

  //Za sve što zahteva ceo proizvod (slika, jedinica mere, itd.), treba da napraviš posebnu funkciju:
  getProduct(pro_id) {
    console.log("Tražim pro_id:", pro_id, "u items:", this.items);
 if (!Array.isArray(this.items)) return null;
  return this.items.find(p => p.pro_id === pro_id) || null;
},

  //Aha, ovo je ključno — znači fk_stv_pro_id u cartItems tačno pokazuje ID proizvoda, ali i dalje "Nepoznata hemikalija" iskače. 😅To znači da problem nije u ID-ju samom, nego u trenutku kada se poziva getProductIUPAC. Konkretno:this.items još nije popunjeno (loadProducts() se tek izvršava asinhrono).Funkcija getProductIUPAC se poziva pre nego što this.items ima sve proizvode, pa find vraća undefined.To objašnjava zašto prvi proizvod radi, a drugi ne — ako prvi je već renderovan nakon učitavanja items, a drugi je dodat pre nego što je items kompletno učitan. Rešenje:Uveri se da je items uvek popunjeno pre renderovanja pop-up-a ili poziva getProductIUPACMožeš npr. koristiti v-if="items.length" oko komponenti koje prikazuju naziv proizvoda, ili await this.loadProducts() u mounted() pre nego što korisnik može dodavati proizvode.Takođe, da izbegneš probleme sa tipovima:
    //Trece prepoznaj naziv proizvoda, da ne bi vracao nepoznata hemiklaija, treba preoslediti pravi kljuc, konretno ovde treba fk stv pro id a ne pro id 
    
    //u getProductIUPAC ne bi trebalo da praviš novi objekat za sliku, niti da računaš bilo šta osim naziva proizvoda. zato se pravi pomocna funkcija getProduct koja ce obuhvatiti ceo objekat proizvodi da ne bi pisalo Nepoznata hemikalija
    getProductIUPAC(pro_id) {
  const product = this.itemsMap[String(pro_id)];
  return product ? product.pro_iupac : "Nepoznata hemikalija";
},
//Evo zasto izbacuje Nepoznata hemikalija kad se dodaju drugi proizvodi pored jednog  ha, znači pro_id koji dolazi iz cartItems ne postoji u items u trenutku poziva funkcije. To se obično dešava iz jednog od ova tri razloga:items još nije učitan loadProducts() je asinhrona funkcija. Ako korisnik doda drugi proizvod pre nego što su svi proizvodi učitani, this.items.find(...) neće pronaći proizvod.Rešenje: čekaj da loadProducts() završi pre nego što korisnik može da doda proizvod, npr. pomoću await this.loadProducts() u mounted() ili async mounted().pro_id i tipovi se ne poklapaju. U cartItems možda imaš "2" (string), a u items 2 (number).Rešenje: koristi == umesto === u find:
    // konvertujemo na string ili broj radi sigurnog poređenja

    //Za definisanje dugmeyta Prikazi korpu, obe f-je i toogleCart i Load Cart treba pokrenuti, Problem: ako loadProducts() traje asinhrono, a getProductIUPAC() se poziva pre nego što se items napuni, vratiće Nepoznata hemikalija.Rešenje: ili koristi await this.loadProducts() u mounted() (ako je mounted async), ili vodi računa da getProductIUPAC() uvek proverava da li je niz prazan.Takođe, inicijalno postavljaš cartCount iz localStorage:


    //Cetvrto, aktiviraj funkciju dodajU korpu, let cart = JSON.parse(localStorage.getItem('cart')) || [];this.cartItems = cart;this.loadCart();ta se dešava, Ti svaku promenju korpe prvo učitavaš iz localStorage.Ako this.loadCart() ponovo prepisuje cartItems iz baze ili sa servera, onda svaki put kada dodaš novi proizvod, stari se briše.Zbog toga u popupu vidiš samo poslednji dodat proizvod.Kako popraviti. Ne prepisuj this.cartItems iz loadCart odmah nakon dodavanja.Napravi this.cartItems da bude izvor istine i ažuriraj localStorage samo da sinhronizuješ stanje.
   
  //product još nije definisan jer ga definišeš tek u sledećoj liniji Zato ti baca grešku ReferenceError: product is not defined.Na početku funkcije ne možeš logovati product jer još ne postoji. Umesto toga možeš da loguješ pro_iupac i quantity koje primaš kao argumente, a tek nakon što definišeš product možeš da ga loguješ.:

//Da, try/catch blok je koristan kad koristiš async/await jer omogućava da uhvatiš i obradiš greške koje se eventualno dese pri asinhronim operacijama — kao što su axios.post pozivi ili bilo koji drugi kod koji može baciti grešku.

//Peto, prikazi dodate Proizvode u korpu
    toggleCart() {
      this.showCart = !this.showCart;
      if (this.showCart) {
        this.loadCart();
      }
      console.log("📦 cartItems posle dodavanja:", JSON.stringify(this.cartItems, null, 2));
    },
    handleRemoveItem(item) {
    // promeni cartItems u roditelju, to će automatski osvežiti pop-up, da kad se aktivira dugme Ukloni automatski uklanja stavku
    this.cartItems = this.cartItems.filter(ci => ci.fk_stv_pro_id !== item.fk_stv_pro_id);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  },
    //// Funkcija koja vraća ukupnu militražu za stavku u korpi
     ukupnaKolicina(item) {
  const product = this.items.find(p => p.pro_id === item.fk_stv_pro_id);
  if (!product || !product.pro_jedinicamere) return '';

  // Izvuci broj i jedinicu iz stringa "100 ml" ili "1 kg"
  const match = product.pro_jedinicamere.match(/^([\d,.]+)\s*(\w+)$/);
  if (!match) return `${item.stv_kolicina} ${product.pro_jedinicamere}`; // fallback

  const broj = parseFloat(match[1].replace(',', '.')); // podrška za decimalne sa zarezom
  const jedinica = match[2];

  const ukupno = item.stv_kolicina * broj;

  return `${ukupno} ${jedinica}`;
},
//Proveri stanje u korpi, i predji na nastavak porudzbine
   
    //Međutim, kada pređeš na novu stranicu (Nastkupovine.vue), ne možeš automatski preneti cartItems jer data() ne pamti stanje preko stranica. Zato se koristi localStorage kao privremena memorija://Ovo nema veze sa data.cartItems – ovo je samo ime ključa u localStorage. Možeš ga nazvati kako god hoćeš, ali mora da se poklapa sa onim što koristiš pri čitanju, lakse je samo promeniti naziv umesto cartItems cart, jer to ce ti biti preneseno na nastakupovine.vue
     
   
     
   
    //U metodi createOrder, pozivaš localStorage.getItem('cart'), ali u goToCheckout() si prethodno sačuvala cartItems u localStorage, a ne cart, Ujednači ime ključa koji koristiš u localStorage, Opcija 1 – koristi cart svuda:
    //this.products verovatno puniš asinhrono, npr. preko axios.get u nekoj drugoj metodi kao loadProducts() ili u mounted().Kada klikneš na prikaz korpe i pozivaš loadCart(), this.products još nije sigurno dostupna (još traje učitavanje sa servera).Zato je važno da ili:sačekaš da se proizvodi učitaju pre nego što pozoveš loadCart()ili da osiguraš da this.products uvek ima inicijalnu vrednost (npr. prazan niz) i da se metoda getProductIUPAC prema tome ponaša.
   
    
    
    //created nije metoda u methods, već treba da stoji kao lifecycle hook van methods u objektu komponente.
 
  //Vidim u čemu je problem – tvoja metoda createOrder() je van methods bloka, a mora biti unutar njega da bi Vue znao da je to metoda komponente, zato kad sam pozivala poruci proizvod izbacivao je korpa je prazna!

  //Metoda gotoCheckout da se naruci proizov i da se prebaci na nastavak kupovine
  
  async createOrder(nacinPlacanja = 'Pouzećem') {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      console.error('Korpa je prazna');
      return; // ovde vraćamo funkciju, da se dalje ne izvršava kod
      
    }
    //Odavde krece komunikacija sa apijem preko post zahteva
//Greška Uncaught (in promise) undefined obično znači da se Promise odbija (reject), ali se negde u tvom kodu ne obrađuje pravilno (try/catch, await, ili .catch). Evo šta može biti problem u tvojoj situaciji:, Neslaganje između localStorage ključeva,  Dakle, čuvaš pod nazivom cartItems, a čitaš iz cart, zato cart bude null, pa length baca grešku, ili bude [], pa izbaci 'Korpa je prazna'.
      // Preuzimanje fk_nar_usr_id iz localStorage
      const fk_nar_usr_id = localStorage.getItem('fk_nar_usr_id');
    console.log('fk_nar_usr_id iz localStorage:', fk_nar_usr_id);

    if (!fk_nar_usr_id) {
      console.error('Nedostaje fk_nar_usr_id');
      return;
    }
     // Preuzimanje fk_nar_stv_id iz prvog elementa u korpi (ili prilagodite po potrebi)
     const fk_nar_stv_id = cart.length > 0 ? cart[0].stv_id : null;

if (!fk_nar_stv_id) {
  console.error('Nedostaje fk_nar_stv_id u korpi');
  return;
}
   // Kreiraj datum i vreme u Beogradskoj zoni
const nar_datum = moment().tz('Europe/Belgrade').format('YYYY-MM-DD HH:mm:ss');



    
    
  console.log('Šaljem narudžbinu sa načinom plaćanja:', nacinPlacanja);
    // Kreiraj narudžbenicu, i tu ide komunikacija sa axios post
    const response = await axios.post('http://localhost:3005/narudzbenice', {
      fk_nar_usr_id: fk_nar_usr_id,
      nar_datum: nar_datum, // Koristi formatirani datu
      nar_cena: this.calculateTotalPrice(),
      fk_nar_stv_id: fk_nar_stv_id,
       nac_plat: nacinPlacanja  // ovde ubacujemo nacin placanja (npr. 'Pouzećem')
    });

    const nar_id = response.data.nar_id;
    console.log('Narudžbenica kreirana sa ID-jem:', nar_id);

    // Spremi narudžbenicu u localStorage, da se cuva nar id u localstorage
const narudzbenica = {
  nar_id,
  fk_nar_usr_id,
  nar_datum,
  nar_cena: this.calculateTotalPrice(),
  fk_nar_stv_id,
   nac_plat: nacinPlacanja  // ovde ubacujemo nacin placanja (npr. 'Pouzećem')
    };


localStorage.setItem('narudzbenica', JSON.stringify(narudzbenica));



    

    // Očisti korpu i localStorage, Kada želiš da resetuješ korpu (npr. nakon narudžbine), obavezno postavi:
    this.cartItems = [];
this.cartCount = 0;
localStorage.setItem('cart', JSON.stringify([]));
      // Preusmeravanje na stranicu Narudžbenice
      this.$router.push('/narudzbenice');
  } catch (error) {
    console.error('Greška prilikom kreiranja narudžbenice:', error);
  }
},
//Funkcija za izracunvanje ukupne cene narudzbenice
calculateTotalPrice() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  return cartItems.reduce((total, item) => total + (item.stv_cena * item.stv_kolicina), 0);
},
    async refreshProductData() {
      try {
        const response = await axios.get('http://localhost:3007/proizvodi');
        this.items = response.data.data;
      } catch (error) {
        console.error('Greška prilikom osvežavanja podataka proizvoda:', error);
      }
    },

    getSelectedProduct() {
    return this.items.find(item => item.pro_iupac === this.selectedImageProizvod);
  },

//Ne moraš da kopiraš ceo objekat u placanjePouzecem, ali ti je potrebno da proslediš objekat sa svim poljima koja koristiš u showPopup, ovo je komentar koji je vazan da kad se klikne plati pouzecem prosledi objekat koji sadrzi showPopup
   
//Da placanjePouzecem se aktivira kao alert message


 showPopup(productDetails) {
  let message = `Proizvod: ${productDetails.pro_iupac}\nKoličina: ${productDetails.stv_kolicina}\nCena po jedinici: ${productDetails.pro_cena}\nUkupna cena: ${productDetails.uk_stv_cena}`;
  
  if (productDetails.error) {
    message += `\n${productDetails.error} ${productDetails.pro_iupac}`;
  }
  
  alert(message);
},


async fetchCartItems() {
  try {
    const response = await axios.get('http://localhost:3005/narudzbenice');
    console.log('Stavke iz servera:', response.data);

    if (response.data && Array.isArray(response.data)) {
      this.cartItems = response.data;

      // Ažuriraj cartCount
      this.cartCount = this.cartItems.reduce(
        (acc, item) => acc + (Number(item.stv_kolicina) || 0),
        0
      );

      // Sinhronizuj localStorage
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      console.log('LocalStorage ažuriran:', this.cartItems);
    } else {
      this.cartItems = [];
      this.cartCount = 0;
      localStorage.setItem('cart', JSON.stringify([]));
    }
  } catch (error) {
    console.error('Greška prilikom preuzimanja stavki iz korpe:', error);
    this.cartItems = [];
    this.cartCount = 0;
    localStorage.setItem('cart', JSON.stringify([]));
  }
},


//Nema potrebe za async ili try/catch.Ovo odmah resetuje Vue state i localStorage
  //Evo šta se dešava:localStorage.setItem('cart', JSON.stringify([])) – ovo postavlja cart na prazan niz. ✅Odmah posle toga, localStorage.removeItem('cart') – ovo briše ključ iz localStorage. ❌Znači da kada Vue mounted() ili loadCart() pozove JSON.parse(localStorage.getItem('cart')) || [], dobija stari niz jer removeItem možda nije sinhronizovan ili je page reload učitao prethodni state. Ne treba ti ni removeItem. Samo postavi cart na prazan niz i ažuriraj Vue podatke:
  //Resetovanje korpe iz localStorage na prazan niz
  
   // Resetuj niz stavki u Vue komponenti
  
  // Resetuj brojač proizvoda

  // Resetuj localStorage
 
// Pretpostavimo da imate metodu za dobijanje ID-a narudžbenice


//Aha, sad mi je jasno zašto ti se i dalje pojavljuje 162 u kružiću ✅Problem je redosled i način na koji učitavaš i čuvaš korpu.Na početku funkcije nemaš definisan cart pre nego što radiš localStorage.setItem('cart', JSON.stringify(cart)), pa se dešava da Vue pokupi staru vrednost (162 iz prethodnog localStorage-a).📌 Evo kako treba da ide redosled u tvojoj funkciji dodajUkorpu (skraćeno i popravljeno):
 //U tvom kodu dodajUkorpu lepo ažuriraš localStorage i tamo snimaš ceo niz stavki (cart). Međutim, nigde ne ažuriraš direktno cartCount na frontendu, pa ti on ostaje "statičan" (trenutno prikazuje sve proizvode iz baze — 162).Rešenje je da brojač uvek računa vrednost iz cart (tj. iz localStorage ili iz this.cartItems).

//KOd iznad je optimizovan Uklonio sam deo gde si uklanjao duplikate pomoću .filter(). Sad ako proizvod postoji, samo ažuriraš količinu.Logika je jasnija i linearnija.I dalje radiš POST na backend i čuvaš stv_id iz odgovora.I dalje osvežavaš proizvode i prikazuješ popup.Dodao sam eksplicitni return posle greške za nedostatak zaliha da se funkcija odmah prekine
// //Zasto se localStorage vracao kao prazan niz Pregled glavnih tačaka:U localStorage koristiš ključ "cart", a u PaymentForm si učitavao "cartItems" — to nije isto!Trebalo bi da koristiš isti ključ na obe strane, npr. cartItems, da se ne bi gubili podaci. U localStorage.setItem koristiš ključ "cart", a u PaymentForm localStorage.getItem('cartItems').To će uvek dati prazan niz jer tražiš na pogrešnom mestu.U tvom kodu treba da se uskladi ključ za lokalno čuvanje korpe:ili promeni sve da koriste "cart", ili sve da koriste "cartItems".




async searchData() {
  try {
    const url = `http://localhost:3007/proizvodi?search=${encodeURIComponent(this.searchQuery)}`;
    const response = await axios.get(url);

    this.items = response.data.data || [];
    const query = this.searchQuery.toLowerCase().trim();

    if (query) {
      const exactMatch = this.items.find(item => item.pro_iupac.toLowerCase().trim() === query);
      this.selectedImageProizvod = exactMatch || this.items.find(item => item.pro_iupac.toLowerCase().includes(query)) || null;

      // Ako nema rezultata, postavi indikator
      this.noResults = !this.selectedImageProizvod;
    } else {
      this.selectedImageProizvod = null;
      this.noResults = false;
    }
  } catch (error) {
    console.error('Greška prilikom pretrage:', error);
    this.selectedImageProizvod = null;
    this.noResults = false;
  }
},
//U funkciji getImageUrl(pro_iupac) očekuješ da pro_iupac bude string, ali u praksi možda prosleđuješ ceo objekat, kao što je:

//Šta radi getImageUrl?Ova funkcija pokušava da pronađe sliku za dati proizvod tako što pravi tri različite varijante imena fajla (slike) i za svaku proverava da li postoji.Na primer, ako je ime proizvoda "Aluminijum Oksid", ona će isprobati ove tri varijante:"aluminijum oksid.jpg""aluminijumoksid.jpg""aluminijum_oksid.jpg"Ako nijedna ne postoji, vratiće podrazumevanu sliku, npr. korpu.

//


//Najjednostavnije – premestiti slike u public folder,Stavi slike u public/images/Putanja se tada formira dinamički i ne koristi require:



      
    
//Aha, sad je jasno 👀U Vue 2 @error handler ti ne prosleđuje automatski event osim ako ga eksplicitno ne zatražiš.IspravkaU <img> moraš da proslediš $event, jer inače event u tvojoj metodi bude undefined.
  
//Ali placanjePouzecem treba ceo proizvod (objekat), a ne samo string pro_iupac, zato ce ti izbaciti gresku undefined kad kliknes plati pouzecem
    selectProizvod(product) {
      //Kod selected proizvod treba da cuvas proizvod kao objekat a ne samo jedno polje, umesti prioizvod u zagradi je bilo pro_iupac, znaci treba umesto toga pisati proizvod
      console.log('Selected proizvod:', product);
      this.selectedImageProizvod = product;
    },

    increaseQuantity() {
      this.productQuantity += 1;
      console.log('Increased quantity:', this.productQuantity);
    },

    decreaseQuantity() {
      if (this.productQuantity > 1) {
        this.productQuantity -= 1;
        console.log('Decreased quantity:', this.productQuantity);
      }
    },

   toggleCartPopup() {
    const isMobile = window.innerWidth <= 768; // mobilni uređaji
    if (isMobile) {
      this.showCartPopup = !this.showCartPopup;
    } else {
      // Na desktopu, side drawer logika ostaje ista
      // npr. možeš ovde otvoriti korpu sa strane ili ostaviti prazan
      console.log('Desktop side drawer korpa');
    }
    console.log('Toggled cart popup. Show:', this.showCartPopup);
  }
    
  
  },
 

    
      //Jedino treba paziti na redosled asinhronih akcija: ako itemsMap puniš u mounted() ili async created(), watch će se pokrenuti tek kada se vrednost promeni, što je upravo ono što želiš. watch NE sme da bude unutar methods.
    
     

 
  }
  
  

//Sve asinhrone metode (axios) treba čekati pre nego što korisnik interaguje.
//Vidim ceo template i script 👌 i problem je vrlo jasan – kružić ( cartCount ) i prikaz u tooltipu u nekim momentima ne prate realno stanje, a ume da iskače i "Nepoznata hemikalija". To dolazi iz dve stvari: Asinhrono učitavanje proizvoda (loadProducts) – this.items i this.itemsMap još nisu spremni kad se pozove getProductIUPAC ili render korpe. Zato prvi proizvod nekad bude prazan ili nepoznat.✅ Rešenje: koristi await this.loadProducts() odmah u mounted() i ne renderuj tooltip dok items.length === 0.cartCount nije computed nego običan broj – sada ga ručno ažuriraš u loadCart(). To radi, ali često ostane u starom stanju (npr. 162 proizvoda iz localStorage).✅ Rešenje: prebaci cartCount u computed da uvek zavisi od cartItems:  
</script>





<style  >

</style>
