<template>
    <div>
        {{ prikaz }}
        <button @click="$event =>pretvoriBoju()">Pretvori</button>

    </div>
</template>
<script>
import bojaBoje from '../boje/boja.js'
export default {
    name:'BojaView',
    data: function(){
        return{
            prikaz:""

        }

    },
    methods:{
        pretvoriBoju(){
            let boja = new bojaBoje.Boja(200,100,50)
            /*Poslacemo kao argument 100*/
            this.prikaz = boja.vratiBoju();
            /*Onda se vratimo na funkciju za promeniBoju da popunimo*/
        }
    }
}
</script>