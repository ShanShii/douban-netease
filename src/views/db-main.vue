<!-- main -->
<template>
    <div class="db-main">
        <mainbar></mainbar>
        <main class="movie">
            <van-tabs class="movie-tabs" v-model="active" sticky :line-width="190" color="#07d714">
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
                    <!-- 我明白了，有滚动条的才能监听到scroll -->
                    <section id="coming-parent" class="movie-list-wrapper" @scroll="onScroll">
                        <van-list
                            v-model="comingSoonLoading"
                            :finished="comingSoonfinished"
                            finished-text="没有更多了"
                            @load="getComingSoonMovies"
                            >
                            <movie-list :data="comingSoonMovies" movieListType="comingSoon"
                            ></movie-list>
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

        // 检测scroll事件,实现comingSoon中date吸顶效果
        // 这里父子组件交互太多了，用到太多子组件中的东西，不太直观，应该吧section中的都封装到movie-list中
        // 先这样吧...
        onScroll() {
            console.log(1)
            let items = document.getElementsByClassName("coming-soon-wrapper"), // 电影cell elements
                dates = document.getElementsByClassName("movie-date"), // movie-date elements
                parent = document.getElementById("coming-parent"), 
                tops = [], // offsetTop 高度存储
                height = parent.offsetTop; // 吸顶的位置/top高度
            // 获取即将上映中的单元高度
            for (let item of items) {
                tops.push(item.offsetTop-dates[0].clientHeight) // 减去movie-date高度
            }
            // tops找到第一个小于scrollTop的index
            let index = tops.length - tops.reverse().findIndex(top => {
                return top <= parent.scrollTop
            })-1;
            // 为其他cell去除style
            for(let i = 0; i < dates.length; i++) {
                console.log(i)
                if(i !== index) dates[i].removeAttribute('style')
            }
            // 设置吸顶
            dates[index].setAttribute('style', `position: fixed; top: ${height}px; z-index: 1;`)
        }
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
    // 这里修改是应为van-tabs的tab__wrap z-index=99 太高了，导致两个头一直显示，影响后面的popUp
    z-index: 0; 
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