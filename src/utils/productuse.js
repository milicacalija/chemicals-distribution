//Vidim da si napisala funkciju kao da želiš da koristiš direktno this.products i item.fk_stv_pro_id unutar definicije funkcije — ali u JS ne možeš tako, parametri funkcije su samo imena, ne mogu da budu izrazi.Evo kako pravilno definišeš tu funkciju, kao običnu pomoćnu funkciju (u utils fajlu), koja prima dva argumenta:this nikako ne funkcionise u helper funkciji, umesto toga product mozmeo proslediti kao argumented
export function getProductIUPAC(products, pro_id) {
  if (!Array.isArray(products)) {
    console.warn('Nije prosleđena lista proizvoda:', products);
    return 'Nepoznata hemikalija';
  }

  const product = products.find(item => String(item.pro_id) === String(pro_id));
  return product ? product.pro_iupac : 'Nepoznata hemikalija';
}


//Pozivaš funkciju:{{ getProductIUPAC(item.fk_stv_pro_id) }}Ali ta funkcija zahteva 2 parametra:getProductIUPAC(products, pro_id)Zato ti konzola javlja: Nije prosleđena lista proizvoda: 111Zato što u funkciji products dobija vrednost 111, a to nije niz

//Dobra pitanja! Evo zašto je lista proizvoda važna:Zašto treba lista proizvoda? fk_stv_pro_id u korpi je samo ID proizvoda (broj, npr. 111).Naziv proizvoda (pro_iupac) je spremljen u tabeli proizvoda, tj. u nizu products.Da bi znao/la koji naziv odgovara nekom fk_stv_pro_id, moraš pogledati u taj niz proizvoda i pronaći proizvod koji ima taj ID.Sam ID ti ne govori ništa o nazivu. Zato ti treba ta lista da bi mogao/la da "prevedeš" ID u ime proizvoda.
//Tačno — lista proizvoda ne treba da bude hardkodirana, nego se povlači iz baze i čuva u nekom globalnom stanju ili u roditeljskoj komponenti, pa se prosleđuje kao prop deci.