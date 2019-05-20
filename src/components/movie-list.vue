<!-- movie-list电影简介单元格 -->
<template>
    <div class="movie-list">
        <!-- comingSoon中的按月排序，四个button（all, 5, 6, 7 | 时间，热度），有点像购物车 -->
        <div class="sort-items" v-if="movieListType === 'comingSoon'" v-cloak>
            <!-- 事件委托用上了要 -->
            <ul class="filters-left">
                <li class="filter">全部</li>
                <!-- v-show加强体验 -->
                <li class="filter" v-show="month">{{ month }}月</li>
                <li class="filter" v-show="month">{{ (month+1)%13==0?1:(month+1)%13 }}月</li>
                <li class="filter" v-show="month">{{ (month+2)%13==0?1:(month+2)%13 }}月</li>
            </ul>
            <ul class="filters-right">
                <li class="filter">时间</li>
                <li class="filter">热度</li>
            </ul>
        </div>
        <div class="movie-wrapper"  :class="{ 'coming-soon-wrapper': movieListType}"
          v-for="(item, index) in movies" :key="index">
          <!-- 当为comingSoon时,↑index=pubdate,因为此时movies是一个对象 -->
            <!-- 电影上映日期，只有“即将上映”中有 -->
            <template v-if="movieListType === 'comingSoon'">
                <div class="movie-date">
                    {{ index }}
                </div>
                <div class="coming-soon">
                    <div v-for="(movie, index) in item" :key="index" class="last-child-wrapper">
                        <movie-cell :item="movie" type="comingSoon"></movie-cell>
                    </div>
                </div>          
            </template>
            <movie-cell v-else
                :item="item"></movie-cell>
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
                let group = {};
                for (let item of this.data) {
                    let date = item.mainland_pubdate
                    if(date === '') continue
                    if(!group[date]) group[date] = []
                    group[date].push(item)
                }
                return group
            }
        },
        month() {
            // 获取月份
            if(this.data.length > 0 && this.movieListType === 'comingSoon') {
                return parseInt(this.data[0].mainland_pubdate.slice(5, 7))
            } else return null
        }
    },
    methods: {
        // 筛选功能，待完成
    },
    mounted() {
    }
}

</script>
<style lang='scss'>
[v-cloak] {
    display: none !important;
}
.sort-items {
    display: flex;
    height: 20px;
    padding: 5px;
    font-size: 12px;
    line-height: 20px;
    justify-content: space-between;
    .filters-left, .filters-right {
        display: flex;
        .filter {
            position: relative;
            padding: 0 5px;
        }
    }
    .filters-right li:first-child::before {
        content: '';
        height: 0;
        width: 0;
        // 这里position之后就找不到了，不知道为啥，暂时用padding
        // position: absolute;
        // left: 5px;
        padding: 1px 5px;
        border-left: 1px solid black;
    }
}

.movie-wrapper {
    position: relative;
    .coming-soon {
        margin-top: 25px;
    }

    .movie-date {
        position: absolute;
        top: -25px;     // movie-date的位置
        height: 25px;
        width: 100vw;
        padding: 0 15px;
        font-size: 13.5px;
        line-height: 25px;
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