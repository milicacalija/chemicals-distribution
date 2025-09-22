<template>
  <div class="primena-page">
    <!-- Hero kartica na vrhu -->
    <div class="primena-hero" @click="scrollToPiktograme">
      <h2>Traži proizvode prema piktogramu</h2>
      <p>Prelazeći mišem preko slike piktograma otkrij proizvode</p>
    </div>

    <!-- Fade-in grid kartica piktograma -->
    <transition name="fade">
      <div class="piktogrami-container" v-if="piktogrami.length">
        <div 
          v-for="piktogram in piktogrami" 
          :key="piktogram.pkt_id" 
          class="piktogram-kartica"
          @click="$router.push({ name: 'ProizvodOpis', params: { id: piktogram.pro_id } })"
          @mouseenter="prikaziProizvode(piktogram.pkt_id)"
          @mouseleave="sakrijProizvode"
        >
          <img 
            :src="`/images/${encodeURIComponent(piktogram.pkt_naziv)}.jpg`" 
            :alt="piktogram.pkt_naziv" 
            class="piktogram-slika"
          />
          <p class="piktogram-naziv">{{ piktogram.pkt_naziv }}</p>

          <!-- Prikaz proizvoda za hover -->
          <div v-if="selektovaniPiktogram === piktogram.pkt_id" class="proizvodi-lista">
            <div v-if="proizvodi.length">
              <div class="proizvod-kartica" v-for="proizvod in proizvodi" :key="proizvod.pro_id">
                <router-link
                  :to="{ name: 'ProizvodOpis', params: { id: proizvod.pro_id } }"
                  class="klik-iupac"
                >
                  {{ proizvod.pro_iupac }}
                </router-link>
              </div>
            </div>
            <div v-else>
              <p>Nema proizvoda za ovaj piktogram.</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "PrimenaPage",
  data() {
    return {
      piktogrami: [],
      proizvodi: [],
      selektovaniPiktogram: null,
    };
  },
  mounted() {
    axios.get('http://localhost:3011/piktogrami')
      .then(res => this.piktogrami = res.data)
      .catch(err => console.error(err));
  },
  methods: {
    prikaziProizvode(pktId) {
      this.selektovaniPiktogram = pktId;
      axios.get(`http://localhost:3011/piktogrami/proizvodi?piktogram=${pktId}`)
        .then(res => this.proizvodi = res.data)
        .catch(err => console.error(err));
    },
    sakrijProizvode() {
      this.selektovaniPiktogram = null;
      this.proizvodi = [];
    },
    scrollToPiktograme() {
      const element = document.querySelector('.piktogrami-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
};
</script>

<style scoped>
/* Hero kartica */
.primena-hero {
  background: linear-gradient(135deg, #641515, #a83232);
  color: white;
  text-align: center;
  padding: 40px 20px; /* manja visina */
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 40px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.primena-hero:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Grid kartice piktograma */
.piktogrami-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  justify-content: center;
  overflow: visible; /* bitno da lista ne bude sečena */
}
.piktogram-kartica {
  background-color: #fff7e6;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative; /* relativno za apsolutnu listu */
  z-index: 1;
}

.piktogram-kartica:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.piktogram-slika {
  width: 80px; /* manje slike */
  height: 80px;
  object-fit: cover;
  margin-bottom: 10px;
}

.piktogram-naziv {
  font-weight: bold;
  font-size: 1em;
}

/* Proizvodi lista na hover */
.proizvodi-lista {
  position: absolute; /* apsolutno unutar kartice */
  top: 0;             /* vrh kartice */
  left: 0;            /* levo od kartice */
  right: 0;           /* desno od kartice */
  bottom: 0;          /* pokriva celu visinu kartice */
  background: rgba(255,255,255,0.95);
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}


.proizvod-kartica {
  margin-bottom: 5px;
}
.klik-iupac {
  color: #641515;
  text-decoration: underline;
  cursor: pointer;
}
</style>
