 //Da vidimo da li postoji product i da li je definisano, To znači da trenutni poziv product.pro_iupac baca grešku jer pro_iupac nije direktno na product, već na product.product.
export function getImageUrl(item) {

  // 1. Proveri sve moguće lokacije za naziv proizvoda
  const naziv = item?.product?.pro_iupac || item?.product?.naziv || item?.pro_iupac || item?.naziv;

  // 2. Fallback ako nema naziva
  if (!naziv) {
    console.warn('Nema pro_iupac za:', item);
    return '/images/korpica.png';
  }

  // 3. EncodeURIComponent obezbeđuje da specijalni karakteri i razmaci ne kvare putanju
  const safeNaziv = encodeURIComponent(naziv.toLowerCase().trim());
  return `/images/${safeNaziv}.jpg`;
}




