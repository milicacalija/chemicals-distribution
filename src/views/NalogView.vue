<template>
    <div >
        <!---Unutar template se sadrzi komponenta za prikaz kompanija, a posto kompanija ne postoji onda cemo napraviti kompaniju u folderu components-->
        <Nalog></Nalog>
        <h1> Kreiranje naloga</h1>
        <div class="kontakt-forma">
       
            <label for="unos">Naziv kompanije</label>
            <!--Ako zelim da inline elemente namestim kao block (jedan ispod drugog) onda treba da -->
            <input class="input" type="text" style="display: block;" name="name">
            <label for="unos">Vaše ime i prezime </label>
<input class="input" type="text" style="display: block;">
<label for="unos"> E-mail</label>
<input class="input" type="text" name="name">
<label for="unos">Kontakt telefon</label>
<input class="input" type="text" name="name">
<!--Hocu da napravim kvadratic cekirati password, to ide preko checkbox-->

<label for="unos">Vaša poruka </label>
<!--Za inpute koji su namenjeni za poruke ide tag text area, moze se prosiriti input strelicom na dole sa desne strane-->
<textarea class="text-input" type="text" name="name"> </textarea>
        <br>
  <button class="button-input" onclick="doLogin()"> Pošalji </button>
</div> <!--Kraj sa klasom sign-up vezano za inpute -->
</div>

    </template>
    <script>
    /*Da bi mogli da prikazemo komponentu komanija iz stranice Kompanija.vue moramo da je importujemo*/
    import Nalog from '@/components/Nalog.vue'
    export default{
        name: 'NalogView',
        /*Da bi mogli da koristimo Kompanije kao component moramo da je definisemo kao komponentu u delu components*/
        components: {
            Nalog
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
        padding: 60px 0;
        padding-left: 50px;
        padding-top: 10px;
       
       
        color: #fff;
       
        height: 600px;
    }
    .kontakt .container{
        margin-left: 50px;
        margin-right: 20px;
        justify-content: space-between;
        /*Absolute pozicija da bi bio tekst naspram slike a ne da se odvoji negde u centru, tako bi bilo da je pozicija relative*/
        position: absolute;
        height: 200px;
      
        
        

    }
    
   /*Vezano za file kontkat.html*/
 /*Da ne bi doslo do preklapanja da div preklopi neki drugi tekst i sl treba da ga stavimo u poseban div sa odredjenom klasom, ili ako je div vec definisan , onda treba da proverimo padding, margine, visinu i sirinu diva, kao i position, OBAVEZNO!*/

 .kontakt-forma{
    display: grid;
    padding:  10px;
    justify-content: center;
    font-weight: bold;
    
}
.input{
    
    width: 500px;
    height: 50px;
    border: 1.5px solid #641515;
    border-radius: 5px;
    position: relative;
    
    
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


 
    }
    </style>