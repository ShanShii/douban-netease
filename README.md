# douban-movie
    Vue2.0仿手机端豆瓣电影

## Project setup
```
npm install
```
+ insert:
    - ~~在https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi中下载NeteaseCloudMusicApi，并按照教程启动本地代理~~ 不写了
    - 使用node proxy.js，启动豆瓣API本地代理（默认8010端口）。
    
### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

技术栈：vue, vue-router, vue-vuex, vue-CLI, vant, swiper, {axios, fetch, ajax}, sass, node proxy, postcss-px-to-vw
```
src
│  App.vue
│  main.js
│  router.js
│  store.js
│
├─api
│      douban.js
│      env.js
│      fetch.js
│      mUtils.js
│      request.js
│
├─assets
│  │  ball-triangle.svg
│  │  bimage1.jpg
│  │  bimage2.jpg
│  │  bimage3.jpg
│  │  douban-logo.png
│  │  logo.png
│  │  netease-logo.gif
│  │  profile-bg.jpg
│  │  timg.gif
│  │
│  └─fonts
│          iconfont.css
│          iconfont.eot
│          iconfont.js
│          iconfont.svg
│          iconfont.ttf
│          iconfont.woff
│          iconfont.woff2
│
├─common
│  └─css
│          normalize.css
│          swiper.css
│
├─components
│      detail-comments.vue
│      douban-tabbar.vue
│      loading.vue
│      mainbar.vue
│      movie-cell.vue
│      movie-list.vue
│      navbar.vue
│
└─views
    │  Celebrity.vue
    │  Citylist.vue
    │  Douban.vue
    │  Entrance.vue
    │  Main.vue
    │  movie-detail.vue
    │  Netease.vue
    │
    ├─Profile
    │  │  index.vue
    │  │
    │  └─children
    │          login.vue
    │          logout.vue
    │
    └─Recommend
        │  index.vue
        │
        └─components
                skeleton.vue
```
/* 
TODO:
    即将上映页的bug     solved
    推荐页的骨架屏     finished
    profile的折叠头
    理解懒加载，节流，防抖等的原理，使用vue-lazyload

    webpack & vue.config.js 配置开发
    配置开发和发布api路径    finished

    说明
    解决接口问题，上线部署     finished

    403 catch
    个人页      finished
    推荐页（轮播窗还原）    finishied
    登陆    finished
    搜索    *做不了了...api挂了
    本地存储    fi...finished?
    抽象合并，进一步重构
    webpack打包
 */
