<!-- movie-list电影简介单元格 -->
<template>
    <div class="movie-list" :class="{ 'coming-soon-movie-list': movieListType}">
        <!-- comingSoon中的按月排序，四个button（all, 5, 6, 7 | 时间，热度），有点像之前写过的购物车 -->
        <div class="filter-sort-items" v-if="movieListType === 'comingSoon'">
            <!-- 事件委托用上了要 -->
            <ul class="filters-left" @click="onClick($event, 'filter')">
                <li class="filter" data-filter="'all'" :class="{active: active.filter==='all'}">全部</li>
                <!-- v-show加强体验,注入data-filter和下面的data-sort方便事件委托 -->
                <li class="filter" data-filter="1" v-show="month" :class="{active: active.filter==='1'}">{{ month }}月</li>
                <li class="filter" data-filter="2" v-show="month" :class="{active: active.filter==='2'}">{{ (month+1)%13==0?1:(month+1)%13 }}月</li>
                <li class="filter" data-filter="3" v-show="month" :class="{active: active.filter==='3'}">{{ (month+2)%13==0?1:(month+2)%13 }}月</li>
            </ul>
            <ul class="filters-right" @click="onClick($event, 'sort')">
                <li class="filter" data-sort="time" :class="{active: active.sort==='time'}">时间</li>
                <li class="filter" data-sort="heat" :class="{active: active.sort==='heat'}">热度</li>
            </ul>
        </div>

        <!-- 
            渲染 正在热映：
                数据：movies (Array)
            渲染 即将上映：
                数据：filterAndSortMovies (active.sort===time : 
                                                object:
                                                    {time1: {}, time2: {} ,...}
                                           active.sort===heat :
                                                Array:
                                                    [{}, {}, ...]
                                          )
         -->
        <div class="movie-wrapper"  :class="{ 'coming-soon-wrapper': movieListType}"
          v-for="(item, index) in (movieListType? filterAndSortMovies:movies)" :key="index">
          <!-- 当为comingSoon时,↑index=pubdate,因为此时movies是一个对象 -->
          <!-- 补充↑，sort为热度排序时，filter&sortMovies又变成了Array，所以index=>下表，时间tag=>item.mainland_pubdate -->
          <!-- 写的头皮发麻。。。感觉真实的开发跟后端协调下api就好了 -->
            <!-- 电影上映日期，只有“即将上映”中有 -->
            <template v-if="movieListType === 'comingSoon'">
                <div class="movie-date">
                    {{ active.sort==='time'? index : item.mainland_pubdate }}
                </div>
                <template v-if="active.sort==='time'" >
                    <div class="coming-soon">
                        <div v-for="(movie, index) in item" :key="index" class="last-child-wrapper">
                            <movie-cell :item="movie" type="comingSoon"></movie-cell>
                        </div>
                    </div>
                </template>

                <!-- 热度排序渲染 -->
                <template v-else >
                    <div class="coming-soon">
                        <movie-cell :item="item"></movie-cell>
                    </div>
                </template>
            </template>
            <!-- 正在热映电影各自 -->
            <movie-cell :item="item" v-else></movie-cell>
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
            // 两个active的抽象对象，不止这里，还有click事件的应用
            active: {
                filter: 'all',     // all/1/2/3 分别代表 全部 x x+1 x+2月 filter
                sort: 'time'       // time | heat => 时间 | 热度 排序
            }
        };
    },
    computed: {
        // comingSoon电影分组，返回一个key为日期的对应对象，没有mainland_pubdate的先过滤掉
        // 由于comingSoon的list实现比较不一样,所以将movie-cell拆分了出来
        movies() {
            if(! this.movieListType) return this.data
            else {
                // {date1:{}, date2:{}}
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
        filterAndSortMovies() {
            if(! this.month || ! this.movies || ! this.movieListType) return null
            let filter = this.active.filter
                ,sort = this.active.sort
                ,data = this.movies
                ,filterData = data  // 临时存储变量，下同
                ,sortData = []
                
            console.log(typeof data)
            // 神奇，object竟然能用filter！改完又不能了，但是控制台里能用，不知道为啥devtools里显示是Array
            if(filter !== 'all') {
                filterData = {}
                // 月份筛选，按原data中的key进行筛选
                Object.keys(data).forEach(key => {
                    if( parseInt(key.slice(5, 7)) === this.month+(filter-'1') ) {
                        filterData[key] = data[key]
                        // Object.assign(filterData, data[key])
                    }
                })
                data = filterData
                // data = data.filter(item => parseInt(item.mainland_pubdate.slice(5, 7)) === this.month+filter-1)
            }

            // 时间/热度排序，时间不用写，默认即是升序，热度排序不仅要拍，还要更改data的形式，从object=>array
            // 不然的话热度排序的时间tag不好写，渲染模板方法也要改一下
            if(sort === 'heat') {
                Object.values(data).forEach(item => {
                    sortData.push(...item)
                })
                sortData.sort((a, b) => {
                    return -(a.collect_count - b.collect_count)
                })
                data = sortData
            }
            return data
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
        onClick(event, type) {
            let tar = event.target
            if(tar.nodeName.toLowerCase() === 'li') {
                let active = tar.dataset[type]
                console.log(active, typeof active)
                this.active[type] = active
            }
        }
    },
    mounted() {
    }
}

</script>
<style lang='scss'>
.active {
    color: black;
}

.coming-soon-movie-list {
    position: relative;
    margin-top: 65px;
}
.filter-sort-items {
    display: flex;
    position: fixed;
    top: 93px; left: 0;
    height: 30PX; width: calc(100%-10px);
    padding: 5px;
    font-size: 14px;
    line-height: 30PX;
    color: gray;
    justify-content: space-between;
    z-index: 2;
    background-color: #fff;
    .filters-left, .filters-right {
        display: flex;
        .filter {
            position: relative;
            padding: 0 5px;
        }
    }

    /* 0.5px细线 */
    .filters-right li:first-child::before {
        content: "";
        pointer-events: none; /* 防止点击触发 */
        box-sizing: border-box;
        position: absolute;
        height: 20PX;
        left: -5PX;
        top: 4PX;
        // border-radius: 8px;
        border-left: 1px solid #999;
        -webkit-transform: scaleX(0.5);
        -webkit-transform-origin: 0 0;
        transform: scaleX(0.5);
        transform-origin: 0 0;
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