<!-- tab2，电影推荐页 -->
<template>
    <div class="db-recommend">
        <van-search class="search" placeholder="请输入搜索关键词" v-model="searchValue" />
        <main class="recommend-wrapper">
            <van-list
                v-model="top250Loading"
                :finished="top250finished"
                finished-text="没有更多了"
                @load="getTop250Movies"
                >
                <movie-list :data="top250Movies"></movie-list>
            </van-list>
        </main>
    </div>
</template>

<script>
import movieList from '@/components/movie-list'
import {
    getMovieList,
} from '@/api/douban.js'

export default {
    components:{
        movieList
    },
    data () {
        return {
            searchValue: '',
            top250Movies: [],
            top250Index: 0,     //当前加载位置
            top250Loading: false,   
            top250finished: false,  //vant-list组件属性，判断加载中和是否已加载结束
        };
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
        }
    },
    mounted () {
    }
}

</script>
<style lang='scss' scoped>
.db-recommend {
    .search {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        z-index: 1;
        border-bottom: 1px solid #ebedf0;
    }
    .recommend-wrapper {
        margin-top: 50px;
    }
}
</style>