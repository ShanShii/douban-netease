<!-- douban主承载页 -->
<template>
    <div id="douban">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        
        <tabbar :pos="index"></tabbar>
        <div id="allmap"></div>
    </div>
</template>

<script>
import tabbar from '../components/douban-tabbar'
import fetch from '../api/fetch'
export default {
    components: {
        tabbar
    },
    data () {
        return {
            url: null
        }
    },
    computed: {
        index() {
            // 通过路由名传active值,实现和tabbar的回退联动
            let route = {
                main: 0,
                recommend: 1,
                mine: 2,
            }
            return route[this.$route.name];
        }
    },
    mounted() {
         console.log(fetch('/v1/captchas', {},'POST').then(res => {
             console.log(res)
             this.url = res.code;
         }))
    },
}

</script>
<style lang='scss'>
</style>    