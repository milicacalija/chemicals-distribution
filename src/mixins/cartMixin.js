import axios from 'axios';
import moment from 'moment-timezone';
import Swal from 'sweetalert2'; //da bi lepsi i pregledniji bio alert sa izmenljivom porukom, da ne pise samo ok

//U Vue komponenti redosled i nivo zagrada mora biti strogo ovakav:export default {  components: { … },  data() { … }, computed: { … }, methods: { … },mounted() { … },created() { … }
//
export default {
  data() {
    return {
      cartItems: JSON.parse(localStorage.getItem('cart')) || [],
      cartCount: 0,
      itemsMap: JSON.parse(localStorage.getItem('itemsMap')) || {}
    };
  },
  computed: {
    resolvedCartItems() {
      const resolved = (this.cartItems || []).map(ci => {
        const product = this.itemsMap[ci.fk_stv_pro_id];
        if (!product) {
          console.warn('⚠️ Nije pronađen proizvod u itemsMap:', ci.fk_stv_pro_id);
          return null;
        }
        return { ...ci, product };
      }).filter(Boolean);

      console.log('🛒 resolvedCartItems:', resolved);
      return resolved;
    }
  },
  methods: {
     async dodajUkorpu(pro_iupac, quantity) {
  //Da proverimo da le je pro_iupac string i da nije undefined 
  console.log('>>> Poziv funkcije dodajUkorpu sa:', pro_iupac, quantity);

  // da budemo sigurni da pro iupac je objekat pokazace tip podataka npr pro ipuac natrijum hlorid 
  console.log('>>> pro_iupac objekat:', pro_iupac);
  console.log('>>> Tip pro_iupac:', typeof pro_iupac);


//Imali smo proizvod pronadjen undefined iz tog razloga dodatno console.log ubacujemo
console.log('Poziv sa:', pro_iupac, quantity);
  console.log('Lista proizvoda:', this.items);
    try {
    console.log('>>> Poziv dodajUkorpu sa:', pro_iupac, quantity);
    console.log('>>> Trenutna cartItems pre dodavanja:', JSON.stringify(this.cartItems, null, 2));

    // 1. Pronađi proizvod u items
    const product = this.items.find(item => item.pro_iupac === pro_iupac.pro_iupac);
    if (!product) {
      console.error('❌ Proizvod nije pronađen!');
      return;
    }
    console.log('✅ Pronađen proizvod:', product);

    // 2. Napravi kopiju trenutne korpe (iz Vue state)
    let cart = [...this.cartItems];
    console.log('📦 Kopija trenutne korpe pre modifikacije:', cart);

    // 3. Proveri da li proizvod već postoji
    const existingItem = cart.find(item => item.fk_stv_pro_id === product.pro_id);
    if (existingItem) {
      existingItem.stv_kolicina += quantity;
      existingItem.uk_stv_cena = existingItem.stv_kolicina * existingItem.stv_cena;
      console.log('🔄 Postojeći proizvod ažuriran:', existingItem);
    } else {
      const newItem = {
        fk_stv_pro_id: product.pro_id,
        stv_kolicina: quantity,
        stv_cena: product.pro_cena,
        uk_stv_cena: quantity * product.pro_cena
      };
      cart.push(newItem);
      console.log('➕ Novi proizvod dodat:', newItem);
    }

    // 4. Sačuvaj u localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('💾 Sačuvano u localStorage:', JSON.stringify(cart, null, 2));

    // 5. Ažuriraj Vue stanje
    this.cartItems = cart;
    this.cartCount = cart.reduce((sum, item) => sum + item.stv_kolicina, 0);

    console.log('🎯 Ažurirana cartItems u Vue:', JSON.stringify(this.cartItems, null, 2));
    console.log('🔢 Broj proizvoda u korpi:', this.cartCount);

    // ⚠️ PAZITE: ne pozivati loadCart odmah, jer briše cartItems
    // this.loadCart();

  } catch (error) {
    console.error('❌ Greška prilikom dodavanja u korpu:', error);
  }
},
removeFromCart(item) {
    this.cartItems = this.cartItems.filter(ci => ci.fk_stv_pro_id !== item.fk_stv_pro_id);
      this.cartItems = [...this.cartItems]; // FORCIRA REAKTIVNOST
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    console.log('Iz korpe uklonjen:', item);
  },
    clearCart() {
      this.cartItems = [];
      this.cartCount = 0;
      localStorage.setItem('cart', JSON.stringify([]));
      console.log('Korpa je očišćena');
    },
    goToCheckout() {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
              this.$router.push('/nastkupovine');

      //Imala sam gresku ovog tipa Uncaught (in promise) NavigationDuplicated: Avoided redundant navigation to current location: "/Nastkupovine". jer se naviagacija desava na istoj stranici, tj ja sam bila na stranici Nastkupovine i ovaj deo koda this router poush nakon uspesne kupovine ponovo je pokusavao navigaciju e zato umesto router push mozemo koristiti replace ili jednostavno ako koristimo push promeniti navigaciju (naziv komponenete)
  if (this.$route.path === '/Nastkupovine') {
    alert('Poručili ste proizvod, porudžbina će stići za 3-5 dana!');
  }
},
//Kombinacija await i then: await treba da bude unutar async funkcije, ali kod tebe Swal.fire() koristi .then() koji može da izazove probleme. Treba da koristiš await za Swal.fire().
    async placanjePouzecem() {
  console.log('Placanje pouzećem za proizvod:', this.cartItems);

  // Proveri da li je korpa prazna
  if (!this.cartItems.length) {
    Swal.fire({
      icon: 'warning',
      title: 'Korpa je prazna',
      text: 'Dodajte proizvode u korpu pre nego što nastavite sa porudžbinom.'
    });
    return;
  }

  // Kreiraj osnovnu poruku
  let message = '';

  this.cartItems.forEach(item => {
    const product = this.itemsMap[item.fk_stv_pro_id];
    if (product) {
      message += `• ${product.pro_iupac} — Količina: ${item.stv_kolicina}, Cena: ${(item.uk_stv_cena).toFixed(2)} RSD\n`;
    }
  });

  // Izračunaj ukupnu cenu i cenu dostave
  const total = this.cartItems.reduce((sum, item) => sum + item.uk_stv_cena, 0);
  console.log("Ukupna cena proizvoda:", total);

  // Ako je ukupna cena MANJA od 3000, dostava je 400 RSD, u suprotnom 0
  let shipping = total < 3000 ? 400 : 0;
  console.log("Cena dostave:", shipping);

  let finalPrice = total + shipping;

  // Dodaj ukupnu cenu i cenu dostave u poruku
  message += `\nUkupna cena proizvoda: ${total.toFixed(2)} RSD`;
  message += `\nDostava: ${shipping} RSD`;
  message += `\nZa plaćanje pouzećem: ${finalPrice.toFixed(2)} RSD`;

  // Ako je korisnik na stranici "Nastkupovine", swall fire nije radio jer u putanji je bilon /Nastkupovine umesto /nastkupovine
  if (this.$route.path === '/nastkupovine') {
    try {
      console.log("Prikazujem Swal poruku...");
      // Prikazuj pop-up sa potvrdom
      const result = await Swal.fire({
        title: 'Poručili ste proizvod',
        text: message + '\nPorudžbina će stići za 3-5 dana!',
        icon: 'success',
        confirmButtonText: 'Potvrdi porudžbinu',
      });

      // Ako je korisnik potvrdio porudžbinu
      if (result.isConfirmed) {
       
         // Učitaj email iz localStorage
const userEmail = localStorage.getItem('userEmail');
console.log('Korisnički email:', userEmail);

        // Proveri da li email postoji
        if (!userEmail) {
          Swal.fire({
            icon: 'warning',
            title: 'Greška',
            text: 'Nema sačuvanog email-a korisnika, molimo vas da se prijavite.'
          });
          return;
        }


        // Kreiraj podatke o porudžbini, number dodajemo pretvramo vrednosti u brojeve pre slanja na backend
        const narudzbenicaData = {
         fk_nar_usr_id: Number(localStorage.getItem('usr_id')),
  nar_datum: moment().tz('Europe/Belgrade').format('YYYY-MM-DD HH:mm:ss'),
  nar_cena: Number(total + shipping),
  nac_plat: 'Pouzećem',
  email: localStorage.getItem('userEmail'),//Za backend
   stavke: this.cartItems.map(item => ({
        stv_kolicina: item.quantity,       // ili tvoja kolona sa količinom
        fk_stv_pro_id: item.fk_stv_pro_id, // ID proizvoda
    }))
};

        

        // Pošaljite podatke na backend
        const response = await axios.post('http://localhost:3005/narudzbenice', narudzbenicaData);
        console.log('Uspešno poslana narudžbenica:', response.data);
        
        // Nakon što se uspešno pošalje, možeš dodati logiku za obavestenje korisnika
        // Na primer, možeš ga obavestiti putem Swal da je porudžbina uspešno kreirana
        Swal.fire({
          title: 'Porudžbina potvrđena!',
          text: 'Vaša porudžbina je uspešno poslata i biće isporučena u roku od 3-5 dana.',
          icon: 'success',
          confirmButtonText: 'Zatvori'
        });
      }

    } catch (error) {
      console.error('Greška prilikom slanja narudžbenice:', error);
      Swal.fire({
        title: 'Greška',
        text: 'Došlo je do greške prilikom slanja narudžbenice. Pokušajte ponovo.',
        icon: 'error',
        confirmButtonText: 'Zatvori'
      });
    }
  }
},

    handlePayment(cardDetails) {
          console.log('Plaćanje uspešno:', cardDetails);
          this.closeModal();
        },
        potvrdiPorudzbinu() {
        console.log('Izabrani način plaćanja:', this.selectedPaymentMethod);
    
        if (!this.selectedPaymentMethod) {
          alert('Molimo izaberite način plaćanja.');
          return;
        }
    
        if (this.selectedPaymentMethod === 'cash_on_delivery') {
          alert('Izabrali ste plaćanje pouzećem.\nVaša porudžbina će biti poslata u roku od 3-5 dana.');
          // Ovde možeš dodati logiku za backend POST ka /porudzbina
        } else {
          // Kartica ili PayPal, već si otvorila modal, tu se već obrađuje plaćanje
        }
      },
      //Funkcija getNarudzbenicaId() služi da učita ID narudžbenice iz localStorage, što može biti korisno za praćenje i identifikaciju određene narudžbenice na klijentskoj strani.
    getNarudzbenicaId() {
  const narudzbenicaId = localStorage.getItem('nar_id');
  if (!narudzbenicaId) {
    console.error('ID narudžbenice nije pronađen u localStorage.');
  }
  return narudzbenicaId;
},

  

  } // ← Zatvara methods
}; // ← Zatvara ceo export default objekat

//Zašto se ovo dešava, dakle odnosi na poruku Nije pronadjen proizvod u itemsMap,itemsMap se pravi iz this.items (lista svih proizvoda sa API-ja).Ako this.items još nije stiglo sa API-ja, itemsMap je prazan → prvi ili drugi proizvod iz korpe nema odgovarajući objekat → preskočen jeKada dodaš proizvod koji je poslednji učitan ili trenutno prisutan u items, tada ga resolvedCartItems uspešno mapira → zato vidiš samo poslednji proizvod.Drugim rečima: resolvedCartItems se računa pre nego što items stignu sa servera.//RešenjeZaštita u resolvedCartItems da čeka itemsMap:// Ako this.items još nije stigao sa servera (axios.get('/proizvodi')), itemsMap[1] ne postoji → resolvedCartItems ne može da nađe proizvod → fallback se koristi.//RešenjeMoramo da čekamo da proizvodi budu učitani pre nego što mapiramo cartItems u resolvedCartItems.//Koraci:U loadCart() ili mounted(), nakon što dobijemo proizvode sa API-ja (this.items = ...), tek onda učitaj cartItems i izračunaj resolvedCartItems.Ne pozivati loadCart() unutar dodajUkorpu ako menja cartItems pre nego što this.items stigne – može da pokrene prerano računanje.Optional: dok proizvodi ne stignu, prikaži loader ili praznu korpu, umesto fallback.

  // Debug: uspešno pronađen proizvod


    

  //Aha, ovo objašnjava deo problema. Poruka “unreachable code detected” znači da JavaScript vidi da deo koda posle return nikada neće biti izvršen.//


  //Ti koristiš result, ali nisi ga nigde definisala. U trenutnoj verziji map + filter direktno vraća niz, ali ti pokušavaš da console.log(result) i return result, a result ne postoji.Zato JavaScript prijavljuje grešku (ili unreachable code) jer result je nepoznata promenljiva.//
  

    //Ako je cartCount definisan u data, ne treba ga istovremeno definisati i u computed


     //Tačno! 😄Problem je bio što si u mounted() dvaput učitavala korpu iz localStorage/servera, pa se stari podaci vraćali pre nego što bi clearCart() resetovao Vue state i kružić.Sad je logika jasna i čista:clearCart() resetuje cartItems, cartCount i localStorage – kružić odmah pokazuje 0.loadCart() se koristi samo kad želiš ručno osvežavanje iz localStorage nakon dodavanja/uklanjanja proizvoda.fetchCartItems() više nije potreban u mounted() jer ne želiš automatsko punjenje stare korpe sa servera.
    //Ovde prvo pozivaš clearCart(), što bi trebalo da očisti korpu.Ali odmah zatim pozivaš this.loadCart(), a ta funkcija učitava korpu iz localStorage.Problem: clearCart() i loadCart() se izvršavaju gotovo istovremeno, i pošto loadCart() uzima stare podatke iz localStorage (koji možda još nisu resetovani), kružić i dalje pokazuje 162.Rešenje: treba da resetuješ lokalnu korpu i odmah ažuriraš cartItems i cartCount bez pozivanja loadCart() odmah nakon toga.

     //Inicijalizuješ cartItems iz localStorage odmah, što je OK: Međutim, imaš duplikate i preklapanja:items: [], items: JSON.parse(localStorage.getItem('products')) || [],showCart: false, Ispravno je imati samo jedan items niz i jedan showCart. Inače Vue uzima poslednju definiciju i može biti konfuzno.
  

  //Ako vracas niz podataka onda je potrebno da ga incijalizujes kao niz obicno response.data.data bez ovog drugog data imaces gresku expected this items to be an array, but got...
 
    //Umesto da stalno tražiš proizvod po pro_id, možeš:Napraviti mapu pro_id -> proizvod pri učitavanju items:
//Aha, znači itemsMap je vezan za this.items 👌To objašnjava problem:Ako ti se prvi proizvod u korpi prikazuje kao tačkica → to znači da u trenutku kada renderuješ cartItems, u itemsMap još nema podatka za taj fk_stv_pro_id. Vue onda napravi <li> ali nema šta da prikaže unutra.Za drugi proizvod se verovatno stigne popuniti itemsMap, pa se lepo pokaže.Dakle, uzrok je što se cartItems puni brže nego items (odakle praviš itemsMap).Dodaj zaštitu u v-forVeć si stavila v-if="itemsMap[item.fk_stv_pro_id]", ali ipak renderuje prazno <li>. Možeš umesto toga da potpuno preskočiš <li> dok se ne popuni mapa :

  //Problem: unutar same computed property pozivaš this.itemsMap → Vue računa itemsMap da bi dobio vrednost, što opet poziva itemsMap, i tako beskonačno → too much recursion.//Nikada u computed property ne pozivati samu sebe.Ako želiš da loguješ rezultat, loguj privremenu promenljivu, ne this.itemsMap://
  

//Ako istovremeno imaš computed itemsMap() { ... }, Vue će biti zbunjen – computed property i data property ne mogu imati isti naziv. To može izazvati too much recursion ili undefined jer computed property stalno prepisuje this.itemsMap.
  //Tvoj resolvedCartItems vraća samo proizvod sa fk_stv_pro_id: 215, iako u cartItems imaš i proizvod sa fk_stv_pro_id: 1.Razlog: tvoja itemsMap ne sadrži proizvod sa pro_id = 1 u trenutku kada se resolvedCartItems računa.U console logu vidimo da cartItems sadrži oba proizvoda: 1 i 215. ✅Ali resolvedCartItems vraća samo 215 jer je this.itemsMap[1] undefined. ❌To znači da proizvod sa pro_id = 1 nije učitan u this.items kada Vue računa resolvedCartItems. Uveri se da svi proizvodi iz baze su učitani u this.items pre nego što korisnik može da doda proizvod u korpu.Ako korisnik doda proizvod pre nego što this.items stigne iz API-ja, onda itemsMap ne može da ga pronađe.Možeš dodati log unutar resolvedCartItems da vidiš koje ID-jeve itemsMap sadrži:ZaključakProblem nije u logici resolvedCartItems nego u redosledu podataka:cartItems ima stavke koje još nisu u this.items,zato itemsMap[ci.fk_stv_pro_id] vraća undefined.
  // Samo stavke koje imaju pronađen proizvod + ubacujemo product direktno u stavku

  // Pitala sam da li ce cartitems zavisiti od cart count, tj da li ce se dodati proizvodi u korpu prenositi sa roditeljske komponente ProizTi si već spomenuo da na „nastavak kupovine“ prenosiš podatke preko localStorage i JSON.stringify/parse (znam jer si imao localStorage.setItem('cart', JSON.stringify(this.cartItems)) u kodu).To znači da tvoji podaci o proizvodima nisu vezani za cartCount direktno, nego za cartItems (niz objekata). Dakle, roditeljska komponenta će se normalno prenositi, jer se prenosi cartItems, a cartCount je samo „prikaz“ broja iz cartItems.Praktično:Kada koristiš computed cartCount, on se računa uvek iz cartItems (koji već snimaš u localStorage).Na nastavku kupovine ti radiš JSON.parse(localStorage.getItem('cart')) i opet dobijaš cartItems.Pošto cartCount zavisi od cartItems, odmah će se ispravno prikazati.
      
      //Aha, ovo je ključno — znači fk_stv_pro_id u cartItems tačno pokazuje ID proizvoda, ali i dalje "Nepoznata hemikalija" iskače. 😅To znači da problem nije u ID-ju samom, nego u trenutku kada se poziva getProductIUPAC. Konkretno:this.items još nije popunjeno (loadProducts() se tek izvršava asinhrono).Funkcija getProductIUPAC se poziva pre nego što this.items ima sve proizvode, pa find vraća undefined.To objašnjava zašto prvi proizvod radi, a drugi ne — ako prvi je već renderovan nakon učitavanja items, a drugi je dodat pre nego što je items kompletno učitan. Rešenje:Uveri se da je items uvek popunjeno pre renderovanja pop-up-a ili poziva getProductIUPACMožeš npr. koristiti v-if="items.length" oko komponenti koje prikazuju naziv proizvoda, ili await this.loadProducts() u mounted() pre nego što korisnik može dodavati proizvode.Takođe, da izbegneš probleme sa tipovima:
    //Trece prepoznaj naziv proizvoda, da ne bi vracao nepoznata hemiklaija, treba preoslediti pravi kljuc, konretno ovde treba fk stv pro id a ne pro id 
    
    //u getProductIUPAC ne bi trebalo da praviš novi objekat za sliku, niti da računaš bilo šta osim naziva proizvoda. zato se pravi pomocna funkcija getProduct koja ce obuhvatiti ceo objekat proizvodi da ne bi pisalo Nepoznata hemikalija


    //Evo zasto izbacuje Nepoznata hemikalija kad se dodaju drugi proizvodi pored jednog  ha, znači pro_id koji dolazi iz cartItems ne postoji u items u trenutku poziva funkcije. To se obično dešava iz jednog od ova tri razloga:items još nije učitan loadProducts() je asinhrona funkcija. Ako korisnik doda drugi proizvod pre nego što su svi proizvodi učitani, this.items.find(...) neće pronaći proizvod.Rešenje: čekaj da loadProducts() završi pre nego što korisnik može da doda proizvod, npr. pomoću await this.loadProducts() u mounted() ili async mounted().pro_id i tipovi se ne poklapaju. U cartItems možda imaš "2" (string), a u items 2 (number).Rešenje: koristi == umesto === u find:
    // konvertujemo na string ili broj radi sigurnog poređenja

    //Za definisanje dugmeyta Prikazi korpu, obe f-je i toogleCart i Load Cart treba pokrenuti, Problem: ako loadProducts() traje asinhrono, a getProductIUPAC() se poziva pre nego što se items napuni, vratiće Nepoznata hemikalija.Rešenje: ili koristi await this.loadProducts() u mounted() (ako je mounted async), ili vodi računa da getProductIUPAC() uvek proverava da li je niz prazan.Takođe, inicijalno postavljaš cartCount iz localStorage:


    //Cetvrto, aktiviraj funkciju dodajU korpu, let cart = JSON.parse(localStorage.getItem('cart')) || [];this.cartItems = cart;this.loadCart();ta se dešava, Ti svaku promenju korpe prvo učitavaš iz localStorage.Ako this.loadCart() ponovo prepisuje cartItems iz baze ili sa servera, onda svaki put kada dodaš novi proizvod, stari se briše.Zbog toga u popupu vidiš samo poslednji dodat proizvod.Kako popraviti. Ne prepisuj this.cartItems iz loadCart odmah nakon dodavanja.Napravi this.cartItems da bude izvor istine i ažuriraj localStorage samo da sinhronizuješ stanje.


     //U metodi createOrder, pozivaš localStorage.getItem('cart'), ali u goToCheckout() si prethodno sačuvala cartItems u localStorage, a ne cart, Ujednači ime ključa koji koristiš u localStorage, Opcija 1 – koristi cart svuda:
    //this.products verovatno puniš asinhrono, npr. preko axios.get u nekoj drugoj metodi kao loadProducts() ili u mounted().Kada klikneš na prikaz korpe i pozivaš loadCart(), this.products još nije sigurno dostupna (još traje učitavanje sa servera).Zato je važno da ili:sačekaš da se proizvodi učitaju pre nego što pozoveš loadCart()ili da osiguraš da this.products uvek ima inicijalnu vrednost (npr. prazan niz) i da se metoda getProductIUPAC prema tome ponaša.
   
    
    
    //created nije metoda u methods, već treba da stoji kao lifecycle hook van methods u objektu komponente.
 
  //Vidim u čemu je problem – tvoja metoda createOrder() je van methods bloka, a mora biti unutar njega da bi Vue znao da je to metoda komponente, zato kad sam pozivala poruci proizvod izbacivao je korpa je prazna!

  //Aha, sad mi je jasno zašto ti se i dalje pojavljuje 162 u kružiću ✅Problem je redosled i način na koji učitavaš i čuvaš korpu.Na početku funkcije nemaš definisan cart pre nego što radiš localStorage.setItem('cart', JSON.stringify(cart)), pa se dešava da Vue pokupi staru vrednost (162 iz prethodnog localStorage-a).📌 Evo kako treba da ide redosled u tvojoj funkciji dodajUkorpu (skraćeno i popravljeno):
 //U tvom kodu dodajUkorpu lepo ažuriraš localStorage i tamo snimaš ceo niz stavki (cart). Međutim, nigde ne ažuriraš direktno cartCount na frontendu, pa ti on ostaje "statičan" (trenutno prikazuje sve proizvode iz baze — 162).Rešenje je da brojač uvek računa vrednost iz cart (tj. iz localStorage ili iz this.cartItems).

//KOd iznad je optimizovan Uklonio sam deo gde si uklanjao duplikate pomoću .filter(). Sad ako proizvod postoji, samo ažuriraš količinu.Logika je jasnija i linearnija.I dalje radiš POST na backend i čuvaš stv_id iz odgovora.I dalje osvežavaš proizvode i prikazuješ popup.Dodao sam eksplicitni return posle greške za nedostatak zaliha da se funkcija odmah prekine
// //Zasto se localStorage vracao kao prazan niz Pregled glavnih tačaka:U localStorage koristiš ključ "cart", a u PaymentForm si učitavao "cartItems" — to nije isto!Trebalo bi da koristiš isti ključ na obe strane, npr. cartItems, da se ne bi gubili podaci. U localStorage.setItem koristiš ključ "cart", a u PaymentForm localStorage.getItem('cartItems').To će uvek dati prazan niz jer tražiš na pogrešnom mestu.U tvom kodu treba da se uskladi ključ za lokalno čuvanje korpe:ili promeni sve da koriste "cart", ili sve da koriste "cartItems".