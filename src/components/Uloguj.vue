
<template>


  <div>
    <div class="kontakt-forma">

      
      <form @submit.prevent="tryLogin">
        <label for="email">E-mail</label>
        <input class="input" style="display: block;" type="text" name="email" v-model="email" autocomplete="email">

        <label for="password">Password</label>
        <input class="input" style="display: block;" type="password" name="password" v-model="password" autocomplete="password">
        

        <div class="login-actions">
  <button type="submit" class="button-input">Uloguj se</button>
  <p class="register-text">
    Nemate nalog? 
    <router-link to="/nalog" class="register-link">Registrujte se</router-link>
  </p>
</div>

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
import Swal from 'sweetalert2';


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

    if (response?.data && response.status === 200) {
      const userData = response.data.data;
      console.log('Podaci korisnika:', userData);

      if (userData?.usr_id) {
        // 1) Očisti stare vrednosti, da ne bi pamtioo nazive ranijih kljuceva, kljucevi moraju biti uniformni
        localStorage.clear();

        // 2) Sačuvaj osnovne podatke korisnika
        localStorage.setItem('usr_id', userData.usr_id);
        localStorage.setItem('userName', userData.usr_name || '');
        localStorage.setItem('userEmail', userData.usr_email || '');
                localStorage.setItem('userLozinka', userData.usr_password || '');

        localStorage.setItem('userPhone', userData.usr_phone || '');
        localStorage.setItem('usr_pib', userData.kmp_pib || '');
        localStorage.setItem('usr_kompanija', userData.kmp_naziv || '');
        localStorage.setItem('usr_adresa', userData.kmp_adresa || '');
        localStorage.setItem('userLevel', userData.usr_level ?? 1);
        localStorage.setItem('fk_usr_nar_id', userData.usr_id);

        console.log('Svi podaci korisnika sačuvani u localStorage.');

        // 3) Ažuriraj reactive data properties da Vue odmah vidi promene
        this.usrName = userData.usr_name || '';
        this.usrEmail = userData.usr_email || '';
                this.usrLozinka = userData.usr_password || '';

        this.usrPhone = userData.usr_phone || '';
        this.usrPib = userData.kmp_pib || '';
        this.usrKompanija = userData.kmp_naziv || '';
        this.usrAdresa = userData.kmp_adresa || '';

        // Preusmeravanje sa SweetAlert potvrdom
            Swal.fire({
              icon: 'success',
              title: 'Uspešna prijava',
              text: `Dobrodošli, ${this.usrName}!`,
              confirmButtonText: 'Nastavi'
            }).then(() => {
              this.$router.push('/profil');
            });

          } else {
            console.error('Nedostaje usr_id u podacima korisnika.');
            Swal.fire({
              icon: 'error',
              title: 'Greška',
              text: 'Nedostaje ID korisnika u podacima.'
            });
          }
        } else {
          console.error('Prijava nije uspela ili odgovor servera nije u očekivanom formatu.');
          Swal.fire({
            icon: 'error',
            title: 'Greška pri prijavi',
            text: 'Prijava nije uspela. Proverite podatke i pokušajte ponovo.'
          });
        }
      } catch (error) {
        console.error('Greška prilikom prijave korisnika:', error);
        Swal.fire({
          icon: 'error',
          title: 'Greška pri prijavi',
          text: error.response?.data?.message || 'Došlo je do greške prilikom prijave.'
        });
      }
    }
  }}
//Svi podaci se čuvaju bez if-ova za proveru null vrednosti. Ako nema podatka, biće postavljeno prazno string ''.userLevel koristi ?? 1 da se osigura da običan korisnik uvek dobije level 1 ako server ne vrati vrednost.Kod je čist i čitljiv, lako se održava.

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
