<template>
    <div>
        <Kontakt> </Kontakt>
    
      <div class="kontakt">
    <div class="container">
        <div class="kontakt-text"> <!--Pocetak diva sa klasom kontakt-text-->
        <h1> Gde se nalazimo</h1>
<p> Nalazimo se preko puta tržnog centra Delta City i jednog od najlepših naselja na Novom Beogradu Belvile</p> 
    </div> <!--Kraj diva kontakt-text-->  
    <!-- Pocetak forme, to je vezano samo za inpute-->
        <!--Ako budem zelela placeholder , unosim ga posle name company u okviru inputa-->
        
  <div class="google-map-img"> 
           <!--Pocetak diva sa klasom google-map--> 
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.8156712370333!2d20.403329575959127!3d44.80494507107074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a6f901c3f3d5d%3A0x2eeff23d2f7b2b60!2sJurija%20Gagarina%2036%2C%20Beograd%2011070!5e0!3m2!1sen!2srs!4v1693429575542!5m2!1sen!2srs" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> <!--Ovo je embedovan link sa Google map na webu-->
            <address>  <img alt=" mail" src="../assets/mail.png"> <a href="mailto:chemical@distribution.com">  <span class="address" >  chemicals@chemistry.com  </span> </a> 
              <img alt="phone" src="../assets/phone.png">   <a href="tel:+381659600516">
                   <span class="address" >  +381 65 9600 516  </span>   </a> </address>
        </div> <!--Kraj diva sa klasom google map-->

        <div class="kontakt-forma">
        
            <label for="unos">Naziv kompanije</label>
            <!--Ako zelim da inline elemente namestim kao block (jedan ispod drugog) onda treba da -->
            <input class="input" type="text" style="display: block;" name="name">
            <label for="unos">Vaše ime i prezime </label>
<input class="input" type="text" style="display: block;">
<label for="unos"> E-mail</label>
<input class="input" type="text" name="name">


<!--Hocu da napravim kvadratic cekirati password, to ide preko checkbox-->

<label for="unos">Vaša poruka </label>
<!--Za inpute koji su namenjeni za poruke ide tag text area, moze se prosiriti input strelicom na dole sa desne strane-->
<textarea class="text-input" type="text" name="name"> </textarea>
        
  <button class="button-input" onclick="doLogin()"> Pošalji </button>
</div> <!--Kraj sa klasom sign-up vezano za inpute -->
</div> <!--Kraj diva sa klasom container-->
  </div> <!--Kraj diva sa klasom kontakt-->
<div>
               <p> <a href="/"> Povratak na glavnu stranu</a> </p>
               <a href="/korisnici">Naši korisnici</a>
            </div>
           
   
</div>
 
    
  </template>
  <script>
  /*Da bi mogli da prikazemo komponentu komanija iz stranice Kompanija.vue moramo da je importujemo*/
  import Kontakt from '@/components/Kontakt.vue'
  export default{
      name: 'KontaktView',
      /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
      components: {
          Kontakt
      }
      /*Idemo do rute do file.index.js i pravimo novu rutu*/
  }
  </script>

  <style scoped>

*{
    box-sizing: border-box;
}

body {
    font-family: Arial, Helvetica, sans-serif;
     
    margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f0f0f0; /* Zamenite sa željenom bojom */
  width: 100%;
  height: 100%;
    
    }
    .kontakt{
       
       
       
        color: #fff;
       
        height: 600px;
    }
    .kontakt .container{
        margin-left: 50px;
        margin-right: 300px;
        
        /*Absolute pozicija da bi bio tekst naspram slike a ne da se odvoji negde u centru, tako bi bilo da je pozicija relative*/
        
       
      
        
        

    }
    .kontakt-text{
        color: #641515;
    }
    
   /*Vezano za file kontkat.html*/
 /*Da ne bi doslo do preklapanja da div preklopi neki drugi tekst i sl treba da ga stavimo u poseban div sa odredjenom klasom, ili ako je div vec definisan , onda treba da proverimo padding, margine, visinu i sirinu diva, kao i position, OBAVEZNO!*/
 .google-map-img {
    /* Za uokviravanje diva mozemo dodati padding sa svih strana i sirinu diva regulisati*/
    width: 630px;
    background-color: #033a15;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 15px;
    padding-right: 50px;
   
    position: absolute;
    
   
       
    
}
.google-map iframe {
    
    height: 300px;
    width: 450px;
   
    
    
   
    
   
 
}
.kontakt-forma{
    display: grid;
    justify-content: right;
    font-weight: bold;
    color: #641515;
    
}
.input{
    
    width: 500px;
    height: 50px;
    border: 1.5px solid rgb(100, 21, 21);
    border-radius: 5px;
   
    
   
    
    
}
    /* Umesto display flex ako zelim da budu kontenti jedan ispod drugog, a da se vide sa leve i desne strane display grid je resenje*/
    
.button-input{
   
color: #fff;
font-weight: bold;
font-size: 15px;
margin:0 auto;
border-radius: 20px;
padding: 10px;
width: 500px;
height: 50px;
position: relative;
  top: 100%;
  
    }
</style>