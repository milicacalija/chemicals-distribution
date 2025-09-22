<template>
    <div >
        <!---Unutar template se sadrzi komponenta za prikaz kompanija, a posto kompanija ne postoji onda cemo napraviti kompaniju u folderu components-->
        <Nalog> </Nalog>
       

        
       
    


    <!--Kako preko frontenda dodati novu kompaniju!, za to cemo napraviti inputeS-->


    

    <div >
        

    



</div>
    

</div>

    </template>
    <script>
    /*Da bi mogli da prikazemo komponentu komanija iz stranice Kompanija.vue moramo da je importujemo*/
    import Nalog from '@/components/Nalog.vue';
    export default{
        name: 'NalogView',
        /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
        components: {
            Nalog
        }
        /*Idemo do rute do file.index.js i pravimo novu rutu*/
    }
    </script>
    <style scoped>
   
    </style>