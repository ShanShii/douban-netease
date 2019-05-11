<!-- douban主承载页 -->
<template>
    <div id="douban-main">
        <mainbar></mainbar>

        <div class="wrapper">
            <van-list
                v-model="top250Loading"
                :finished="top250finished"
                finished-text="没有更多了"
                @load="getTop250Movies"
                >
                <movieList :data="top250Movies"></movieList>
            </van-list>
        </div>
        <tabbar></tabbar>
        <div id="allmap"></div>
    </div>
</template>

<script>
import tabbar from '../components/douban-tabbar'
import mainbar from '../components/mainbar'
import movieList from '@/components/movie-list'
import {
    getMovieList,
} from '@/api/douban.js'

export default {
    components: {
        tabbar, mainbar, movieList
    },
    data () {
        return {
            top250Movies: [],
            top250Index: 0,     //当前加载位置
            top250Loading: false,   
            top250finished: false,  //vant-list组件属性，判断加载中和是否已加载结束
        }
    },
    computed: {
    },
    methods: {
        // 判断资源是否加载完成
        checkMore (res) {
            return (!res.subjects.length || res.start + res.count > res.total);
        },
        getTop250Movies() {
            let params = {
                start: this.top250Index,
                count: 10
            }
            getMovieList(params).then(res => {
                // console.log(res);
                this.top250Index += res.count;
                this.top250Movies.push(...res.subjects);
                this.top250Loading = false;
                this.top250finished = this.checkMore(res);
            })
        },
    },
    mounted () {
        this.getTop250Movies();
    }
}

</script>
<style lang='scss'>
</style>    