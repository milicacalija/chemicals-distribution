function pretvoriHex (broj){
    var rezultat = "";
while (broj>0) {
    let ostatak = broj%16;
    rezultat = (toHex(ostatak)) + rezultat;
    broj =Math.floor(broj/16)
    
}
return rezultat; 

}
function toHex(broj){
    if(broj<10){
        return broj;
    }
    switch (broj) {
        case 10: return "a";
        case 11: return "b";
        case 12: return "c";
        case 13: return "d";
        case 14: return "e";
        case 15: return "f";
            

       
    }
}
function Boja(r,g,b){
this.red= r;
this.green = g;
this.blue = b;

this.vratiBoju = function(){
    return "#" + pretvoriHex(this.red)+ pretvoriHex(this.green)+ pretvoriHex(this.blue)
}

}
export default {
    pretvoriHex,
    Boja
}