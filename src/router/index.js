import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import KompanijeView from'../views/KompanijeView.vue'
import ProizvodiView from '../views/ProizvodiView.vue'
import SpecifikacijeView from '../views/SpecifikacijeView.vue' 
import StavkeView from '../views/StavkeView.vue' 
import KontaktView from '../views/KontaktView.vue'
import KorpaView from '../views/KorpaView.vue'
import UlogujView from '../views/UlogujView.vue'
import NalogView from '../views/NalogView.vue'
import NarudzbeniceView from '../views/NarudzbeniceView.vue' 
import NastkupovineView from '../views/NastkupovineView.vue' 
import PaymentFormView from '../views/PaymentFormView.vue'  
import PiktogramiView from '../views/PiktogramiView.vue'
import PrimenaView from '../views/PrimenaView.vue'
import ProizslikeView from '../views/ProizslikeView.vue'






Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/kompanije',
    name: 'kompanije',
    component: KompanijeView
  },
 
 
{
  /*Ovde stvaramo rutu koju zaelimo izmeniti*/
  path: '/proizvodi',
  name: 'proizvodi',
  component: ProizvodiView
  /*Sad treba impotrovati KompanijaView, to cemo u index.js, posle svih import*/
},




//Da ne bi imali 200 novih stranica kad se otvara naziv proiuvoda mozemo da generisemo po id, tako svaki put otvara novu specifikaciju za proizvod*/

  {

    path: '/specifikacije',
      name: 'specifikacije',
      component: SpecifikacijeView
    
  },
  
  {

    path: '/stavke',
      name: 'stavke',
      component: StavkeView
    
  },
  
{

  
  path: '/kontakt',
  name: 'kontakt',
  component: KontaktView
},
{
  path: '/korpa',
      name: 'Korpa',
      component: KorpaView,
      props: route => ({ cartItems: JSON.parse(route.query.cartItems) })
},

{
  path: '/uloguj',
  name: 'uloguj',
  component: UlogujView
},
{
  path: '/nalog',
  name: 'nalog',
  component: NalogView
},

{
  path: '/Narudzbenice',
  name: 'Narudzbenice',
  component: NarudzbeniceView
},
{
  path: '/Nastkupovine',
  name: 'Nastkupovine',
  component: NastkupovineView
},
{
  path: '/PaymentForm',
  name: 'PaymentForm',
  component: PaymentFormView
},


{
  path: '/Piktogrami',
  name: 'Piktogrami',
  component: PiktogramiView
},



{
  path: '/Primena',
  name: 'Primena',
  component: PrimenaView
},
{
  path: '/Proizslike',
  name: 'Proizslike',
  component: ProizslikeView
},



]

  const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
}

)


export default router


