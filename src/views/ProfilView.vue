<template>
    <div>
        <Profil> </Profil>
     

    </div>
  
  </template>
  <script>
  /*Da bi mogli da prikazemo komponentu kompanija iz stranice Kompanija.vue moramo da je importujemo*/
  import Profil from '@/components/Profil.vue'
  export default{
      name: 'ProfilView',
      /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
      components: {
          Profil
      }
      /*Idemo do rute do file.index.js i pravimo novu rutu*/
  }
  </script>