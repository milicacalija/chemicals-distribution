<template>
  <div class="kontakt-page">
    <div class="kontakt container">
      <!-- Naslov i opis -->
      <div class="kontakt-text">
        <span class="lokacija-title">Gde se nalazimo</span>
        
      </div>

      <!-- Flex row: leva mapa, desno tekst i linkovi -->
      <div class="map-contact">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.8156712370333!2d20.403329575959127!3d44.80494507107074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a6f901c3f3d5d%3A0x2eeff23d2f7b2b60!2sJurija%20Gagarina%2036%2C%20Beograd%2011070!5e0!3m2!1sen!2srs!4v1693429575542!5m2!1sen!2srs"
          frameborder="0"
          allowfullscreen
          loading="lazy"
          class="google-map"
        ></iframe>

        <div class="contact-info">
          
          <p>
            <a href="mailto:chemical@distribution.com">📧 chemicals@chemistry.com</a>
          </p>
          <p>
            <a href="tel:+381659600516">📞 +381 65 9600 516</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KontaktView'
}
</script>

<style scoped>
/*Vec je uradjen i responsive deo
/*flex-wrap: wrap u .map-contact – kada ekran postane uži, mapa i info deo se spuste jedan ispod drugog.Maksimalne širine (max-width) za mapu i info deo – omogućavaju da se lepo skalira bez da izlazi iz viewporta.
.kontakt-page {
  background-color: #f0f0f0;
  padding: 40px 20px;
  font-family: Arial, Helvetica, sans-serif;
}

/* Naslov veći i podebljan */
.lokacija-title {
  font-size: 2em;
  font-weight: bold;
  color: #641515;
}

/* Opis ispod naslova */
.lokacija-desc {
  font-size: 1.3em;
  color: #333;
  margin-top: 10px;
}

/* Flex raspored: mapa levo, info desno */
.map-contact {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  flex-wrap: wrap;
}

/* Google mapa */
.google-map {
  width: 100%;
  max-width: 600px;
  height: 400px;
  border: 2px solid #641515;
  border-radius: 10px;
}

.kontakt.container {
  padding: 20px;        /* unutrašnji razmak od ivica */
  margin: 0 auto;       /* centriranje cele sekcije */
  max-width: 1000px;    /* ograničava širinu sekcije, da ne ide skroz do ivica */
  box-sizing: border-box;
}

.map-contact {
  display: flex;
  gap: 30px;            /* razmak između mape i desne strane (linkovi) */
  flex-wrap: wrap;       /* pada ispod na mobilnom ekranu */
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 40px;
}

.google-map {
  width: 100%;
  max-width: 600px;
  height: 400px;
  border: 2px solid #641515;
  border-radius: 10px;
  margin: 0 auto;       /* centrira mapu unutar container */
}

/* Mobile view */
/* Mobile view */
@media (max-width: 600px) {
  .google-map {
    width: 100%;
    height: 300px;
  }

  .contact-links {
    width: 100%;
    text-align: center;
    font-size: 16px;
    margin-top: 15px; /* razmak iznad linkova */
  }
}


</style>
