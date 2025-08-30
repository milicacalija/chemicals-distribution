<template>
<Korpa> </Korpa>


</template>

<script>
/*Da bi mogli da prikazemo komponentu kompanija iz stranice Kompanija.vue moramo da je importujemo*/
import Korpa from '@/components/Korpa.vue'
export default{
    name: 'KorpaView',
    /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
    components: {
        Korpa
    }
    /*Idemo do rute do file.index.js i pravimo novu rutu*/
}
</script>
