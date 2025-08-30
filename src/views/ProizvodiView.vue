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
  </script>
  