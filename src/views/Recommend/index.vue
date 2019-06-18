<!-- tab2，电影推荐页 -->
<template>
    <div class="db-recommend">
        <van-search class="search" placeholder="请输入搜索关键词" v-model="searchValue" />
        <main v-if="loaded">
            <!-- 新片榜，两行的gird 一行6个，共12个，不够点击查看全部 -->
            <div class="new">
                <div class="new-title">
                    <span>新片榜</span>
                    <span class="new-title-right">共12部</span>
                </div>
                <div class="movies">
                    <template v-for="(item, index) in movies.new">
                        <div class="movie" :key="item.id" @click="entryMovieDetail(item.id)">
                            <img :src="item.images.small" alt="movie poster">
                            <p class="title">{{ item.title }}</p>

                            <!-- rating评分 -->
                            <template v-if="item.rating.average > 0">
                                <van-rate class="rating-stars" v-model="stars.new[index]" :size="12" allow-half readonly/>
                                <span class="rating-num">{{ item.rating.average.toFixed(1) }}</span>
                            </template>
                            <span class="rating-num" v-else>暂无评分</span>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 口碑/北美/top250 slider -->
            <div class="billboard">
                <div class="billboard-title">豆瓣榜单</div>
                    <!-- swiper组件 -->
                <swiper :options="swiperOption">
                    <!-- :style="{background: `url(${movies[name][0].images.medium})`}" -->
                    <swiper-slide v-for="(name, i) in boardNames" :key="name">
                        <!-- :style="{background: `url(${movies[name][0].images.medium}) cover`}"效果不好，弃用 -->
                        <div class="billboard-box">
                            <div class="billboard-head" :class="setHeadImage(i)">
                                <span class="title">{{ boardTitles[i] }}</span>
                            </div>

                            <!-- 电影榜单排名1-4 -->
                            <div class="billboard-bd" v-for="index in 4" :key="index">
                                    <!-- 电影描述主体 -->
                                <van-cell  @click="entryMovieDetail(movies[name][index-1].id)">
                                    <div class="movie-item">
                                        <span class="order">{{ index }}</span>
                                        <img :src="movies[name][index-1].images.small" alt="Movie Image">

                                        <!-- 电影信息描述 -->
                                        <div class="caption">
                                            <p class="title">{{ movies[name][index-1].title }}</p>
                                                <!-- 评分&观看人数 -->
                                            <div class="rate">
                                                <template v-if="stars[name][index-1] > 0">
                                                    <!-- stars: this.item.rating.stars*0.1 -->
                                                    <van-rate v-model="stars[name][index-1]" :size="12" allow-half readonly/>
                                                    <span>{{ movies[name][index-1].rating.average.toFixed(1) }}</span>
                                                </template>
                                                <template v-else>
                                                    <span font-size="12px" color="grey">暂无评分</span>
                                                </template>
                                            </div>
                                            <div v-if="movies[name][index-1].collect_count" class="has-watched">{{ movies[name][index-1].collect_count }}人看过</div>
                                        </div>

                                        <!-- 排名上升/下降趋势 -->
                                        <i v-if="name === 'usBox' || name === 'weekly'" class="iconfont" :class="iconClass(delta[name][index-1])"></i>
                                    </div>
                                </van-cell>
                            </div>

                            <!-- view-more -->
                            <div class="view-more" @click="toggleBillboard(name)">查看所有{{ name==='top250'?250:movies[name].length }}部</div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>


            <!-- navbar放popup会产生滑动，暂时不知道为啥 -->
            <van-nav-bar fixed left-arrow @click-left="toggleBillboard" class="nav"
                v-if="billboardShow">
                <span slot="title">
                    <span>{{ boardTitles[boardNames.indexOf(boardName)] }}</span>
                </span>    
            </van-nav-bar>
            <van-popup class="popup" v-model="billboardShow" position="right">
                <template v-for="name in boardNames">
                    <!-- top250 只渲染boardName榜单-->
                    <van-list :key="name" v-if="name === 'top250' && name === boardName"
                        v-model="top250Loading"
                        :finished="top250finished"
                        finished-text="没有更多了"
                        @load="getTop250Movies"
                        class="popup-list"
                        >
                        <movie-list :data="movies[name]"></movie-list>
                    </van-list>
                    <!-- 口碑/北美/新片榜 固定长度无加载 -->
                    <template  v-else>
                        <movie-list class="popup-list" :key="name" :data="movies[name]" v-if="name === boardName"></movie-list>
                    </template>
                </template>
            </van-popup>
        </main>

        <skeleton v-else />

    </div>
</template>

<script>
import movieList from '@/components/movie-list'
import skeleton from './components/skeleton'
import {
    getMovieList,
    getWeeklyList,
    getUsBoxList,
    getNewList
} from '@/api/douban.js'

import '@/common/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    components:{
        movieList,
        skeleton,
        swiper,
        swiperSlide
    },
    data () {
        return {
            loaded: false,

            swiperOption: {
                slidesPerView: 'auto',
                spaceBetween: 15,
            },

            searchValue: '',
            billboardShow: false,   // popup show
            boardName: null,        // popup中渲染表单的名称,对应names
            boardNames: ['top250', 'weekly', 'usBox'],
            boardTitles: ['豆瓣Top250', '一周口碑电影榜', '北美票房榜'],

            // top250Movies: [],
            top250Index: 0,     //当前加载位置
            top250Loading: false,
            top250finished: false, //vant-list组件属性，判断加载中和是否已加载结束
            movies: {
                top250: [], // top 250
                weekly: [], // 一周口碑榜
                usBox: [],  // 北美票房榜
                new: []     // 新片榜
            },
            stars: {
                top250: [], // top 250
                weekly: [], // 一周口碑榜
                usBox: [],  // 北美票房榜
                new: []     // 新片榜
            },
            delta: {    // weekly&usbox 排名上升/下降趋势
                weekly: [],
                usBox: []
            }
        };
    },
    methods: {
        iconClass(delta) {
            return delta > 0 ? 'iconshangsheng' : (delta === 0 ? 'iconping' : 'iconxiajiang')
        },
        // 设置榜单头图片，返回一个class
        setHeadImage(index) {
            return `head-image${index+1}`
        },

        // 点击榜单块内电影进入详情页路由
        entryMovieDetail(id) {
            this.$router.push({name: 'movie', query: {
                movie_id: id
            }})
        },

        toggleBillboard(name) {
            this.boardName = name
            this.billboardShow = !this.billboardShow
        },
        // 判断资源是否加载完成
        checkMore (res) {
            return (!res.subjects.length || res.start + res.count > res.total);
        },

        // top250 updated: 异步之后不会存在提前渲染问题（报错电影信息undefined）了
        // 但提前渲染怎么出来的我还是有点不太明白，明明已经检验所有数据都拿到再打印1然后更改loaded开始渲染的（getBoardMovies里的检验方法）
        async getTop250Movies() {
            let params = {
                start: this.top250Index,
                count: 10
            }
            
            await getMovieList(params).then(res => {
                // console.log(res);
                this.top250Index += res.count;
                this.movies.top250.push(...res.subjects);
                this.stars.top250.push(...res.subjects.map(item => item.rating.stars*0.1))
                this.top250Loading = false;
                this.top250finished = this.checkMore(res);
            })
        },

        // 口碑/北美/新片榜
        async getBoardMovies() { // 榜单不一样数据格式有些不同 
            await getNewList().then(res => {
                this.movies.new = res.subjects
                this.stars.new = res.subjects.map(item => item.rating.stars*0.1)
            })
            await getWeeklyList().then(res => {
                this.movies.weekly = res.subjects.map(item => item.subject)
                this.delta.weekly = res.subjects.map(item => item.delta)
                this.stars.weekly = this.movies.weekly.map(item => item.rating.stars*0.1)
            })
            await getUsBoxList().then(res => {
                this.movies.usBox = res.subjects.map(item => item.subject)
                this.delta.usBox = res.subjects.map(item => item.new?1:-1)
                this.stars.usBox = this.movies.usBox.map(item => item.rating.stars*0.1)
            })
            await this.getTop250Movies();
            // if(this.movies.weekly && this.movies.new && this.movies.usBox && this.movies.top250) console.log(1)
            this.loaded = true;
        }
    },
    mounted () {
        this.getBoardMovies()
    }
}

</script>
<style lang='scss' scoped>
.swiper-slide {
    width: 80%;
}
.swiper-slide:last-child {
    width: 100%;
}
.db-recommend {
    margin: 50px 0;
    .search {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        z-index: 3;
        background-color: #fff;
        border-bottom: 1px solid #ebedf0;
    }

    .new {
        padding: 10px 10px 0 10px;
        &-title {
            display: flex;
            justify-content: space-between;
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            font-weight: bold;
            &-right {
                font-size: 12px;
                color: gray;
                font-weight: normal;
            }
        }
        .movies {
            display: grid;
            grid-template-columns: repeat(6, 120px);
            grid-template-rows: repeat(2, 50%);
            grid-row-gap: 5px;
            overflow-x: auto;
            overflow-y: hidden;
            p {margin: 0; padding: 0;}
            .movie {
                width: 120px;
                margin-right: 5px;
                .title {
                    height:18px;
                    font-size: 14px;
                    font-weight: bold;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
                img {
                    width: 110px;
                    height: 150px;
                }
                .rating-stars {
                    display: inline-block;
                    line-height: 3.4vw;
                    margin-right: 5px;
                }
                .rating-num {
                    font-size: 0.8em;
                    color: gray;
                }
            }
        }
    }

    .nav {
        height: 45px;
        z-index: 9999 !important;
    }
    .popup {
        width: 94%;
        height: 100%;
        padding: 0 3%;
        &-list {
            margin-top: 45px;
        }
    }

    .billboard {
        &-title {
            padding: 0 10px; 
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            font-weight: bold;
        }
        &-head {
            height: 120px;
            position: relative;
            .title {
                position: absolute;
                top: 15px;
                left: 15px;
                font-weight: bold;
            }
        }
        &-box {
            border-radius: 30px;
            border: 1px solid gray;
            overflow: hidden;
            margin: 10px;
        }

        @mixin head-image($imageUrl, $posX, $posY) {
            background: url($imageUrl) $posX $posY;
            background-size: cover;
        }
        .head-image1 {
            @include head-image (
                $imageUrl: "../../assets/bimage1.jpg",
                $posX: 15%,
                $posY: 19%
            );
            color: #fff;

        }
        .head-image2 {
            @include head-image (
                $imageUrl: "../../assets/bimage2.jpg",
                $posX: 15%,
                $posY: 64%
            );
        }
        .head-image3 {
            @include head-image (
                $imageUrl: "../../assets/bimage3.jpg",
                $posX: 15%,
                $posY: 52%
            );
            color: #fff;
        }
    }

    /deep/ .van-cell {
        // 清除默认格式
        line-height: 1.25em;
        background-color: transparent;
    }

    .movie-item {
        display: flex;
        $box-height: 60px;
        img {
            height: $box-height;
            width: 45px;
            flex: none;
        }
        .order {
            font-size: 16px;
            margin-right: 10px;
        }
        .iconfont {
            font-size: 12px;
            color: gray;
            line-height: $box-height;
        }
        .caption {
            flex: auto;
            width: calc(100% - 100px - 10px);
            margin-left: 10px;
            height: 100%;
            .title {
                margin: 0;
                line-height: inherit;
            }
            .rate {
                display: flex;
                margin: 5px 0;
                line-height: 3.4vw; // 半星位置会偏移
                span {
                    font-size: 11px;
                    line-height: 14px;
                    margin-left: 3px;
                }
            }

            .has-watched {
                color: gray;
                font-size: 12px;
            }
        }
    }
    .view-more {
        height: 30px;
        font-size: 14px;
        color: gray;
        line-height: 30px;
        text-align: center;
    }
}
</style>