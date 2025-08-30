<template>
    <div>
      <!-- Komponenta Specifikacije prikazana ovde -->
      <Specifikacije > </Specifikacije >
  
  
      <!-- Header za specifikacije -->
      <div class="specifikacije-header"></div>
  
      <!-- Input za pretragu -->
      
  
      <!-- Forma za dodavanje nove kompanije -->
      <hr>
      
  
      <!-- Sekcija za plaćanje -->
      <div class="placanje" style="display: none;">
        <h1 class="info-korisnik">Informacije o korisniku</h1>
        <input type="text" placeholder="Ime i prezime" class="input-plati">
        <input type="text" placeholder="Naziv kompanije" class="input-plati">
        <input type="text" placeholder="Adresa kompanije" class="input-plati">
        <input type="text" placeholder="E-mail" class="input-plati">
        <input type="text" placeholder="Telefon" class="input-plati">
  
        
      </div>
    </div>
  </template>
  
  <script>
  import Specifikacije from '@/components/Specifikacije.vue'
  
  export default {
    name: 'SpecifikacijeView',
    components: {
      Specifikacije
    }
}
  </script>
  
  <style scoped>
  /* Stilovi po potrebi */
  </style>