<template>
  
    <div>
      
<h1>Dobrodošli na stranicu o kompanijama</h1>
<input id="pretraga" type="number">
        <button type="submit" class="button-input"> Pretraži</button>
        <hr>


        

    <table border="2">
    
      <thead>
       
        <tr>
          <th>ID</th>
          <th>PIB</th>
          <th>Adresa</th>
          <th>Telefon</th>
          <th>Email</th>
          <th>Osoba</th>
          <!-- Dodajte kolone prema potrebi -->
        </tr>
      </thead>
      <tbody>
        
        <tr v-for="komp in kompp" :key="komp.kmp_id">
         
          <td>{{ komp.kmp_id }}</td>
          
         
          <td>{{ komp.kmp_pib }}</td>
          <td>{{ komp.kmp_adresa }}</td>
          <td>{{ komp.kmp_telefon }}</td>
          <td>{{ komp.kmp_email }}</td>
          <td>{{ komp.kmp_osoba }}</td>
         
          <!-- Dodajte kolone prema potrebi -->
        </tr>
      </tbody>
    </table>
  </div>
</template>


      
     
      <!--v-show, when assigned with false, applies display: none inline style and hides the element visually and makes almost no modifications to the DOM!!
      Unfortunately, you cannot use v-show directive because it applies only display: none style.
    But a viable solution is to use :class binding, which is pretty flexible in Vue. When the object literal { className: boolValue } is assigned to the :class, Vue applies the "className" as a class to the element if boolValue is true.-->

    


    

    

<!--Dugo nisam uspela prikazati rezultat na display, razlog je tome sto nisam u v-show direktivi oznacila  rezultat ako je razlicit od null bude true,rezultat !== null, posto sam ovo oznacila imam poruku na display -->




<script>

import axios from 'axios';
// Importujte router ako koristite Vue Router, U ovom primeru, router.push će preusmeriti korisnika na rutu "/nova-stranica" nakon 3 sekunde. 

export default {
  data() {
    return {
      kompp: [] // Inicijalno prazan niz koji će sadržati podatke iz baze
    };
  },
  mounted() {
    this.getKompp(); // Pozivamo funkciju za dobijanje podataka kada se komponenta montira
  },
  methods: {
    getKompp() {
      // Šaljemo GET zahtev na server da dobijemo podatke iz baze
      axios.get('http://localhost:3004/kompanije')
        .then(response => {
          this.kompp = response.data.data; // Postavljamo podatke iz odgovora u users niz
        })
        .catch(error => {
          console.error('Greška prilikom dobijanja podataka:', error);
        });
    }
  }
};

</script>
<style scoped >



body {
    font-family: Arial, Helvetica, sans-serif;
     
    
  
  background-color: #f0f0f0; 
 
    
    }
    
    
        
        /*Absolute pozicija da bi bio tekst naspram slike a ne da se odvoji negde u centru, tako bi bilo da je pozicija relative*/
        
       
      
        
        

    
    

    .kontakt-forma{
    display: grid;
    justify-content: center;
    font-weight: bold;
    
    
}
.input{
    
    width: 300px;
    height: 50px;
    border: 1.5px solid rgb(100, 21, 21);
    border-radius: 5px;
   
    
   
    
    
}
    /* Umesto display flex ako zelim da budu kontenti jedan ispod drugog, a da se vide sa leve i desne strane display grid je resenje*/
    
.button-input{
    background-color: #030344;
color: #fff;
font-weight: bold;
font-size: 15px;
margin:0 auto;
border-radius: 20px;

width: 300px;
height: 50px;
  top: 100%;
  
    }
    </style>
