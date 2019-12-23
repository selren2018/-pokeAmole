import Vue from 'vue'
import Router from 'vue-router'
import pokeAmole from '@/views/pokeAmole'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'pokeAmole',
      component: pokeAmole
    }
  ]
})
