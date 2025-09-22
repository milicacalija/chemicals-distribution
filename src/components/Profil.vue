<template>
  <!--U Vue 2, komponente moraju biti importovane i registrovane samo tamo gde se direktno koriste u template-u.-->
  <div class="profil-page">
    <div class="profil-card">
<h1>{{ profileTitle }}</h1>
      <p><strong>Ime i prezime:</strong> {{ usrName }}</p>
<p><strong>Email:</strong> {{ usrEmail }}</p>
<p><strong>Lozinka:</strong> {{ usrLozinka }}</p>

<p><strong>Telefon:</strong> {{ usrPhone }}</p>
<p><strong>PIB:</strong> {{ usrPib }}</p>
<p><strong>Kompanija:</strong> {{ firmaNaziv }}</p>
<p><strong>Adresa:</strong> {{ usrAdresa }}</p>

      <button class="logout-btn" @click="logout">Odjavi se</button>
        </div>
      <!-- Ovde ide elegantni container za proizvode -->
   <div>
    <!-- Prikazuje se samo ako korisnik nije admin -->
    <Proizvodi v-if="!isAdmin" />
    
   <!-- Dugme za admina da ode na admin stranicu -->
    <div v-if="isAdmin">
      <button class="logout-btn" @click="goToAdmin">
        Idi na Admin stranicu
      </button>
    </div>

      <!-- Admin panel za admina, Napomena: Moraš koristiti v-if="isAdmin", a ne v-else.

v-else radi samo ako je prethodni v-if ili v-else-if u istom DOM nivou. -->
   

  

 
  </div></div>
</template>

<script>
import Proizvodi from '@/components/Proizvodi.vue';
//Ah, sada je potpuno jasno zašto dobijaš “previše rekurzije” (Maximum call stack exceeded) 👀U <template> još uvek koristiš <Admin /> unutar Profil.vue.Admin.vue je tvoja stranica koja verovatno opet importuje Profil.vue.Dakle, Vue pokušava da renderuje Profil → unutra <Admin> → opet Profil → <Admin>… i tako u krug, zato je rekurzija beskonačna.
  
//Problem je što pokušavaš da importuješ Admin.vue unutar Profil.vue i koristiš <Admin />, ali u stvari:Admin.vue je glavna stranica (verovatno ruta /admin), a ne komponenta.Vue ne dozvoljava da direktno renderuješ rutu kao komponentu unutar druge komponente, osim ako napraviš posebnu podkomponentu (npr. AdminPanel.vue).Dakle, kad stavljaš <Admin /> unutar Profil.vue, Vue ga ne prepoznaje → zato ti izlazi greška Unknown custom element.
export default {
    //Tvoj computed čita vrednosti direktno iz localStorage, što ne radi kako očekuješ, jer Vue ne zna da se vrednosti localStorage promenile – computed se neće automatski osvežiti. Zato, iako localStorage sadrži sve podatke, template ih ne vidi.Rešenje: koristi data properties + postavi ih pri logovanju
   components: { Proizvodi},
//Posto kontroliseno prikaz stranice za korisnike i admina moramo na neki nacin to i uraditi kroz prop, isAdmin je boolean (true ako je admin, false ako je običan korisnik).
   
  
  data() {
    return {
      usrName: '',
    usrEmail: '',
    usrLozinka: '',
    usrPhone: '',
    usrPib: '',
    firmaNaziv: '',
    usrAdresa: '',
    showAdmin: false,
        
  }},



  created() {
  this.usrName = localStorage.getItem('userName') || '';
  this.usrEmail = localStorage.getItem('userEmail') || '';
    this.usrLozinka = localStorage.getItem('userLozinka') || '';

  this.usrPhone = localStorage.getItem('userPhone') || '';
  this.usrPib = localStorage.getItem('usr_pib') || '';
  this.firmaNaziv = localStorage.getItem('usr_kompanija') || '';
  this.usrAdresa = localStorage.getItem('usr_adresa') || '';
      this.userLevel = Number(localStorage.getItem('userLevel'));
},
  computed: {
 isAdmin() {
      const usrId = localStorage.getItem('usr_id');
      return usrId && this.userLevel === 0; // admin ima level 0
    },
    profileTitle() {
    return this.isAdmin ? 'Podaci o adminu' : 'Podaci o korisniku';
  }
  },


  //data() property-ji su reaktivni, pa Vue template odmah vidi promene.created() hook se izvršava kada se komponenta učita i popunjava data iz localStorage.localStorage je samo za čuvanje podataka između sesija, Vue ne prati promene automatski – zato moramo kopirati u data.
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/');
    },
    goToAdmin() {
      this.$router.push("/admin");
    }
  }
};
</script>

<style scoped>

.modal-wrapper { position: relative; }
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.4); z-index: 999;
}

.admin-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  z-index: 1000;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 999;
}
.profil-page {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.profil-card {
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  text-align: left;
  width: 400px;
}

.profil-card h1 {
  text-align: center;
  margin-bottom: 20px;
}

.profil-card p {
  margin: 8px 0;
}

.logout-btn {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 20px;
  background-color: #641515;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.profil-products-container {
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
</style>
