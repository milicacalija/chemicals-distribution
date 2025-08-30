<template>
    <div>
      <h1>Profesori i Slobodne Aktivnosti</h1>
      <table>
        <thead>
          <tr>
            <th>Profesor ID</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Slobodna Aktivnost ID</th>
            <th>Slobodna Aktivnost Naziv</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.profesor_id">
            <td>{{ item.pro_id }}</td>
            <td>{{ item.pro_ime }}</td>
           
            <td>{{ item.slob_id }}</td>
            <td>{{ item.slob_naziv }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        data: []
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get('http://localhost:3021/profesori');
          this.data = response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Dodajte stilizaciju prema potrebi */
  </style>