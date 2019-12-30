import Vue from 'vue'
import Router from 'vue-router'
import pokeAmole from '@/views/pokeAmole'
import index from '@/views/index.vue'
import retroSnaker from '@/views/retroSnaker.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/pokeAmole',
      name: 'pokeAmole',
      component: pokeAmole
    },
    {
      path: '/retroSnaker',
      name: 'retroSnaker',
      component: retroSnaker
    }
  ]
})
