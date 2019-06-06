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

export default {
    components: {
        tabbar
    },
    data () {
        return {
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
    }
    
}

</script>
<style lang='scss'>
</style>    