<!-- 电影详情页 -->
<template>
    <div id="movie-detail" v-if="loaded" ref="parent" @scroll="onScroll">
        <!-- 导航栏 -->
        <navbar ref="nav"
            :title="sclTop<=top ? '电影':movie.title"
            :flag="sclTop<=top? true:false"
            :color="deep? 'white':'black'"></navbar>
            <!-- title: navbar标题; flag: 判断高低变换标题; color: 根据背景颜色设置navbar 字体颜色 -->
        <!-- 海报 -->
        <div class="movie-image" ref="movieImage">
            <img :src="movie.images.medium" alt="poster">
        </div>
        <!-- 电影详情主体 -->
        <main class="movie" ref="main">
            <!-- 描述 -->
            <section class="movie-desc">
                <div class="caption">
                    <div class="title">
                        {{ movie.title }}
                    </div>
                    <div class="info">
                        <span>{{ movie.year }}</span>
                        <span v-for="(item, index) in movie.genres" :key="index">
                            {{'/ ' + item }}
                        </span>
                        <p>原名：{{ movie.original_title }}</p>
                        <p>上映时间：{{ movie.pubdates[1]?movie.pubdates[1]:movie.pubdates[0] }}</p>
                        <p>片长：{{ movie.durations[0] }}</p>
                    </div>
                </div>
                <!-- 评分 -->
                <div class="rating">
                    <p class="rating-title">豆瓣评分</p>
                    <template v-if="stars > 0">
                        <span class="rating-average">{{ movie.rating.average.toFixed(1) }}</span>
                    </template>
                    <van-rate class="rating-stars" v-model="stars" :size="10" allow-half readonly/>

                    <p class="watched" v-if="stars > 0">{{ movie.ratings_count }}人</p>
                    <span class="rating-none" v-else>暂无评分</span>
                </div>
            </section>

            <!-- 想看/看过 -->
            <div class="selection">
                <van-button class="want" plain type="warning">想看</van-button>
                <van-button class="watched" plain type="warning">
                    看过 <span font-size="16px">☆ ☆ ☆ ☆ ☆</span>
                </van-button>
            </div>

            <!-- 简介 -->
            <section class="movie-summary">
                <span class="title">简介</span>
                <p class="main hide" ref="summary">{{ movie.summary }}</p>
                <span class="spread" ref="spread" @click="spread">展开</span>
            </section>

            <!-- 影人 -->
            <section class="movie-casts">
                <p class="title">影人</p>
                <div class="casts-wrapper">
                    <template v-for="(items) in [movie.directors, movie.casts]">
                        <figure class="cast-item" v-for="(item) in items" :key="item.id" @click="entryCelebrity(item.id)">
                            <img :src="item.avatars?item.avatars.small:failImg" alt="cast_pic">
                            <figcaption>
                                <p class="name">{{ item.name }}</p>
                                <p>{{items===movie.directors?"导演" : "演员"}}</p>    
                            </figcaption>
                        </figure>                        
                    </template>
                </div>
            </section>
            <!-- 预告片/剧照 | 403forbidden拿不到....-->
            <!-- <img :src="movie.photos.image" alt="."> -->
            <!-- 评论区 -->
            <comments :comments="movie.popular_comments" :reviews="movie.popular_reviews"></comments>    
        </main>

    </div>
</template>

<script>
import {
    getMovieDetail
} from '../api/douban'
import analyze from 'rgbaster'
import comments from '@/components/detail-comments.vue'
import navbar from '@/components/navbar.vue'

export default {
    props: [
        'movieId'    // 路由组件query传参
    ],
    components: {
        comments,
        navbar
    },
    data () {
        return {
            failImg: require('@/assets/timg.gif'),
            movie: null,
            loaded: false,
            stars: 0,
            sclTop: 0,
            top: 0,
            deep: true
        };
    },
    computed: {
    },
    methods: {
        onScroll(e) {
            this.sclTop = e.target.scrollTop
            this.top = this.$refs.main.offsetTop
        },
        spread() {
            this.$refs.summary.classList.remove("hide")
            this.$refs.spread.classList.add("none")
        },
        entryCelebrity(id) {
            this.$router.push({name: 'celebrity', query:{
                celebrity_id: id
            }})
        },
        async getMovie() {
            this.movie = await getMovieDetail(this.movieId)
            // 分析图片主色设置背景色
            const result = await analyze(this.movie.images.medium, {
                ignore: [ 'rgb(255,255,255)', 'rgb(0,0,0)' ],
                scale: 0.5
            })
            console.log(`The dominant color is ${result[0].color} with ${result[0].count} occurrence(s)`)
            console.log(`The secondary color is ${result[1].color} with ${result[1].count} occurrence(s)`)
            this.loaded = true  // 做一个loading
            this.$nextTick(() => {
                let [r, g, b] = result[10].color.slice(4, -1).split(',')
                if(r*0.299 + g*0.578 + b*0.114 >= 192)
                { //浅色
                    this.deep = false
                }
                else
                {  //深色
                    this.deep = true
                }
                this.$refs.movieImage.style.backgroundColor = `${result[10].color}`
                // console.log(this.$refs)
                // 子组件navbar 的 ref = VueComponent 打印出来就知道怎么用了，加个$el
                this.$refs.nav.$el.style.backgroundColor = `${result[10].color}`
                this.stars = this.movie.rating.stars*0.1
            })
        }
    },
    mounted() {
        this.getMovie();
    }
}

</script>
<style lang='scss' scoped>
.none {
    display: none;
}


@mixin inner-padding {
    width: calc(100%-30px);
    padding: 15px;
}
#movie-detail {
    /* 子组件中产生滚动条以便监听 */
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    p {
        margin: 1px 0;
    }
    .movie-image {
        position: relative;
        height: 400px;
        padding-top: 30px;
        text-align: center;
        line-height: 400px;
        img {
            margin: 0 auto;
            vertical-align: middle;
            height: 330px;
        }
    }
    .movie {
        &-desc {
            @include inner-padding();
            display: flex;
            /* 电影描述 */
            .caption {
                width: 70%;
                .title {
                    font-size: 1.25em;
                    font-weight: bold;
                    margin-bottom: 15px;
                }
                .info {
                    color: gray;
                    font-size: 0.8em;
                }
            }
            /* 豆瓣评分 */
            .rating {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-content: center;
                width: 25%;
                height: 75px;
                padding: 5px;
                margin-left: 5px;
                text-align: center;
                color: gray;
                font-size: 0.8em;

                box-shadow: .5px .5px 5px;
                &-title {
                    width: 100%;
                }
                &-average {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: black;
                }
                &-stars {
                    line-height: 2.4vw;
                }
            }
        }

        /* 想看/看过 */
        .selection {
            padding: 0 15px;
            display: flex;
            padding-bottom: 15px;
            border-bottom: 1px solid gray;
            .van-button {
                height: 50px;
            }
            .want {
                width: 30%;
                margin-right: 10px;
            }
            .watched {
                flex: auto;
            }
        }

        /* 简介 */
        &-summary {
            @include inner-padding();
            position: relative;
            .title {
                display: block;
                color: gray;
                font-size: 0.8em;
                margin-bottom: 5px;
            }

            /* css line-clamp, firefox不兼容
            .main {
                margin: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical
            } */
            .main{
                margin: 0;
                font-size: 14px;
                color: #4A4A4A;
                line-height: 1.5em;
                position: relative;
                text-overflow: ellipsis;
            }

            /* hack技巧实现line-clamp展开操作 */
            .hide {
                overflow: hidden;
                height: 17.333vw;   /* height放到hide, 去除hide后框的高度自适应，解决文字超框显示问题 */
            }
            .hide::after {
                content: '';
                text-align: center;
                position: absolute;
                bottom: 0;
                right: 0;
                width: 18%;
                height: 1.8em;
                background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%);
            }
            .spread {
                font-size: 12px;
                color: forestgreen;
                position: absolute;
                right: 20px;
                bottom: 19px;
            }
        }
        /* 影人 */
        &-casts {
            @include inner-padding();
            padding-top: 5px;
            color: gray;
            font-size: 0.85em;
            .title {
                padding-bottom: 10px;
            }
            .casts-wrapper {
                display: flex;
                height: 200px;
                overflow-x: scroll;
                overflow-y: hidden;
                text-align: center;
                figure {
                    margin: 0 5px 0 0;
                }
                img {
                    max-width: 120px;
                    height: 150px;
                }
                .name {
                    width: 102px;
                    font-size: 16px;
                    color: black;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>