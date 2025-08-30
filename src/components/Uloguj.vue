// Uloguj.vue
<template>


  <div>
    <div class="kontakt-forma">

      
      <form @submit.prevent="tryLogin">
        <label for="email">E-mail</label>
        <input class="input" style="display: block;" type="text" name="email" v-model="email" autocomplete="email">

        <label for="password">Password</label>
        <input class="input" style="display: block;" type="password" name="password" v-model="password" autocomplete="password">
        

        <button type="submit" class="button-input">Uloguj se</button>
      </form>
      <!--v-show, when assigned with false, applies display: none inline style and hides the element visually and makes almost no modifications to the DOM!!
      Unfortunately, you cannot use v-show directive because it applies only display: none style.
    But a viable solution is to use :class binding, which is pretty flexible in Vue. When the object literal { className: boolValue } is assigned to the :class, Vue applies the "className" as a class to the element if boolValue is true.-->

    


    

    

<!--Dugo nisam uspela prikazati rezultat na display, razlog je tome sto nisam u v-show direktivi oznacila  rezultat ako je razlicit od null bude true,rezultat !== null, posto sam ovo oznacila imam poruku na display -->

<p v-if="rezultat !== null && rezultat !== 'Niste se ulogovali' && rezultat !== 'Pogrešan email ili lozinka'">
   {{ rezultat }}
</p>

<p v-if="rezultat === 'Pogrešan email ili lozinka'">
  {{ rezultat }}
</p>



      </div>
    </div>

</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      email: "",
      password: "",
      rezultat: null,
    };
  },
  methods: {
    async tryLogin() {
  console.log('Metoda tryLogin je pozvana.');
  console.log('Email:', this.email);

  try {
    const response = await axios.post('http://localhost:3003/login', {
      email: this.email,
      password: this.password
    });

    console.log('Odgovor od servera:', response);
    console.log('Podaci u odgovoru:', response.data);

    if (response && response.data && response.status === 200) {
      const userData = response.data.data;
      console.log('Podaci korisnika:', userData);

      if (userData.usr_id) {
        localStorage.setItem('usr_id', userData.usr_id);
        localStorage.setItem('fk_nar_usr_id', userData.usr_id);  // Ovde se postavlja fk_nar_usr_id
localStorage.setItem('userEmail', userData.usr_email);  //Ne moze userData.email,  vratilo je undefinde, mora userData.usr_email    
console.log('Korisnički ID sačuvan u localStorage.');
 // 🚀 Dodaj i naziv firme
  if (userData.kmp_naziv) {
    localStorage.setItem('firmaNaziv', userData.kmp_naziv);
  } else {
    localStorage.removeItem('firmaNaziv');
  }
        if (userData.usr_adresa) localStorage.setItem('userAddress', userData.kmp_adresa);


  this.$router.push('/proizvodi');


        if (userData.fk_nar_id) {
          localStorage.setItem('nar_id', userData.fk_nar_id);
          console.log('ID narudžbenice sačuvan u localStorage.');
        } else {
          localStorage.removeItem('nar_id');
          console.log('ID narudžbenice nije prisutan, uklonjen iz localStorage ako je postojao.');
        }
      } else {
        console.error('Nedostaje usr_id u podacima korisnika.');
      }
    } else {
      console.error('Prijava nije uspela ili odgovor servera nije u očekivanom formatu.');
    }
  } catch (error) {
    console.error('Greška prilikom prijave korisnika:', error);
  }
}}}
</script>
<style scoped >



body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f0f0f0; /* Zamenite sa željenom bojom */
  width: 100%;
  height: 100%;
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
