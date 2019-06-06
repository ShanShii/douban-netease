<!-- main -->
<template>
    <div class="db-main">
        <mainbar @switchLocation="getCityMovie"></mainbar>
        
        <main class="movie">
            <van-tabs class="movie-tabs" v-model="active" sticky swipeable
              :line-width="190" color="#07d714">
              
                <van-tab title="正在热映">
                    <section class="movie-list-wrapper">
                        <!-- <van-pull-refresh
                        v-model="inTeatersRefreshing"
                        @refresh="onRefresh(0)"
                        > -->
                            <van-list
                                v-model="inTheatersLoading"
                                :finished="inTheatersfinished"
                                finished-text="没有更多了"
                                @load="getInTheatersMovies"
                                >
                                <movie-list :data="inTheatersMovies"></movie-list>
                            </van-list>
                        <!-- </van-pull-refresh> -->
                    </section>
                </van-tab>

                <van-tab title="即将上映">
                    <!-- 我明白了，有滚动条的才能监听到scroll -->
                    <section id="coming-soon" class="movie-list-wrapper" @scroll="onScroll">
                        <van-list
                            v-model="comingSoonLoading"
                            :finished="comingSoonfinished"
                            finished-text="没有更多了"
                            @load="getComingSoonMovies"
                            >
                            <movie-list :data="comingSoonMovies" movieListType="comingSoon"></movie-list>
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
        // 判断资源是否全部加载
        checkMore (res) {
            return (!res.subjects.length || res.start + res.count > res.total);
        },

        // 切换城市重新获取热映电影
        getCityMovie() {
            this.inTheatersMovies = []
            this.inTheatersIndex = 0
            this.inTheatersLoading = false
            this.inTheatersfinished = false
            // console.log(this.inTheatersMovies)
            this.getInTheatersMovies()
            // console.log('city')
        },
        getInTheatersMovies() {
            if(this.location === '') return ;   // 未获取城市时显示加载状态，不加载电影列表
            let params = {
                // replace切除
                city: this.location.replace(/省|市|自治区|特别行政区|壮族|回族|维吾尔/g,""),
                start: this.inTheatersIndex,
                count: 10,
            }
            if(this.inTheatersIndex === 0) this.inTheatersMovies = [];
            getInTheaters(params).then(res => {
                // console.log('index', this.inTheatersIndex)
                this.inTheatersIndex += res.count;
                this.inTheatersMovies.push(...res.subjects);
                this.inTheatersLoading = false;
                this.inTheatersfinished = this.checkMore(res);
            }).catch(err => console.log(err))
        },


        getComingSoonMovies() {
            let params = {
                start: this.comingSoonIndex,
                count: 100,     // 10->100 获取多月信息*根据api反馈，100基本上是所有了，后面月份筛选实现的最简单方法
                                // d但是这样加载时间边长了，效果比较差
                                // 如果还是10个10个获取的话也可以，模拟触发ComingSoon就行了，不过还要做月份判断，很麻烦
            }
            getComingSoon(params).then(res => {
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
            let items = document.getElementsByClassName("coming-soon-wrapper"), // 电影cell elements
                dates = document.getElementsByClassName("movie-date"), // movie-date elements
                parent = document.getElementById("coming-soon"), 
                tops = [], // offsetTop 高度存储
                height = parent.offsetTop; // 吸顶的位置/top高度
            // 获取即将上映中的单元高度
            for (let item of items) {
                tops.push(item.offsetTop-dates[0].clientHeight) // 减去movie-date高度
            }
            // tops找到第一个小于scrollTop的index
            console.log(parent.scrollTop-20, tops[0])
            let index = tops.length - tops.reverse().findIndex(top => {
                return top < parent.scrollTop-20
            })-1;
            console.log('*', index)
            // 为其他cell去除style
            for(let i = 0; i < dates.length; i++) {
                if(i !== index) dates[i].removeAttribute('style');
            }
            if(index < 0 || index >= tops.length) return ;
            // 设置吸顶
            // height-1+30 30px为filter-sort-items的高度，-x微调
            dates[index].setAttribute('style', `position: fixed; top: ${height+40-3}px; z-index: 1;`);
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