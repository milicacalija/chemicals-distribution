<template>
  <div >
      <!---Unutar template se sadrzi komponenta za prikaz kompanija, a posto kompanija ne postoji onda cemo napraviti kompaniju u folderu components-->
      <Home> </Home>
       
  

  </div>
  
  
  </template>
  <script>
  
  import Home from '@/components/Home.vue'
  /*Da bi mogli da prikazemo komponentu komanija iz stranice Kompanija.vue moramo da je importujemo*/
  
  export default{
      name: 'HomeView',
      
      /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
      components: {
           Home
        }
        /*Idemo do rute do file.index.js i pravimo novu rutu*/
    }
      
   
     
  
  </script>
  <style>
  </style>