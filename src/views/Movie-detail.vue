<!-- 电影详情页 -->
<template>
    <div id="movie-detail" v-if="loaded">
        <van-nav-bar class="nav" fixed left-arrow
          @click-left="back"
          @click-right="share">
            <span slot="title" class="iconfont">
                <i class="iconfont iconPopcorn_A_px"></i>电影
            </span>
            <i class="iconfont iconshare" slot="right"></i>
        </van-nav-bar>
        
        <div class="movie-image" ref="movieImage">
            <img :src="movie.images.medium" alt="poster">
        </div>

        <main class="movie">
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

            <div class="selection">
                <van-button class="want" plain type="warning">想看</van-button>
                <van-button class="watched" plain type="warning">
                    看过 <span font-size="16px">☆ ☆ ☆ ☆ ☆</span>
                </van-button>
            </div>
            <section class="movie-summary">

            </section>
            <section class="movie-casts">

            </section>
            <section class="movie-photos">

            </section>
            <section class="comments">
                
            </section>
        </main>

    </div>
</template>

<script>
import {
    getMovieDetail
} from '../api/douban'
import analyze from 'rgbaster'

export default {
    props: [
        'movieId'    // 路由组件query传参
    ],
    data () {
        return {
            movie: null,
            loaded: false,
            stars: 0,
        };
    },
    methods: {
        back() {

        },
        share() {

        },
        async getMovie() {
            this.movie = await getMovieDetail(this.movieId)
            const result = await analyze(this.movie.images.medium, {
                ignore: [ 'rgb(255,255,255)', 'rgb(0,0,0)' ],
                scale: 0.5
            })
            console.log(`The dominant color is ${result[0].color} with ${result[0].count} occurrence(s)`)
            console.log(`The secondary color is ${result[1].color} with ${result[1].count} occurrence(s)`)
            this.loaded = true  // 做一个loading
            this.$nextTick(() => {
                this.$refs.movieImage.style.backgroundColor = `${result[10].color}`
                this.stars = this.movie.rating.stars*0.1
                // this.rating_count = Object.values(this.movie.rating.details).reduce((pre, cur) => pre+cur)
                // bgc.setAttribute('style', `background-color: ${result[10].color};`)
            })
        }
    },
    mounted() {
        this.getMovie();
    }
}

</script>
<style lang='scss' scoped>
.iconPopcorn_A_px {
    @extend .iconshare;
    left: 1px;
    font-size: 23px;
}
.iconshare {
    position: relative;
    top: 1px;
}

.nav {
    height: 46px;
    background-color: transparent;
    border: none;
    .van-icon, .iconfont {
        color: white;
    }
}
@mixin inner-padding {
    width: calc(100%-30px);
    padding: 15px;
}
#movie-detail {
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
            z-index: 1100;
        }
    }
    .movie {
        &-desc {
            @include inner-padding();
            display: flex;
            .caption {
                width: 70%;
                .title {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-bottom: 15px;
                }
                .info {
                    color: gray;
                    font-size: 0.8em;
                    p {
                        margin: 1px 0;
                    }
                }
            }
            .rating {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-content: center;
                width: 25%;
                height: 80px;
                // border: 1px solid;
                text-align: center;
                color: gray;
                font-size: 0.8em;

                box-shadow: .5px .5px 5px;
                &-average {
                    font-size: 2em;
                    font-weight: bold;
                    color: black;
                }
                &-stars {
                    line-height: 3.4vw;
                }
                p {
                    margin: 1px 0;
                }
            }
        }

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
    }
}
</style>