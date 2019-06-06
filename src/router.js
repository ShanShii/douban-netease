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
      meta: {
        keepAlive: true
      },
      children: [
        {
          path: 'main',
          name: 'main',
          component: () => import('@/views/db-main.vue'),
          meta: {
            keepAlive: true
          },
        },
        {
          path: 'recommend',
          name: 'recommend',
          component: () => import('@/views/db-recommed.vue'),
          meta: {
            keepAlive: true
          },
        },
        {
          path: 'mine',
          name: 'mine',
          component: () => import('@/views/db-mine.vue'),
          meta: {
            keepAlive: true
          },
        },
        {
          path: 'movie',
          name: 'movie',
          component: () => import('@/views/movie-detail'),
          props: (route) => ({ movieId: route.query.movie_id }),
          meta: {
            keepAlive: false
          },
        },
        {
          path: 'celebrity',
          name: 'celebrity',
          component: () => import('@/views/db-celebrity'),
          props: (route) => ({ celebrityId: route.query.celebrity_id }),
          meta: {
            keepAlive: false
          },
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
