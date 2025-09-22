<template>
  <div class="product-wrapper">
    <!-- Slika proizvoda -->
    <div class="selected-proizvod" v-if="proizvod">
      <img 
        :src="`/images/${encodeURIComponent(proizvod.pro_iupac)}.jpg`" 
        :alt="proizvod.pro_iupac" 
        class="proizvod-slika"
      />
    </div>

    <!-- Tabela sa podacima, colsapn definisi ako imas kolone pa hoces da budu obuhvacene -->
    <div class="table-container">
      <div v-if="loading">
        <p>Učitavanje proizvoda...</p>
      </div>

      <table v-else-if="proizvod">
        <thead>
      <tr>
        
      <th> Opis proizvoda</th>  
        </tr>
    </thead>
        <tbody>
          <tr>
        <td>
          <p><strong>Naziv hemikalije po IUPAC:</strong> {{ proizvod.pro_iupac }}</p>
          <p><strong>Cena:</strong> {{ proizvod.pro_cena }} RSD </p>
          <p><strong>Količina:</strong> {{ proizvod.pro_kolicina }}</p>
          
      
        </td>
      </tr>
        </tbody>
      </table>

      <div v-else>
        <p>Proizvod nije pronađen.</p>
      </div>

      <!-- Dugme Dodaj u korpu -->
      <div class="button-container" v-if="proizvod">
<router-link
  :to="{ name: 'proizvodi' }"
  class="more-link"
>
  Pogledaj detalje / Poruči proizvod →
</router-link>
  </div>
    </div>
  </div>
</template>

<script>
import { productMixin } from '@/mixins/useProducts';

export default {
  name: 'ProizvodOpis',
  mixins: [productMixin],
  props: { proizvodId: [String, Number] },
  data() {
    return { loading: true };
  },
  computed: {
    proizvod() {
      if (!this.itemsMap || Object.keys(this.itemsMap).length === 0) return null;
      return this.itemsMap[String(this.proizvodId)] || null;
    }
  },
  async mounted() {
    await this.loadProducts();
    this.loading = false;
  },
  methods: {
    dodajUkorpu(proizvod) {
      console.log("Dodajem u korpu:", proizvod);
      // logika za cartItems iz mixina
    }
  }
};
</script>
