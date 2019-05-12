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
      component: () => import('@/views/Entrance.vue')
    },

    {
      path: '/douban',
      name: 'douban',
      component: () => import('@/views/Douban.vue'),
      redirect: '/douban/main',
      children: [
        {
          path: 'main',
          name: 'main',
          component: () => import('@/views/db-main.vue')
        },
        {
          path: 'recommend',
          name: 'recommend',
          component: () => import('@/views/db-recommed.vue'),
        },
        {
          path: 'mine',
          name: 'mine',
          component: () => import('@/views/db-mine.vue'),
        }
      ]
    },

    {
      path: '/netease',
      name: 'netease',
      component: () => import('@/views/Netease.vue')
    },

  ]
})
