<template>
    <div >
        <!---Unutar template se sadrzi komponenta za prikaz kompanija, a posto kompanija ne postoji onda cemo napraviti kompaniju u folderu components-->
        <Primena> </Primena>
       

        
       
    


    <!--Kako preko frontenda dodati novu kompaniju!, za to cemo napraviti inputeS-->


    

    <div >
        <br>

    



</div>
    

</div>

    </template>
    <script>
    /*Da bi mogli da prikazemo komponentu komanija iz stranice Kompanija.vue moramo da je importujemo*/
    import Primena from '@/components/Primena.vue'
    export default{
        name: 'PrimenaView',
        /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
        components: {
            Primena
        }
        /*Idemo do rute do file.index.js i pravimo novu rutu*/
    }
    </script>
    <style scoped>
   
    </style>