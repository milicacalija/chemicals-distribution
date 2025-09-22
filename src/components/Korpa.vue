<template>
  <div class="cart-popup">
    <h2>Stavke u korpi, koja je</h2>

    <ul v-if="resolvedCartItems.length > 0">
      <li
        v-for="(item, index) in resolvedCartItems"
        :key="(item.stv_id || item.fk_stv_pro_id) + '-' + index"
        class="cart-item"
      >
       <img 
  :src="getImageUrl(item)" 
  :alt="item.product?.pro_iupac || 'Proizvod'" 
  class="cart-item-image"
  @error="handleImageError($event, item.product?.pro_iupac)" 
/>
        <div class="cart-item-info">
          {{ item.product?.pro_iupac }} - 
          Količina: {{ item.stv_kolicina }} - 
          Cena: {{ item.uk_stv_cena.toFixed(2) }} RSD
        </div>
        <div class="cart-item-actions">
          <button @click="smanjiKolicinu(item.fk_stv_pro_id)">-</button>
          <button @click="dodajKolicinu(item.fk_stv_pro_id)">+</button>
          <button @click="removeFromCart(item)">Ukloni</button>
        </div>
      </li>
    </ul>

    <div v-else class="empty-cart">
      <p>Vaša korpa je prazna</p>
    </div>

    <div class="cart-total" v-if="resolvedCartItems.length > 0">
      <strong>Ukupna cena: {{ calculateTotalPrice() }} RSD</strong>
      <button class="add-korpa" @click="$emit('go-to-checkout')">Nastavak kupovine</button>
      <button class="add-korpa" @click="clearCart">Očisti korpu</button>
    </div>
  </div>
</template>

<script>
import cartMixin from '@/mixins/cartMixin.js';
import { getImageUrl } from '@/components/korpaimg.js';

export default {
  name: 'Korpa',
  mixins: [cartMixin],
  mounted() {
  console.log('🛒 resolvedCartItems u Korpa.vue:', this.resolvedCartItems);
},
  //Methods se moze definisati nakon mixins ako ne mislimo da ubacujemo props, computed itd pre methods bloka
   methods: {
    getImageUrl(item) {
    console.log('📦 Stavka iz resolvedCartItems:', item);
    const url = getImageUrl(item);
    console.log('🖼️ Generisana putanja slike:', url);
    return url;
  },
  handleImageError(event, pro_iupac) {
    if (event && event.target) {
      event.target.src = '/images/korpica-circle.png'; // fallback slika
      console.warn(`⚠️ Slika nije pronađena za: ${pro_iupac}`);
    }
  }
  }
};

</script>

<style scoped>
.cart-popup {
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  padding: 15px;
  width: 350px;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-actions button {
  margin-left: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.empty-cart {
  text-align: center;
  color: #555;
  font-style: italic;
}

.add-korpa {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #4e2fa5;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-korpa:hover {
  background-color: #2a1564;
}
</style>
