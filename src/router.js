import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '*', redirect: '/' },
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
        // 主页
        {
          path: 'main',
          name: 'main',
          component: () => import('@/views/Main.vue'),
          meta: {
            keepAlive: true
          },
        },
        // 推荐
        {
          path: 'recommend',
          name: 'recommend',
          component: () => import('@/views/Recommend'),
          meta: {
            keepAlive: true
          },
        },
        // 个人主页
        {
          path: 'mine',
          name: 'mine',
          component: () => import('@/views/Profile'),
          meta: {
            keepAlive: true
          },
          children: [
            // 登陆
            {
              path: 'login',
              name: 'login',
              component: () => import('@/views/Profile/children/login.vue')
            },
            // 退出
            {
              path: 'logout',
              name: 'logout',
              component: () => import('@/views/Profile/children/logout.vue')
            }
          ]
        },
        // 电影详情页
        {
          path: 'movie',
          name: 'movie',
          component: () => import('@/views/movie-detail'),
          props: (route) => ({ movieId: route.query.movie_id }),
          meta: {
            keepAlive: false
          },
        },
        // 影人
        {
          path: 'celebrity',
          name: 'celebrity',
          component: () => import('@/views/Celebrity'),
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
