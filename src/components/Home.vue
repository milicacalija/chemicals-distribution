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

          <!-- Link za admina -->
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


    
    <!-- Chatbox (plivajući) -->
    <div class="chatbox" :class="{ open: chatOpen }">
      <div class="chat-header" @click="chatOpen = !chatOpen">
        <span>Kako Vam možemo pomoći!</span>
        <span v-if="chatOpen">&#10006;</span>
        <span v-else>&#128172;</span>
      </div>
      <div class="chat-body" v-if="chatOpen">
        <div class="messages">
          <div v-for="(msg, index) in messages" :key="index" class="message">
            <strong>{{ msg.sender }}:</strong> {{ msg.text }}
          </div>
        </div>
        <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Upiši poruku..." />
        <button @click="sendMessage">Pošalji</button>
      </div>
    </div>

  </div>
</template>


  

 <script>
import axios from 'axios';

export default {
  name: "Home",
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('usr_id');
    },
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
      // Chatbox
      chatOpen: false,
      newMessage: "",
      messages: [], // poruke u chatbox-u
      guestId: 'guest-' + Math.floor(Math.random() * 10000), // jedinstveni ID anonimnog korisnika
      
      // Slideshow
      showSlideshow: true,
      currentIndex: 0,
      slides: [
        {
          title: "Originalna industrijska rešenja",
          text: "CHEMICALS kompanija posluje više od deset godina na tržištu širom sveta i spada u jednu od vodećih distribucionih organizacija za industrije širom Srbije."
        },
        {
          title: "Industrijske potrebe",
          text: "Zadovoljavamo potrebe proizvodnje i kontrole kvaliteta za širok spektar različith grana industrije medicine, farmacije, poljoprivrede, prehrane ..."
        },
        {
          title: "Proizvodi visokog stepena čistoće i kvaliteta",
          text: "Hemikalije sa visokim stepenom čistoće koje zadovoljavaju ISO standarde analitičkih i tehničkih reagenasa."
        },
        {
          title: "Karijera",
          text: "Naš tim čine mladi, stručni, ambiciozni i proaktivni ljudi posvećeni kreativnim biznis idejama koje pouzdano zadovoljavaju usluge naših klijenata. Pošalji nam svoj CV na našu mail adresu i u kratkom roku očekuj naš poziv."
        },
      ]
    };
  },
  methods: {
    // Slideshow metode
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
      if (!slideshow) return;
      slideshow.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    },

    // Chat metode
    
  sendMessage() {
    if (!this.newMessage) return;

    

   const userId = localStorage.getItem('usr_id'); // ID ulogovanog korisnika
  const payload = {
    fk_user_sender: userId ? Number(userId) : null,
    user_id_reciver: 0,              // admin
    por_content: this.newMessage,
    tip: 'poruka',
    user_anonim: userId ? null : -1   // anonimni ako nije ulogovan
  };

  // Dodaj poruku lokalno
  this.messages.push({
    sender: userId ? 'Vi' : 'Anonimni',
    text: this.newMessage
  });

    axios.post('http://localhost:3014/poruke', payload)
      .then(() => {
        // automatski odgovor admina posle 1 sekunde
        setTimeout(() => {
          this.messages.push({ sender: 'Admin', text: 'Vaš zahtev će biti obrađen u najkraćem roku.' });
        }, 1000);
      })
      .catch(err => console.error(err));

    // Očisti input
    this.newMessage = "";
  }
},
  mounted() {
    // Slideshow
    this.showSlideshow = false;
    this.$nextTick(() => {
      this.updateSlidePosition();
      setInterval(() => {
        this.nextSlide();
      }, 10000);
    });
  }
};
</script>




  
  
  <style scoped>
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

/* Chatbox container */
.chatbox {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px; /* povećano za duži tekst */
    max-height: 400px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  font-family: Arial, sans-serif;
  z-index: 1000;
}

/* Chatbox collapsed */
.chatbox:not(.open) {
  height: 40px;
  width: 280px;
  cursor: pointer;
}

/* Chat header */
.chat-header {
  background: #641515;
  color: white;
  padding: 10px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

/* Chat body */
.chat-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 300px;
}

/* Messages */
.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 5px;
  background: #f1f1f1;
}

/* Input and button */
.chat-body input[type="text"] {
  width: calc(100% - 60px);
  padding: 5px;
  margin-right: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.chat-body button {
  padding: 5px 10px;
  background:  #641515;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.chat-body button:hover {
  background: #390c0c;
}

@media (max-width: 768px) {
  /* Logo i navigacija */
  .logo {
    width: 80px;
  }

  .logo-text {
    font-size: 28px;
  }

  .nav-links {
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin: 0;
    margin-top: 10px;
  }

  .nav-links a {
    font-size: 16px;
    margin: 0;
  }

  

  /* Slajdovi za mobilne */
  .slide {
    min-height: 300px;  
    width: 100%;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center; /* horizontalno centriranje */
    align-items: center;     /* vertikalno centriranje */
    padding: 0 15px;
    color: white;
    text-align: center;      /* centriran tekst */
  }

  .slide-content {
    max-width: 95%;
    padding: 10px;
    background: rgba(0,0,0,0.4);
    border-radius: 10px;
  }

  .slide-title {
    font-size: 20px;
    margin-bottom: 6px;
  }

  .slide-text {
    font-size: 14px;
    line-height: 1.4;
  }

  /* Chatbox – postavimo da ne preklapa slajd */
  .chatbox {
    position: relative; /* promenjeno sa fixed na relative */
    margin: 20px auto 40px; /* centrirano ispod slajda, automatski razmak */
    bottom: auto;
    right: auto;
    width: 90%;
    max-width: 320px;
    max-height: 350px;
    z-index: 100; /* ispod navigacije, iznad slajda */
  }

  .chatbox:not(.open) {
    height: 40px;
    width: 90%;
    max-width: 240px;
  }

  .chat-body {
    height: 250px;
  }
}
</style>
