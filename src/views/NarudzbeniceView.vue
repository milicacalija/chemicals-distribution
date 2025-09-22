<template>
    <div >
        <!---Unutar template se sadrzi komponenta za prikaz kompanija, a posto kompanija ne postoji onda cemo napraviti kompaniju u folderu components-->
        <Narudzbenice> </Narudzbenice>
    
    
    
         
    
        
         
    
    
          
    
        
    
    
    
      
       
    <hr>
    <div>
       
        
    </div>
    
    </div>
    
    
    
    </template>
    <script>
    
    
import Narudzbenice from '@/components/Narudzbenice.vue';
    /*Da bi mogli da prikazemo komponentu komanija iz stranice Kompanija.vue moramo da je importujemo*/
    
    export default{
        name: 'NarudzbeniceView',
        
        /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
        components: {
              Narudzbenice
          }
          /*Idemo do rute do file.index.js i pravimo novu rutu*/
      }
        
     
       
    
    </script>
    <style>
    </style>