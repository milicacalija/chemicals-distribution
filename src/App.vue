<template>
  <div id="app">
    <nav>
      
    </nav>
    <!-- :="cartItems"

je nevažeći Vue sintaksno — nedostaje ime atributa (npr. v-bind:cart-items, :cart-items, ili slično).-->
<router-view :cart-items="cartItems" @update-cart-items="updateCartItems"></router-view>  </div>
</template>

<script>

import PaymentForm from './components/PaymentForm.vue'
export default {
  name: 'App',

  //Da li PaymentForm.vue uopšte koristiš u App.vue?Ako ne koristiš ga u router/index.js, onda ova komponenta nije nikada aktivnaIli ti nedostaje nešto poput:
  components: {
    PaymentForm,
      },
  data() {
    return {
      cartItems: []
    
    };
  },
  methods: {
    updateCartItems(newCartItems) {
      this.cartItems = newCartItems;
    }
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: #f4f1ff;
}

nav {
  padding: 30px;
  color: #000;
}
.table-container {
  margin: 0 auto;
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  margin: 0 auto;
}

th, td {
  border: 1px solid #330e0e;
  padding: 8px;
  text-align: center;
  word-wrap: break-word;
  height: 30px;
}

th {
  background-color: #641515;
  color: white;
  font-weight: bold;
}

td {
  background-color: #ffffff;
  color: #000;
  text-align: left;
}

tbody tr:hover {
  background-color: #ccc0c0;
}
</style>