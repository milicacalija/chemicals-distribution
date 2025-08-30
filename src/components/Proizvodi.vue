<template>
  <div>
    <!-- Cart Icon sa tooltipom -->
    <div class="cart-icon"
      @mouseenter="hoverCart = true" 
     @mouseleave="hoverCart = false">
      <img src="@/assets/korpica circle.png" alt="Korpa" @click="toggleCartPopup" />
      <!-- Brojač proizvoda -->
  <div v-if="cartCount" class="cart-count">{{ cartCount }}

  </div> 

  
   <!-- Tooltip na hover Da 👍 imaš zaštitu (v-if="itemsMap[item.fk_stv_pro_id]"), ali problem je što si je stavila unutra <div>, a ne na sam <li>.

👉 Vue ti uvek napravi <li> zbog v-for, ali ako itemsMap još nije spreman, <div> iznutra ne renderuje → pa u DOM-u ostaje prazan <li> koji se prikazuje kao tačkica.

Zato prvi proizvod vidiš kao tačku (prazan <li>), a drugi lepo radi jer mu itemsMap stigne na vreme. Samo pomeri v-if sa <div> na <li>:  Aha, jasno 👌
Vue 2 ti javlja upozorenje jer ne voli kombinaciju v-for + v-if na istom elementu (iako to tehnički radi).U šablonu koristi samo v-for, bez v-if:

Rešenje: prebaci logiku u computed property, da v-for uvek dobija već filtriran niz.-->
      <div v-if="hoverCart" class="cart-tooltip">
  <div v-if="resolvedCartItems.length > 0">
    <strong>Vaša korpa:</strong>
    <ul>
      <li v-for="(item, index) in resolvedCartItems"
          :key="(item.stv_id || item.fk_stv_pro_id) + '-' + index"
          class="cart-item">
        <img 
          :src="getImageUrl(item.product)" 
          :alt="item.product.pro_iupac" 
          class="cart-item-image"
          @error="handleImageError(item.product.pro_iupac)"
        />
        <div class="cart-item-info">
          {{ item.product.pro_iupac }} - 
          {{ item.stv_kolicina }} kom - {{ item.uk_stv_cena.toFixed(2) }} RSD
        </div>
      </li>
    </ul>
    <div><strong>Ukupno proizvoda: {{ cartCount }}</strong></div>
    <button class="add-korpa" @click="goToCheckout"> Nastavak kupovine</button>
    
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

     <h1>Hemikalije</h1>
    <input 
      type="text" 
      v-model="searchQuery" 
      class="input"
      placeholder="Ukucaj naziv proizvoda po IUPAC"
      @input="searchData"
    />

    <!-- Selektovani proizvod -->
    <div v-if="selectedImageProizvod">
      <h3>{{ selectedImageProizvod.pro_iupac }}</h3>
      <img :src="getImageUrl(selectedImageProizvod)" 
           :alt="selectedImageProizvod.pro_iupac" 
           class="proizvod-slika" 
           @error="handleImageError(selectedImageProizvod.pro_iupac)" />
      
      <div class="quantity-container">
        <button @click="decreaseQuantity">-</button>
        <input type="number" v-model.number="productQuantity" min="1" class="quantity-input"/>
        <button @click="increaseQuantity">+</button>
      </div>

      <div class="button-container">
        <button @click="dodajUkorpu(selectedImageProizvod, productQuantity)" class="add-korpa">Dodaj u korpu</button>
       
      </div>
    </div>

    <!-- Potpuno je pogresno da kod sadrzi samo p v else if korpa je prazna, moramo postaviti uslov, jer na taj nacin kompjuter hardkuduje informaciju a ne povezuje sa stvarnim stanjem u korpi -->

    <div class="table-container">
      <table v-if="filteredItems.length">
        <thead>
          <tr>
            <th>Naziv hemikalije po IUPAC</th>
            <th>Cena</th>
            <th>Količina</th>
            <th>Jedinica mere</th>
            <th>Rok</th>
            <th>Lager</th>
            <th>Izgled</th>
            <th>Klasifikacija hemikalije</th>
            <th>Prva pomoć</th>
            <th>Rukovanje i skladištenje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.pro_id" @click="selectProizvod(item.pro_iupac)">
            <td>{{ item.pro_iupac }}</td>
            <td>{{ item.pro_cena }}</td>
            <td>{{ item.pro_kolicina }}</td>
            <td>{{ item.pro_jedinicamere }}</td>
            <td>{{ item.pro_rok }}</td>
            <td>{{ item.pro_lager }}</td>
            <td>{{ item.spe_izgled || 'N/A' }}</td>
            <td>{{ item.spe_klashemikal || 'N/A' }}</td>
            <td>{{ item.spe_prvapomoc || 'N/A' }}</td>
            <td>{{ item.spe_ruksklad || 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No data found</p>
  
    </div>
  </div> <!-- zatvara root div --> 
</template>

<script>
import Korpa from '@/components/Korpa.vue';
import cartMixin from '@/mixins/cartMixin';
import axios from 'axios';
import moment from 'moment-timezone';




export default {
   mixins: [cartMixin],
  name: 'Proizvodi',
    components: { Korpa },

  //Kad je nesto undefined, obavezno proveri da li si u data definisala, jer ako si ga pozvala u template ili u scripti u nekim funkcijama mora se kroz data definisati
  data() {
    return {
      //Ako imaš items definisan kao niz svih proizvoda, tada ti ne treba posebno products – sve informacije koje ti trebaju (naziv, cena, lager, ID…) možeš da uzmeš direktno iz items.
    items: JSON.parse(localStorage.getItem('products')) || [], // svi proizvodi      
    selectedProduct: null,
      //Mora vrednost null u selectedImage Prioizvod

      selectedImageProizvod: null,
       searchQuery: '',
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
    //Umesto da stalno tražiš proizvod po pro_id, možeš:Napraviti mapu pro_id -> proizvod pri učitavanju items:
//Aha, znači itemsMap je vezan za this.items 👌To objašnjava problem:Ako ti se prvi proizvod u korpi prikazuje kao tačkica → to znači da u trenutku kada renderuješ cartItems, u itemsMap još nema podatka za taj fk_stv_pro_id. Vue onda napravi <li> ali nema šta da prikaže unutra.Za drugi proizvod se verovatno stigne popuniti itemsMap, pa se lepo pokaže.Dakle, uzrok je što se cartItems puni brže nego items (odakle praviš itemsMap).Dodaj zaštitu u v-forVeć si stavila v-if="itemsMap[item.fk_stv_pro_id]", ali ipak renderuje prazno <li>. Možeš umesto toga da potpuno preskočiš <li> dok se ne popuni mapa :

  //Problem: unutar same computed property pozivaš this.itemsMap → Vue računa itemsMap da bi dobio vrednost, što opet poziva itemsMap, i tako beskonačno → too much recursion.//Nikada u computed property ne pozivati samu sebe.Ako želiš da loguješ rezultat, loguj privremenu promenljivu, ne this.itemsMap://
  

//Ako istovremeno imaš computed itemsMap() { ... }, Vue će biti zbunjen – computed property i data property ne mogu imati isti naziv. To može izazvati too much recursion ili undefined jer computed property stalno prepisuje this.itemsMap.
  //Tvoj resolvedCartItems vraća samo proizvod sa fk_stv_pro_id: 215, iako u cartItems imaš i proizvod sa fk_stv_pro_id: 1.Razlog: tvoja itemsMap ne sadrži proizvod sa pro_id = 1 u trenutku kada se resolvedCartItems računa.U console logu vidimo da cartItems sadrži oba proizvoda: 1 i 215. ✅Ali resolvedCartItems vraća samo 215 jer je this.itemsMap[1] undefined. ❌To znači da proizvod sa pro_id = 1 nije učitan u this.items kada Vue računa resolvedCartItems. Uveri se da svi proizvodi iz baze su učitani u this.items pre nego što korisnik može da doda proizvod u korpu.Ako korisnik doda proizvod pre nego što this.items stigne iz API-ja, onda itemsMap ne može da ga pronađe.Možeš dodati log unutar resolvedCartItems da vidiš koje ID-jeve itemsMap sadrži:ZaključakProblem nije u logici resolvedCartItems nego u redosledu podataka:cartItems ima stavke koje još nisu u this.items,zato itemsMap[ci.fk_stv_pro_id] vraća undefined.
  // Samo stavke koje imaju pronađen proizvod + ubacujemo product direktno u stavku
  
  // itemsMap još nije spreman
  

      //Zašto se ovo dešava, dakle odnosi na poruku Nije pronadjen proizvod u itemsMap,itemsMap se pravi iz this.items (lista svih proizvoda sa API-ja).Ako this.items još nije stiglo sa API-ja, itemsMap je prazan → prvi ili drugi proizvod iz korpe nema odgovarajući objekat → preskočen jeKada dodaš proizvod koji je poslednji učitan ili trenutno prisutan u items, tada ga resolvedCartItems uspešno mapira → zato vidiš samo poslednji proizvod.Drugim rečima: resolvedCartItems se računa pre nego što items stignu sa servera.//RešenjeZaštita u resolvedCartItems da čeka itemsMap:// Ako this.items još nije stigao sa servera (axios.get('/proizvodi')), itemsMap[1] ne postoji → resolvedCartItems ne može da nađe proizvod → fallback se koristi.//RešenjeMoramo da čekamo da proizvodi budu učitani pre nego što mapiramo cartItems u resolvedCartItems.//Koraci:U loadCart() ili mounted(), nakon što dobijemo proizvode sa API-ja (this.items = ...), tek onda učitaj cartItems i izračunaj resolvedCartItems.Ne pozivati loadCart() unutar dodajUkorpu ako menja cartItems pre nego što this.items stigne – može da pokrene prerano računanje.Optional: dok proizvodi ne stignu, prikaži loader ili praznu korpu, umesto fallback.
    
        
    // Debug: uspešno pronađen proizvod


    

  //Aha, ovo objašnjava deo problema. Poruka “unreachable code detected” znači da JavaScript vidi da deo koda posle return nikada neće biti izvršen.//


  //Ti koristiš result, ali nisi ga nigde definisala. U trenutnoj verziji map + filter direktno vraća niz, ali ti pokušavaš da console.log(result) i return result, a result ne postoji.Zato JavaScript prijavljuje grešku (ili unreachable code) jer result je nepoznata promenljiva.//
  

    //Ako je cartCount definisan u data, ne treba ga istovremeno definisati i u computed
    filteredItems() {
      // Proveriti pre koriscenja da li je this.items niz
      if (!Array.isArray(this.items)) {
        console.error('Expected this.items to be an array, but got:', this.items);
        return [];
      }

      if (!this.searchQuery) {
        return this.items;
      }

      const query = this.searchQuery.toLowerCase();
      return this.items.filter(item =>
        item.pro_iupac.toLowerCase().includes(query)
      );
    }
  },
  async mounted() {
    await this.loadProducts(); // axios.get('/proizvodi'), pre nego sto se loaduje korpica prvo prikazi sve proizvode

    //Tačno! 😄Problem je bio što si u mounted() dvaput učitavala korpu iz localStorage/servera, pa se stari podaci vraćali pre nego što bi clearCart() resetovao Vue state i kružić.Sad je logika jasna i čista:clearCart() resetuje cartItems, cartCount i localStorage – kružić odmah pokazuje 0.loadCart() se koristi samo kad želiš ručno osvežavanje iz localStorage nakon dodavanja/uklanjanja proizvoda.fetchCartItems() više nije potreban u mounted() jer ne želiš automatsko punjenje stare korpe sa servera.
    //Ovde prvo pozivaš clearCart(), što bi trebalo da očisti korpu.Ali odmah zatim pozivaš this.loadCart(), a ta funkcija učitava korpu iz localStorage.Problem: clearCart() i loadCart() se izvršavaju gotovo istovremeno, i pošto loadCart() uzima stare podatke iz localStorage (koji možda još nisu resetovani), kružić i dalje pokazuje 162.Rešenje: treba da resetuješ lokalnu korpu i odmah ažuriraš cartItems i cartCount bez pozivanja loadCart() odmah nakon toga.
     this.clearCart();  // reset na početku
      this.loadProducts();      // sad resolvedCartItems radi ispravno
  this.showCartPopup = false;

  this.searchData();

  // Učitaj korpu iz localStorage
  //Ah, sada vidim problem. 😅U tvom mounted() imaš dva različita načina učitavanja korpe, i zbog toga može da bude zabune ili greške:Pozivaš this.loadCart(), koja možda takođe pokušava da definiše ili koristi cart, ali unutar te funkcije možda cart nije definisan ili se ne koristi lokalno.Nakon toga direktno radiš:
  
},
  methods: {
     buildItemsMap() {
    const map = {};
    (this.items || []).forEach(p => { map[p.pro_id] = p; });
    console.log('🗂 itemsMap:', JSON.stringify(map, null, 2));
    return map;
  },
    //Prvo se otvara lista proizvoda
    async loadProducts() {
      try {
        //  // poziv API-ja
        const response = await axios.get('http://localhost:3007/proizvodi');
        this.items = response.data.data;
        this.itemsMap = this.buildItemsMap();  // dodeljuješ običnoj data promenljivoj
 // Debug log
    console.log("✅ Svi proizvodi iz backend-a:", this.items.map(p => p.pro_id));
   // Formiraj itemsMap
    this.itemsMap = this.items.reduce((map, item) => {
      map[item.pro_id] = item;
      return map;
    }, {});
       console.log("🗺️ itemsMap ključevi:", Object.keys(this.itemsMap));
  } catch (error) {
    console.error("❌ Greška prilikom učitavanja proizvoda:", error);
  }

      // proveri da li su svi proizvodi iz korpe prisutni, U JavaScript-u ključevi objekata (itemsMap) su stringovi, a fk_stv_pro_id je broj. Zato !this.itemsMap[id] može biti true čak i ako proizvod postoji, jer '112' !== 112.Da bismo to izbegli, treba konvertovati id u string:
  const missingIds = this.cartItems
    .map(ci => ci.fk_stv_pro_id)
  .filter(id => !this.itemsMap[String(id)]);
      if (missingIds.length) {
    console.warn('⚠️ Nedostajući proizvodi u itemsMap:', missingIds);
    // opcionalno: fetch po ID-ju ako želiš da bude kompletno
    // const missingProducts = await axios.get(`/api/proizvodi?id_in=${missingIds.join(',')}`);
    // this.items.push(...missingProducts.data);

    }},
   
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

  if (!Array.isArray(this.items)) return "Nepoznata hemikalija";

  // poređenje tipova fleksibilno sa ==
const product = this.items.find(item => item.pro_id == pro_id); // == fleksibilno poređenje
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
    const response = await axios.get('http://localhost:3009/stavke');
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
    // Dobro je koristiti encodeURIComponent za query parametar
    const url = `http://localhost:3007/proizvodi?search=${encodeURIComponent(this.searchQuery)}`;

    // Očekuješ da backend vraća podatke u response.data.data, pa pazi da li backend stvarno tako šalje.
    const response = await axios.get(url);

    this.items = response.data.data || [];  // Ako response.data.data ne postoji, fallback na prazan niz

    if (this.items.length > 0) {
      this.selectedImageProizvod = this.items[0];  // Automatski selektuješ prvi proizvod iz pretrage, umesto da selektrujemo samo jedna proizvod (bilo je pro_iupac nakon rhis items (0) e pa umesto toga treba samo da pise 0) treba ceo objekat da se selektuje
    } else {
      this.selectedImageProizvod = null;  // Nema rezultata, obriši selekciju
    }
  } catch (error) {
    console.error('Greška prilikom pretrage:', error);
    this.items = [];
  }
},
//U funkciji getImageUrl(pro_iupac) očekuješ da pro_iupac bude string, ali u praksi možda prosleđuješ ceo objekat, kao što je:

//Šta radi getImageUrl?Ova funkcija pokušava da pronađe sliku za dati proizvod tako što pravi tri različite varijante imena fajla (slike) i za svaku proverava da li postoji.Na primer, ako je ime proizvoda "Aluminijum Oksid", ona će isprobati ove tri varijante:"aluminijum oksid.jpg""aluminijumoksid.jpg""aluminijum_oksid.jpg"Ako nijedna ne postoji, vratiće podrazumevanu sliku, npr. korpu.

//
    getImageUrl(product) {
        const naziv = product.pro_iupac.toLowerCase();
//Zašto tri puta toLowerCase()?toLowerCase() pretvara ceo tekst u mala slova, da bi bila veća šansa da ime fajla na disku odgovara nazivu. Pošto Windows i drugi sistemi razlikuju velika i mala slova, pravljenje svih naziva malim slovima je standardna praksa.Primer: "Aluminijum Oksid" → "aluminijum oksid""Aluminijum Oksid" → "aluminijumoksid""Aluminijum Oksid" → "aluminijum_oksid"

//Kako da koristiš proizvod u funkciji?Pretpostavljam da proizvod ovde nije string, nego objekat (npr. { pro_iupac: 'Aluminijum Oksid', pro_cena: 3000, ... })Zato treba da koristiš naziv iz tog objekta, npr. proizvod.pro_iupac

        const tryImagePaths = [
    naziv,                       // npr. "aluminijum oksid"
    naziv.replace(/ /g, ''),     // npr. "aluminijumoksid"
    naziv.replace(/ /g, '_')     // npr. "aluminijum_oksid"
  ];


      for (const name of tryImagePaths) {
        try {
          const imagePath = require(`@/assets/${name}.jpg`);
          return imagePath;
        } catch (e) {
          // Fail silently; image not found
        }
      }

      return require('@/assets/korpica circle.png');
    },

    handleImageError(pro_iupac) {
      console.log(`Image not found for: ${pro_iupac}`);
    },
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
      this.showCartPopup = !this.showCartPopup;
      console.log('Toggled cart popup. Show:', this.showCartPopup);
    },
     

  created() {
    this.loadProducts(); // Učitaj proizvode kada se komponenta kreira
  }
  }}
  
</script>






<style scoped>
.table-container {
  margin-top: 20px;
}

.proizvod-slika {
  width: 300px;
  height: 300px;
  margin-top: 20px;
}

.input {
  width: 300px;
  height: 30px;
  border-radius: 20px;
}

.table-container {
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
  text-align: center; /* Centriranje teksta u tabeli */
}

th {
  background-color: #f2f2f2;
}

h3 {
  text-align: center; /* Centriranje naslova */
}

img {
  display: block;
  margin: 0 auto; /* Centriranje slike */
}

.cart-icon {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
   /* Dodajte ovu liniju position: relative; za pozicioniranje brojača */
}

.cart-icon img {
  width: 60px; /* Prilagodite veličinu slike prema potrebi */
  height: 60px;
  display: block;
}

.cart-count {
  position: absolute;
  top: 0;      /* gornji ugao ikone */
  right: 0;    /* desni ugao ikone */
  /* Pomeri brojač da bude tačno iznad ikone transform: translateX(50%);  */
  background: red; /* Boja pozadine brojača */
  color: white; /* Boja teksta brojača */
  border-radius: 50%;
  padding: 2px 6px;
  width: 20px; /* Veličina brojača */
  height: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 12px; /* Veličina fonta brojača */
}
.cart-popup {
  position: fixed; /* popup iznad svega */
  top: 50%;        /* centrirano vertikalno */
  left: 50%;       /* centrirano horizontalno */
  transform: translate(-50%, -50%); /* da bude tačno u centru */
  background-color: #fff; /* bela pozadina */
  border: 2px solid #ccc; /* vidljiv okvir */
  border-radius: 12px;    /* zaobljeni uglovi */
  box-shadow: 0 8px 20px rgba(0,0,0,0.3); /* senka */
  padding: 20px;  /* unutrašnje margine */
  max-width: 400px; /* širina popup-a */
  width: 90%;    /* responsivno */
  z-index: 1000; /* da bude iznad svega */
  overflow: hidden;                /* da header i telo budu u istom prozoru */

}
.cart-popup h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  text-align: center;
}

.cart-popup ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px; /* da popup ne raste previše */
  overflow-y: auto;  /* skrol ako ima mnogo stavki */
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.cart-item-info {
  flex: 1;
  font-size: 14px;
}
.cart-popup button {
  display: block;
  margin: 15px auto 0 auto;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  transition: background-color 0.2s ease;
}

.cart-popup button:hover {
  background-color: #0056b3;
}

.quantity-container {
  display: flex;
  align-items: center;
  justify-content: center; /* Centriranje unutar container-a */
  margin-top: 10px;
}

.quantity-container button {
  width: 30px;
  height: 30px;
  font-size: 20px;
  cursor: pointer;
}

.quantity-input {
  width: 60px;
  text-align: center;
  margin: 0 10px; /* Razmak između dugmadi i inputa */
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

.cart-popup {
  background-color: white;
  border: 1px solid black;
  padding: 10px;
  position: fixed;
  top: 50px;
  right: 10px;
  z-index: 1000; /* Osiguraj da je iznad drugih elemenata */
  display: none; /* Sakrij ako se ne prikazuje */
}



.close-popup-button {
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}

button {
  margin-left: 10px;
}
</style>
