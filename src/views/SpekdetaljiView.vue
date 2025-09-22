<template>
    <div>
      <!-- Komponenta Specifikacije prikazana ovde -->
      <Spekdetalji > </Spekdetalji>
  
  
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
  
        <h2>Platne kartice</h2>
        <div class="platne-kartice">
          <img alt="visa" src="../assets/visa.png">
          <img alt="master" src="..//master.png">
          <br>
          <input type="password" placeholder="Broj platne kartice" class="input-plati">
          <div class="info-kartica">
            <input type="text" placeholder="mm" class="input-plati">
            <input type="text" placeholder="yyyy" class="input-plati">
            <input type="text" placeholder="cvv" class="input-plati">
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Spekdetalji from '@/components/Spekdetalji.vue'
  
  export default {
    name: 'SpekdetaljiView',
    components: {
      Spekdetalji
    }
}
  </script>
  
  <style scoped>
  /* Stilovi po potrebi */
  </style>