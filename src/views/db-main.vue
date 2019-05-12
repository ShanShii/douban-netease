<!-- main -->
<template>
    <div class="db-main">
        <mainbar></mainbar>
        <main class="movie">
            <van-tabs class="movie-tabs" v-model="active" sticky :line-width="175" color="#07d714">
                <section class="movie-list-wrapper">
                    <van-tab title="正在热映">
                        <van-list
                            v-model="inTheatersLoading"
                            :finished="inTheatersfinished"
                            finished-text="没有更多了"
                            @load="getInTheatersMovies"
                            >
                            <movie-list :data="inTheatersMovies"></movie-list>
                        </van-list>
                    </van-tab>
                </section>
                <van-tab title="即将上映">
                    <section class="movie-list-wrapper">
                        <van-list
                            v-model="comingSoonLoading"
                            :finished="comingSoonfinished"
                            finished-text="没有更多了"
                            @load="getComingSoonMovies"
                            >
                            <movie-list :data="comingSoonMovies"></movie-list>
                        </van-list>
                    </section>
                </van-tab>
            </van-tabs>
        </main>
    </div>
</template>

<script>
import movieList from '@/components/movie-list'
import mainbar from '../components/mainbar'
import {
    getInTheaters,
    getComingSoon,
} from '@/api/douban.js'
import { mapState } from 'vuex';

export default {
    components: {
        mainbar, movieList
    },
    data () {
        return {
            active: 0,
            inTheatersMovies: [],   // 正在热映 电影列表
            inTheatersIndex: 0,     //当前加载位置
            inTheatersLoading: false,   
            inTheatersfinished: false,  //vant-list组件属性，判断加载中和是否已加载结束

            comingSoonMovies: [],   // 即将上映 电影列表
            comingSoonIndex: 0,     // 即将上映,当前加载位置
            comingSoonLoading: false,   
            comingSoonfinished: false,
        };
    },
    computed: {
        ...mapState([
            'location'
        ])
    },
    methods: {
        // 判断资源是否加载完成
        checkMore (res) {
            return (!res.subjects.length || res.start + res.count > res.total);
        },
        getInTheatersMovies() {
            let params = {
                city: this.location,
                start: this.inTheatersIndex,
                count: 10,
            }
            getInTheaters(params).then(res => {
                // console.log(res);
                this.inTheatersIndex += res.count;
                this.inTheatersMovies.push(...res.subjects);
                this.inTheatersLoading = false;
                this.inTheatersfinished = this.checkMore(res);
            })
        },
        getComingSoonMovies() {
            let params = {
                start: this.comingSoonIndex,
                count: 10,
            }
            getComingSoon(params).then(res => {
                // console.log(res);
                this.comingSoonIndex += res.count;
                this.comingSoonMovies.push(...res.subjects);
                this.comingSoonLoading = false;
                this.comingSoonfinished = this.checkMore(res);
            })
        },
    },
    mounted () {
    }
}

</script>
<style lang='scss' scoped>
.movie-tabs {
    position: relative;
    margin-top: 50px;
    width: 100%;
    .movie-list-wrapper {
        position: fixed;
        top: 94px;
        bottom: 45px;
        left: 0;
        right: 0;
        overflow-x: hidden;
        overflow-y: auto;
    }
}
</style>