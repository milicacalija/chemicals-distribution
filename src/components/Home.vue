<template>
    <div>
      <div class="nav">
        <div class="container">
            <!-- Logo unutar navigacionog bara,  //Ako želiš da tekst bude gore u krugu, a slika ispod teksta, najbolje je da koristiš flex sa flex-direction: column i malo razmaka. -->
        
            <br>
            <div class="nav-links">
                <div class="logo-header">
          
  <p class="logo-text">CHEMICALS</p>
  <img src="@/assets/chemical.png" alt="Chemical Logo" class="logo" />
</div>
              
   
            
          
        
    
              <a href="/proizvodi">Hemikalije</a>
              <a href="/primena">Primena</a>
              <a href="/kontakt">Kontakt</a>
              <a href="/uloguj">Uloguj se</a>
              <a href="/nalog">Kreiraj nalog</a>
              <div class="dropdown">
            
              <address>
          <img alt="mail" src="../assets/mail.png">
          <a href="mailto:chemicals@chemistry.com">
            <span class="address">chemicals@chemistry.com</span>
          </a>
          <br>
          <img alt="phone" src="../assets/phone.png">
          <a href="tel:+381659600516">
            <span class="address">+381-65 9600-516</span>
          </a>
        </address>
            </div>
          </div>
        </div>
      </div>
                  
            
 
  
  
      <div class="slideshow-container">
  <div class="slideshow" ref="slideshow">
    <div class="slide" v-for="(slide, index) in slides" :key="index">
      <div class="slide-content">
        <h2 class="slide-title">{{ slide.title }}</h2>
        <p class="slide-text">{{ slide.text }}</p>
      </div>
    </div>
  
          <!-- Dugme za prelazak na prethodni slajd -->
          <button class="prev" @click="prevSlide">&#10094;</button>
          <!-- Dugme za prelazak na sledeći slajd -->
          <button class="next" @click="nextSlide">&#10095;</button>
        </div>
      </div>
   
      <div id="footer">
        <div class="container">
          <div class="footer-text"></div>
        </div>
        <span class="address-footer">Jurija Gagarina 36, 11070, Novi Beograd</span>
       
        <br>
        <span class="address">Personal Data Protection<br>Cookie Policy</span>
      </div> </div>
  
     
  </template>
  

 <script>
export default {
  name: "Home",
  data() {
    return {
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
      slideshow.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
  },
  mounted() {
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


</style>

