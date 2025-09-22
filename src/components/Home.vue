<template>
  <div>
    <!-- Navigacioni bar -->
    <div class="nav">
      <div class="container">
        <div class="nav-links">

          <!-- Logo -->
          <div class="logo-header">
            <p class="logo-text">CHEMICALS</p>
            <img src="@/assets/chemical.png" alt="Chemical Logo" class="logo" />
          </div>

          <!-- Glavna navigacija -->
          <router-link to="/proizvodi">Hemikalije</router-link>
          <router-link to="/primena">Primena</router-link>
                    <router-link to="/piktogrami">Piktogrami</router-link>

          <router-link to="/kontakt">Kontakt</router-link>

          <!-- Linkovi za neulogovanog korisnika -->
          <template v-if="!isLoggedIn">
            <router-link to="/uloguj">Uloguj se</router-link>
            <router-link to="/nalog">Kreiraj nalog</router-link>
          </template>


           <!-- Ako je ulogovan običan korisnik -->
          <template v-else-if="!isAdmin">
            <router-link to="/profil">Moj profil ({{ usrName }})</router-link>
          </template>
          


          <!-- Link za admina, Da, tačno – ako u localStorage već postoji userLevel = 0 i usr_id, Vue misli da si admin i zato prikazuje Admin panel i ne pokazuje linkove za “Uloguj se / Kreiraj nalog”. kad se obrise local storage Sjajno! 🎉 Super što sada sve funkcioniše kako treba — običan korisnik vidi Moj profil (ime), neulogovan vidi Uloguj se / Kreiraj nalog, a admin će videti svoj Admin panel kad se uloguje.

Da očistiš localStorage i testiraš različite scenarije: -->
          <router-link v-if="isAdmin" to="/admin">Admin panel</router-link>

          <!-- Kontakt info -->
          <div class="dropdown">
            <address>
              <img alt="mail" src="../assets/mail.png" />
              <a href="mailto:chemicals@chemistry.com">
                <span class="address">chemicals@chemistry.com</span>
              </a>
              <br>
              <img alt="phone" src="../assets/phone.png" />
              <a href="tel:+381659600516">
                <span class="address">+381-65 9600-516</span>
              </a>
            </address>
          </div>

        </div>
      </div>
    </div>

    <!-- Slideshow -->
    <div class="slideshow-container">
      <div class="slideshow" ref="slideshow">
        <div class="slide" v-for="(slide, index) in slides" :key="index">
          <div class="slide-content">
            <h2 class="slide-title">{{ slide.title }}</h2>
            <p class="slide-text">{{ slide.text }}</p>
          </div>
        </div>

        <!-- Dugmad za prelazak slajdova -->
        <button class="prev" @click="prevSlide">&#10094;</button>
        <button class="next" @click="nextSlide">&#10095;</button>
      </div>
    </div>

    <!-- Footer -->
    <div id="footer">
      <div class="container">
        <div class="footer-text"></div>
      </div>
      <span class="address-footer">Jurija Gagarina 36, 11070, Novi Beograd</span>
      <br>
      <span class="address">Personal Data Protection<br>Cookie Policy</span>
    </div>

  </div>
</template>

  

 <script>
export default {
  name: "Home",
computed: {
    isLoggedIn() {
      return !!localStorage.getItem('usr_id');
    },
    //Ako u localStorage nije postavljen userLevel, localStorage.getItem('userLevel') vraća null. Number(null) daje 0 u JavaScript-u! 🔑To znači da Vue misli da si admin čak i kada nisi ulogovana. Zato link Admin panel uvek prikazuje, dodajem proveru da se vidi da li je uopste korisnik ulogovan,pre nego sto vidimo da li je admin
    isAdmin() {
  const userLevel = localStorage.getItem('userLevel');
  const usrId = localStorage.getItem('usr_id');
  return usrId && Number(userLevel) === 0;
},
    usrName() {
      return localStorage.getItem('userName') || '';
    }
  },

   
  data() {
    return {
      
            showSlideshow: true,
        //Ne možeš primeniti CSS direktno na JS objekat (slides), jer CSS radi samo sa HTML elementima.Ključ je renderovati te objekte u HTML (putem v-for ili map funkcije) i dodeliti im klase.Nakon toga jedan CSS stil može da važi za sve slide-ove istovremeno.
      currentIndex: 0,
      slides: [
        {
          title: "Originalna industrijska rešenja",
          text: "CHEMICALS kompanija posluje više od deset godina na tržištu širom sveta i spada u jednu od vodećih distribucionih organizacija za industrije širom Srbije."
        },
        {
          title: "Industrijske potrebe",
          text: "Zadovoljavamo potrebe proizvodnje i kontole kvaliteta za širok spektar različith grana industrije medicine, farmacije, poljoprivrede, prehrane ..."
        },
        {
          title: "Proizvodi visokog stepena čistoće i kvaliteta",
          text: " Hemikalije sa visokim stepenom čistoće koje zadovoljavaju ISO standarde analitičkih i tehničkih reagenasa."
        },

        { title: "Karijera",
            text: "Naš tim čine mladi, stručni, ambiciozni i proaktivni ljudi posvećeni kreativnim biznis idejama koje  pouzdano zadovoljavaju usluge naših klijenata. Sa zadovoljstvom pridruži nam se i TI. Pošalji nam svoj CV na našu mail adresu i u kratkom roku očekuj naš poziv."
        },
            
      ]
    };
  },
  methods: {
   
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.updateSlidePosition();
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.updateSlidePosition();
    },
    updateSlidePosition() {
  const slideshow = this.$refs.slideshow;
  if (!slideshow) return; // ako još nije renderovan, izađi
  slideshow.style.transform = `translateX(-${this.currentIndex * 100}%)`;
}
  },
  mounted() {
//Ah, sada je jasno zašto dobijaš “can't access property 'style', slideshow is undefined” Problem je u Vue2 ref i renderovanju sa v-if / v-for`:Tvoja funkcija updateSlidePosition() koristi this.$refs.slideshow.Ako this.$refs.slideshow još nije renderovan u DOM-u (npr. v-if="showSlideshow" je false), onda je this.$refs.slideshow undefined.Zato dobijaš grešku kada pokušavaš slideshow.style.transform.
        this.showSlideshow = false; // sakrijemo kada komponenta mount-uje
     // Obezbedite da je referenca na slideshow dostupna pre nego što pozovete updateSlidePosition
     this.$nextTick(() => {
      this.updateSlidePosition(); // Postavite početni položaj slajdova
      setInterval(() => {
        this.nextSlide();
      }, 10000); // Usporite automatsku animaciju na 10 sekundi
    });
  }
  };
</script>


  
  
  <style>
  body {
    margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  }
  .nav {
    background-color: #f7f5f5; /* Pozadina navigacionog bara */
  padding: 10px 20px; /* Dodajte padding za prostor oko sadržaja */
  display: flex;
  align-items: center;
  justify-content: space-between; /* Poravnanje logotipa i linkova */
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Blagi senka za navigacioni bar */
}

.logo-header {
  display: flex;
  align-items: center;
}
.logo {
  width: 65px;
  height: auto;
}

.logo-text {
   font-family: 'Oswald', sans-serif; /* možeš promeniti u neki bold font koji voliš */
    font-weight: 700;
  font-size: 34px;
  color: #6a1d1d;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
  margin-bottom: 8px;
}


.nav-links {
  display: flex;
  margin-right: 50px;
  align-items: center;
  gap: 20px; /* Razmak između linkova */
  margin-left: auto; /* Pomera linkove udesno */
  margin-right: 20px; /* Razmak od desne ivice */
}

.nav-links a {
  text-decoration: none;
  color: #000000; /* Boja teksta linkova */
  font-size: 18px; /* Veličina fonta linkova */
  margin: 0 10px; /* Razmak između linkova */
}

.nav-links img {
  margin-left: 15px; /* Razmak između slika i linkova */
}

.address {
  color: #000000;
  font-size: 14px;
}











.slideshow-container {
    position: relative; /* Da bi se dugmad mogla pozicionirati unutar kontejnera */
 
  
  width: 100%;
  overflow: hidden;
}

.slideshow {
  display: flex;
  transition: transform 2s ease-in-out;/*Vreme trajanja izmedju slajdova*/
}


/*Da bi svi slide-ovi imali isti stil, samo ciljaj klasu .slide direktno, a ne pseudo-klasu , pseudo klasa je slide first of type.
/* Prvi slajd sa slikom i gradijentom */
.slide {
   display: grid;/*Za preciznije pozicioniranje slajda*/
    place-items: center; /* Centrirajte sadržaj */
  min-width: 100%;
  box-sizing: border-box;
  position: relative;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.035), rgba(37, 37, 37, 0.5)), url(../assets/chemical-lab.jpg);
  background-size: cover; /* Podesite da slika pokrije ceo slajd */
    background-position: center; /* Postavite poziciju slike */
    background-repeat: no-repeat; /* Osigurajte da se slika ne ponavlja */
  height: 500px; /* Povećajte visinu slajda prema potrebi */
  color: white; /* Postavite boju teksta na belo */
  display: flex;
  justify-content: flex-start; /* Podesite da tekst bude sa leve strane */
  align-items: center;
  text-align: left; /* Poravnajte tekst na levo */
  padding-left: 50px; /* Dodajte padding sa leve strane */
  
}
.slide-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 32px;
  margin-bottom: 10px;
}

.slide-text {
  font-family: 'Arial', sans-serif;
  font-size: 18px;
  line-height: 1.5;
}





/* Stilizovanje sadržaja slajda */
.slide-content {
    grid-column: 1 / -1; /* Koristite ceo red */
  grid-row: 1 / -1; /* Koristite ceo kolonu */
    position: absolute; /* Pozicionirajte sadržaj apsolutno unutar slajda */
    left: 20px; /* Razmak od leve ivice */
  bottom: 20px; /* Razmak od donje ivice */
  max-width: 80%; /* Maksimalna širina sadržaja */
  color: #fff; /* Boja teksta */
  padding: 20px; /* Padding oko teksta */
  background: rgba(0, 0, 0, 0.5); /* Poluprovidna pozadina za bolju čitljivost */
  border-radius: 10px; /* Zaobljeni uglovi */
}

.slide-text {
  font-family: 'Arial', sans-serif;
  font-size: 18px;
  line-height: 1.6;
  max-width: 600px;
  color: rgba(255, 255, 255, 0.9); /* bela, lagano prozirna za nenametljivost */
  font-weight: 500; /* srednji bold – vidi se, ali nije napadno */
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3); /* blaga senka da se istakne na slici */
}
.slide:nth-of-type(2) {
    background: linear-gradient(to right, rgba(37, 37, 37, 0.972) 0%, rgba(37, 37, 37, 0) 50%), url('../assets/industrije 5200 x 3400.jpg') no-repeat center center;
  background-size: cover; /* Podesite da slika pokrije ceo slajd */
  background-position: bottom; /* Postavite poziciju slike */
  background-repeat: no-repeat; /* Osigurajte da se slika ne ponavlja */
  color: white; /* Postavite boju teksta na belo */
  display: flex;
  justify-content: flex-start; /* Podesite da tekst bude sa leve strane */
  
  align-items: center; /* Poravnajte tekst vertikalno */
  padding-left: 50px; /* Dodajte padding sa leve strane */

}
.slide:nth-of-type(3) {
    background: linear-gradient(to right, rgba(37, 37, 37, 0.972) 0%, rgba(37, 37, 37, 0) 50%), url('../assets/chemicals 2250 x 1500.jpeg') no-repeat center center;
    background-size: cover; /* Podesite da slika pokrije ceo slajd */
    background-position: center; /* Postavite poziciju slike */
    background-repeat: no-repeat; /* Osigurajte da se slika ne ponavlja */

}
.slide:nth-of-type(4) {
    background: linear-gradient(to right, rgba(37, 37, 37, 0.972) 0%, rgba(37, 37, 37, 0) 50%), url('../assets/team-work 6000x4004.jpg') no-repeat center center;
    background-size: cover; /* Podesite da slika pokrije ceo slajd */
    background-position: center; /* Postavite poziciju slike */
    background-repeat: no-repeat; /* Osigurajte da se slika ne ponavlja */

}
.prev, .next {
    position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1000; /* Uvećajte z-index ako dugmad nisu iznad svih slajdova */
}


.prev {
  left: 20px; /* Razmak od leve ivice */
}

.next {right: 20px; /* Razmak od desne ivice */
}
/* Responsive za mobilne telefone */
@media (max-width: 768px) {
 .slide {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  
  /* Nema fiksne visine */
  width: 100%;
  aspect-ratio: 16 / 9; /* održava proporciju slike */
  
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  padding-left: 50px;
  position: relative;
  color: white;
}
  .slide-title {
    font-size: 22px;
  }
  .slide-text {
    font-size: 14px;
    max-width: 90%;
  }
  .slide-content {
    max-width: 95%;
    padding: 10px;
  }

  .logo-text {
    font-size: 24px;
  }
  .nav-links {
    flex-direction: column;
    gap: 10px;
    margin-right: 10px;
  }
  .nav-links a {
    font-size: 14px;
  }
}



</style>

