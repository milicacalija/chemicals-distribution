<template>
    <div>
        <Proizvodi> </Proizvodi>
     

    </div>
  
  </template>
  <script>
  /*Da bi mogli da prikazemo komponentu kompanija iz stranice Kompanija.vue moramo da je importujemo*/
  import Proizvodi from '@/components/Proizvodi.vue'
  export default{
      name: 'ProizvodiView',
      /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
      components: {
          Proizvodi
      }
      /*Idemo do rute do file.index.js i pravimo novu rutu*/
  }
//Ispod su komentari komponente Proizvodi.vue, gde imamo problem sa items map tj ucitavanjem stavki 
  ////Umesto da stalno tražiš proizvod po pro_id, možeš:Napraviti mapu pro_id -> proizvod pri učitavanju items:
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
  </script>
  