<template>
    <div>
      <h1>Piktogrami</h1>
      <div v-if="piktogrami.length">
        <div v-for="piktogram in piktogrami" :key="piktogram.pkt_id" class="piktogram">
          
          <p>{{ piktogram.pkt_naziv }}</p>
        </div>
      </div>
      <div v-else>
        <p>Nema piktograma za prikaz.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        piktogrami: []
      };
    },
    mounted() {
      axios.get('http://localhost:3011/piktogrami')
        .then(response => {
          this.piktogrami = response.data.data;
        })
        .catch(error => {
          console.error('Error fetching piktogrami:', error);
        });
    }
  };
  </script>
  
  <style>
  .piktogram {
    margin: 10px;
  }
  .piktogram img {
    max-width: 100px;
    height: auto;
  }
  </style>