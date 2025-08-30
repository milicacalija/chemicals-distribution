<template>
  <div class="cart-popup">
    <h2>Stavke u korpi</h2>
    <ul>
      <div class="button-container">
      <button class="add-korpa" @click=" clearCart()">Očisti korpu</button>
     
    </div>
      <li v-for="(item, index) in resolvedCartItems" :key="(item.stv_id || item.fk_stv_pro_id) + '-' + index" class="cart-item">
        <img :src="getImageUrl(item.product)" :alt="item.product.pro_iupac" class="cart-item-image" />
        <div class="cart-item-info">
          {{ item.product.pro_iupac }} - Količina: {{ item.stv_kolicina }} - Cena: {{ item.uk_stv_cena.toFixed(2) }}
        </div>
         <!-- Dugmad za akcije, znači da Korpa šalje event $emit('remove-item', item), ali roditelj (npr. Proizvodi.vue ili Nastkupovine.vue) nema definisanu metodu removeFromCart. to je greska invalid handler for event remove-item got undefined -- umesto dolar emit samo pozovimo dugme removeFrom Cart-->
        
    <button class="add-korpa" @click="removeFromCart(item)">Ukloni</button>
              </li>
    </ul>
    
  </div>
</template>
<script>
//Ah, super pitanje! 😊 Hajde da razjasnimo:cartMixin.js je logika i stanje koje je zajedničko više komponenti:cartItemsitemsMapmetode: removeFromCart, clearCart, goToCheckout, placanjePouzecemcomputed: resolvedCartItems, Korpa.vue, s druge strane, je vizuelna komponenta (UI):Ona prikazuje listu proizvoda u korpi (v-for="item in resolvedCartItems")Prikazuje dugmad za akcije (Ukloni, Očisti korpu, Naruči proizvod, Emituje događaje ka roditeljskoj komponenti ($emit('remove-item', item))

//Ah, sada je jasnije zašto ti ne vidiš listu iz Korpe u Nastkupovine.vue. 😊Problem je što Korpa.vue prikazuje resolvedCartItems iz props, ali u Nastkupovine.vue ti ne prosleđuješ itemsMap ili cartItems koji su pravilno popunjeni kao što to radiš u Proizvodi.vue.U Proizvodi.vue popup radi jer:cartItems i itemsMap su uvođeni iz roditeljskog stanja (data + localStorage).resolvedCartItems je computed property koja filtrira samo validne proizvode koji postoje u itemsMap.v-for u Korpa.vue iterira preko već pripremljenog niza.


import cartMixin from '@/mixins/cartMixin.js';
export default {
  //Problem nije u methods, već što si stavila zarez nakon mixins: [cartMixin],, a Vue misli da očekuje computed objekat, pa baca grešku “Getter is missing for computed property”.
    mixins: [cartMixin],
    name: 'Korpa',
  props: {

  
},
   
  methods: {
    getImageUrl(product) {
      const naziv = product.pro_iupac.toLowerCase();
      const tryImagePaths = [naziv, naziv.replace(/ /g, ''), naziv.replace(/ /g, '_')];
      for (const name of tryImagePaths) {
        try {
          return require(`@/assets/${name}.jpg`);
        } catch (e) {}
      }
      return require('@/assets/korpica circle.png');
    }
  }
};
</script>

<style scoped>
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
.cart-container {
  max-width: 50px;
  margin: 0 auto;
padding: 20px;
}

.empty-cart {
  text-align: center;
  padding: 50px 0;
  font-size: 18px;
  color: #555;
}

.cart-item {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 500px;           /* širina pop-up-a */
  max-height: 400px;      /* maksimalna visina pop-up-a */
    background-color: #f9f9f9;

     /* Centriranje na sredinu ekrana */
 
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border-radius: 10px;
 
    
}

.cart-item img {
  width: 100px;       /* malo manja slika da ostane pregledno */
  height: 200px;
  object-fit: contain;
  margin-right: 10px;
}
.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-info h3 {
  margin-bottom: 5px;
}

.total-amount {
  margin-top: 20px;
  text-align: right;
}

.total-amount strong {
  font-size: 18px;
  color: #333;
}

</style>