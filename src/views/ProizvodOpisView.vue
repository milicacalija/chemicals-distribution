<template>
  <div>
    <ProizvodOpis :proizvodId="proizvodId" />
  </div>
</template>

<script>
import ProizvodOpis from '@/components/ProizvodOpis.vue';

export default {
  name: 'ProizvodOpisView',
  components: { ProizvodOpis },
  props: ['proizvodId'] ,
  mounted() {
  console.log('Proizvod ID:', this.proizvodId);
}  // ovo dolazi direktno iz rute
  

};
</script>
