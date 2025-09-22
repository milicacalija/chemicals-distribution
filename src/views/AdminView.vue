<template>
  <div >
      <!---Unutar template se sadrzi komponenta za prikaz kompanija, a posto kompanija ne postoji onda cemo napraviti kompaniju u folderu components-->
      <Admin> </Admin>
       
  

  </div>
  
  
  </template>
  <script>
  
  import Admin from '@/components/Admin.vue'
  /*Da bi mogli da prikazemo komponentu komanija iz stranice Kompanija.vue moramo da je importujemo*/
  
  export default{
      name: 'AdminView',
      
      /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
      components: {
           Admin
        }
        /*Idemo do rute do file.index.js i pravimo novu rutu*/
    }
      
   
     
  
  </script>