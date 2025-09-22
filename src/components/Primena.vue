<template>
  <div class="primena-page">
    <h1>Primena hemikalija</h1>

    <!-- Grid kartice primene sa slikama -->
    <div class="primene-container" v-if="items.length">
      <div 
        v-for="item in items" 
        :key="item.primena"  
        class="primena-kartica"
        :style="{ backgroundImage: 'url(' + item.img + ')' }"
        @mouseenter="selectedImagePrimena = item.primena"
        @mouseleave="selectedImagePrimena = null"
      >
        <!-- Overlay sa nazivom primene -->
        <div class="primena-overlay">
          <p class="primena-naziv">{{ item.primena }}</p>
        </div>

        <!-- Fade-in lista proizvoda za hover -->
        <transition name="fade">
          <div 
            v-if="selectedImagePrimena === item.primena" 
            class="proizvodi-lista"
          >
            <div 
              v-for="proizvod in item.proizvodi" 
              :key="proizvod.pro_id"
              class="proizvod-item"
            >
              <router-link
                :to="{ name: 'ProizvodOpis', params: { id: proizvod.pro_id } }"
                class="klik-iupac"
              >
                {{ proizvod.pro_iupac }}
              </router-link>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PrimenaPage',
  data() {
    return {
      items: [],
      selectedImagePrimena: null,
      imageMap: {
              nuklearna: require('@/assets/nuklearna.jpeg'),
      farmacija: require('@/assets/farmacija.jpeg'),
            veterina: require('@/assets/veterina.jpeg'),
            stomatologija: require('@/assets/stomatologija.jpeg'),
  "prehrambena industrija": require('@/assets/prehrambena.jpeg'),
   "naftna industrija": require('@/assets/naftna.jpeg'),      // <-- mapiranje, mora da prati tačan naziv slike, posto nam je bilo problematicno da prikazemo sve slike, odlucili smo se da imamo samo jedna naziv bez specijalnih karaktera i razmaka
  "nuklearna industrija": require('@/assets/nuklearna.jpeg'), // <-- mapiranje
  "metalna industrija": require('@/assets/metalna.jpeg'),
                    poljoprivreda: require('@/assets/poljoprivreda.jpeg'),

                  kozmetika: require('@/assets/kozmetika.jpeg'),
                  elektroindustrija: require('@/assets/elektroindustrija.jpeg'),
                  metalna: require('@/assets/metalna.jpeg'),
                  biohemija: require('@/assets/biohemija.jpeg'),
                  građevina: require('@/assets/gradjevina.jpeg'),
                                    ekologija: require('@/assets/ekologija.jpeg'),
                                    geologija: require('@/assets/geologija.jpeg'),
                                    mašinstvo: require('@/assets/masinstvo.jpeg'),
                                   pirotehnika: require('@/assets/pirotehnika.jpeg'),


      medicina: require('@/assets/medicina.jpeg'),
      
      'tehnologija vode': require('@/assets/tehnologija.jpeg'),
      // dodaj ostale slike ovde
      default: require('@/assets/logo.png')
    }
    };
  },
  mounted() {
    this.searchData();
  },
  methods: {
   async searchData() {
  try {
    const url = `http://localhost:3000/tipoviprimene?search=`;
    const response = await axios.get(url);

    // Grupisanje po primeni
    const primeneMap = {};

    response.data.data.forEach(item => {
      const primene = Array.isArray(item.tpr_naziv) ? item.tpr_naziv : [item.tpr_naziv];
      primene.forEach(prim => {
        if (!primeneMap[prim]) {
          primeneMap[prim] = {
            primena: prim,
            img: this.getImageUrl(prim),
            proizvodi: []
          };
        }

        // Dodajemo console.log da vidimo šta ide u mapu
        console.log("Povezujemo proizvod sa primenom:", {
          primena: prim,
          pro_iupac: item.pro_iupac,
          pro_id: item.pro_id
        });

        primeneMap[prim].proizvodi.push({ pro_iupac: item.pro_iupac, pro_id: item.pro_id });
      });
    });

    this.items = Object.values(primeneMap);
    console.log("Konačne stavke (items) za prikaz:", this.items);

  } catch (err) {
    console.error(err);
  }
},
   getImageUrl(tpr_naziv) {
  if (!tpr_naziv) return this.imageMap.default;

  const key = tpr_naziv; // direktno koristi naziv iz baze, npr "Prehrambena industrija"

  if (this.imageMap[key]) {
    console.log("Image found for:", tpr_naziv);
    return this.imageMap[key];
  } else {
    console.warn("Image not found for:", tpr_naziv);
    return this.imageMap.default;
  }
}
}

};
</script>

<style scoped>
.primene-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center; /* centrira sve kartice u redu */
}

.primena-kartica {
  width: 250px;
  height: 200px;
  position: relative; /* ovo omogućava apsolutnu poziciju liste unutar kartice */
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* overlay sa nazivom ostaje dole */
}

.primena-overlay {
  background: rgba(0,0,0,0.5);
  color: #fff;
  text-align: center;
  padding: 8px 0;
}

/* Lista proizvoda na hover */
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

.proizvod-item {
  margin-bottom: 6px;
}

.klik-iupac {
  color: #333;
  text-decoration: none;
}

.klik-iupac:hover {
  text-decoration: underline;
}
@media (max-width: 600px) {
  .piktogrami-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  .proizvodi-lista {
    width: 180px;
  }
}

</style>

