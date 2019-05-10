import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'entrance',
      component: () => import('./views/Entrance.vue')
    },

    {
      path: '/douban',
      name: 'douban',
      component: () => import('./views/Douban.vue')
    },

    {
      path: '/netease',
      name: 'netease',
      component: () => import('./views/Netease.vue')
    },

    {
      path: '/citylist',
      name: 'citylist',
      component: () => import('./views/Citylist.vue')
    }
  ]
})
