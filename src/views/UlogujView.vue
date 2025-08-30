<template>
    <div >
        <!---Unutar template se sadrzi komponenta za prikaz kompanija, a posto kompanija ne postoji onda cemo napraviti kompaniju u folderu components, ukljucivanje components u Axios zahtev-->
        <Uloguj/> 
        
      

        
<!--U pocetku nije hteo da mi prikaze rezultat, dugme je kliknuto, zbog CSS position relative, to sam morala da uklonim -->

</div>


    
    
    </template>
    <script>
   

  

    /*Da bi mogli da prikazemo komponentu komanija iz stranice Kompanija.vue moramo da je importujemo, ali to je takodje vezano za komunikaciju sa Axios zahtevom*/
    import Uloguj from '@/components/Uloguj.vue'
    export default{
        name: 'UlogujView',
        /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
        components: { 
            Uloguj
            

        },
        

        /*Idemo do rute do file.index.js i pravimo novu rutu*/

        

 
      
    }
  

    </script>
    

