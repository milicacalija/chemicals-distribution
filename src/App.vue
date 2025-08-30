<template>
  <div id="app">
    <nav>
      <router-link to="/">Chemical</router-link>
      
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
    PaymentForm
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

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f0f0f0;
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #f4f1ff;
}
nav {
  padding: 30px;
  color: #000000;
}
nav a {
  font-weight: bold;
  color: #000000;
}
nav a.router-link-exact-active {
  color: #000000;
}
</style>