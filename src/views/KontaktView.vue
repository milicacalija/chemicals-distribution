<template>
  <div >
      <!---Unutar template se sadrzi komponenta za prikaz kompanija, a posto kompanija ne postoji onda cemo napraviti kompaniju u folderu components-->
      <Kontakt> </Kontakt>
       
  

  </div>
  
  
  </template>
  <script>
  
  import Kontakt from '@/components/Kontakt.vue'
  /*Da bi mogli da prikazemo komponentu komanija iz stranice Kompanija.vue moramo da je importujemo*/
  
  export default{
      name: 'KontaktView',
      
      /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
      components: {
           Kontakt
        }
        /*Idemo do rute do file.index.js i pravimo novu rutu*/
    }
      
   
     
  
  </script>
