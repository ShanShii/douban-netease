<!-- movie-list电影简介单元格 -->
<template>
    <div class="movie-list">
        <!-- comingSoon中的按月排序，四个button（all, 5, 6, 7 | 时间，热度），有点像购物车 -->
        <div class="sortByMonth" v-if="movieListType === 'comingSoon'">
            {{123}}
        </div>
        <div class="movie-wrapper"  :class="{ 'coming-soon-wrapper': movieListType}"
          v-for="(item, index) in movies" :key="index">
          <!-- ↑index=pubdate,当为comingSoon时,因为此时movies是一个对象 -->
            <!-- 电影上映日期，只有“即将上映”中有 -->
            <template v-if="movieListType === 'comingSoon'"> 
                <div class="movie-date">
                    {{ index }}
                </div>
                <div class="coming-soon">
                    <div v-for="(movie, index) in item" :key="index">
                        <movie-cell :item="movie"></movie-cell>
                    </div>
                </div>          
            </template>
            <movie-cell v-else :item="item"></movie-cell>
        </div>
        
    </div>
</template>

<script>
import movieCell from './movie-cell'

export default {
    name: "movieList",
    components: {
        movieCell
    },
    props: {
        data: {
            type: Array,
            default: () => {
                return []
            }
        },
        movieListType: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
        };
    },
    computed: {
        // comingSoon电影分组，返回一个key为日期的对应对象，没有mainland_pubdate的先过滤掉
        // 由于comingSoon的list实现比较不一样,所以讲movie-cell拆分了出来
        movies() {
            if(! this.movieListType) return this.data
            else {
                let group = {}
                for (let item of this.data) {
                    let date = item.mainland_pubdate
                    if(date === '') continue
                    if(!group[date]) group[date] = []
                    group[date].push(item)
                }
                return group
            }
        }
    },
    methods: {
    },
    mounted() {
    }
}

</script>
<style lang='scss'>
.movie-wrapper {
    position: relative;
    .coming-soon {
        margin-top: 30px;
    }

    .movie-date {
        position: absolute;
        top: -30px;
        height: 30px;
        width: 100vw;
        padding: 0 7px;
        font-size: 13.5px;
        line-height: 30px;
        color: gray;
        background-color: #ebedf0;
    }
    .movie-item {
        display: flex;
        img {
            height: 150px;
            width: 110px;
            flex: none;
        }

        .caption {
            flex: auto;
            width: calc(100% - 100px - 10px);
            margin-left: 10px;
            .title {
                font-size: 16px;
                line-height: 0;
                font-weight: bold;
            }
            .rate {
                display: flex;
                margin-bottom: 5px;
                line-height: 3.4vw; // 这里不改半星位置会偏移...vant的问题
                span {
                    font-size: 11px;
                    line-height: 14px;
                    margin-left: 5px;
                }
            }

            .info {
                color: gray;
                font-size: 13px;
                line-height: 1.6em;
            }
        }
    }
}
</style>