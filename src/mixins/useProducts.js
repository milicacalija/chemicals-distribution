// mixin useProducts.
import axios from 'axios';

export const productMixin = {
  data() {
    return {
      items: [],
      itemsMap: {},   // mapirano po pro_id za brzi pristup
      cartItems: []
    };
  },
 methods: {
  async loadProducts() {
  try {
    const response = await axios.get('http://localhost:3007/proizvodi');
    // backend vraća objekat { data: [...] }
    this.items = response.data.data;  

    // kreiranje mape po pro_id
    this.itemsMap = {};
    this.items.forEach(item => {
      this.itemsMap[item.pro_id] = item;
    });

    console.log("ItemsMap kreirana:", this.itemsMap);
  } catch (error) {
    console.error("Greška pri učitavanju proizvoda:", error);
  }
}

}}