<template>
    <div>
        <Nastkupovine> </Nastkupovine>
     

    </div>
  
  </template>
  <script>
  /*Da bi mogli da prikazemo komponentu kompanija iz stranice Kompanija.vue moramo da je importujemo*/
  import Nastkupovine from '@/components/Nastkupovine.vue'
  export default{
      name: 'NastkupovineView',
      /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
      components: {
          Nastkupovine
      }
      /*Idemo do rute do file.index.js i pravimo novu rutu*/
  }
  </script>