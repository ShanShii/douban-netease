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
            <img :src="movie.images.small" alt="poster">
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
            <div class="watched-selected" v-if="isWatched"
              @click="dialogShow=true">
                <div class="wrapper">
                    <img class="avatar" src="../assets/timg.gif" alt="avatar">
                    <span class="info">我看过:</span>
                    <van-rate :size="14" v-model="rateValue" readonly/>
                    <span class="time">{{ time }}</span>
                </div>
                <van-icon class="icon" name="edit"/>
            </div>
            <div class="selection" v-else>
                <van-button class="want" plain :type="isWanted?'default':'warning'"
                    @click="addWanted">
                    {{ isWanted?'已想看':'想看' }}</van-button>
                <van-button class="watched" plain type="warning"
                    @click="addWatched">
                    看过 <span font-size="16px">☆ ☆ ☆ ☆ ☆</span>
                </van-button>
            </div>

            <!-- 评分dialog -->
            <van-dialog
                v-model="dialogShow"
                title="看过"
                show-cancel-button
                @confirm="onConfirm"
                :before-close="close"
            >
                <div class="dialog-wrapper">
                    <div class="title">{{ rateLevel[rateValue] }}</div>
                    <van-rate v-model="rateValue"/>
                </div>
            </van-dialog>

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
                        <figure class="cast-item" v-for="(item, index) in items" :key="item.id+index" @click="entryCelebrity(item.id)">
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
    <loading v-else></loading>
</template>

<script>
import {
    getMovieDetail
} from '../api/douban'
import analyze from 'rgbaster'
import comments from '@/components/detail-comments'
import navbar from '@/components/navbar'
import loading from '@/components/loading'
import { mapState, mapMutations } from 'vuex';
export default {
    props: [
        'movieId'    // 路由组件query传参
    ],
    components: {
        comments,
        navbar,
        loading
    },
    data () {
        return {
            failImg: require('@/assets/timg.gif'),  // 电影人头像加载失败的fallback
            dialogShow: false,
            rateLevel: ['点击星星评分', '很差', '较差', '还行', '推荐', '力荐'],
            rateValue: 0,
            listIndex: -1,
            time: null,     // x月xx日

            movie: null,    // 电影数据
            loaded: false,  // 加载状态
            stars: 0,       // 评分值
            sclTop: 0,      // 滚动距离
            top: 0,         // 主题距离顶部的高度offsetTop
            deep: true,     // 判断nav字体颜色是否应为深色
            color: null     // 分析出的背景色,形式应该为[{},{}...]
        };
    },
    computed: {
        ...mapState([
            'wanted',
            'watched'
        ]),
        isWanted() {
            let res = this.findRateValueAndIndex('wanted')
            if(res) {
                this.setRateValueAndIndex(res.rate_value, res.index);
                return true;
            }
            return false;
        },
        isWatched() {
            let res = this.findRateValueAndIndex('watched')
            if(res) {
                this.setRateValueAndIndex(res.rate_value, res.index);
                return true;
            }
            return false;
        }
    },
    methods: {
        ...mapMutations([
            'addList'
        ]),
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

        /**
         * 复用率有点高，抽出来
         * function: 在wanted||watched里寻找rate_value & index
         * 如果存在return {value, index}对象，不存在return null
         * 如果在wanted里面找, rate_value恒为0无所谓
         */
        findRateValueAndIndex(name) {
            let rate_value = 0;
            for(let index=0; index < this[name].length; index++) {
                if(this[name][index].id === this.movie.id) {
                    if(name === 'watched') rate_value = this[name][index].rate_value;
                    return {rate_value, index};
                }
            }
            return null;
        },
        /**
         * 已评过分则拿过来
         * 顺便在这里拿下在vuex中的index，再次评分的时候修改vuex里的rate_value就好了
         */
        setRateValueAndIndex(value, index) {
            this.rateValue = value;
            this.listIndex = index;
        },
        
        /**
         * dialog before-colose执行函数
         * 评分为0时 done(false)阻止关闭dialog
         */
        close(action, done) {
            if(action === 'confirm' && !this.rateValue) {
                done(false);
            } else {
                done();
            }
        },
        
        /**
         * 评分确认
         * function: 没有评分(value=0)：toast 至少打一星
         *          已评分：只修改watched里的值
         *          首次评分：增加rate_value并add movie
         */
        onConfirm() {
            if(! this.rateValue) this.$toast('至少打一星哦~');
            else {
                if(this.isWatched)  {
                    this.watched[this.listIndex].rate_value = this.rateValue;
                } else {
                    let watchedMovie = Object.assign({}, this.movie, { rate_value: this.rateValue })
                    // console.log(watchedMovie)
                    this.addList({ name: 'watched', obj: watchedMovie })
                    this.dialogShow = false
                }
            }
        },
        onCancel() {
            this.rateValue = 0;
            this.dialogShow = false;
        },
        addWatched() {
            this.dialogShow = true;
        },
        addWanted() {
            if(this.isWanted) {
                let res = this.findRateValueAndIndex('wanted');
                this.wanted.splice(res.index, 1);
            }
            else {
                this.addList({ name: 'wanted', obj: this.movie })
            }
        },

        async getMovie() {
            this.movie = await getMovieDetail(this.movieId)
            // 分析图片主色设置背景色
            try {
                // 这里图片跨域偶尔会有问题，没想到为啥，毕竟这个不是我写的...try catch一下
                // nav和图片框默认背景色为'gray'
                // 其实这个东西效果一般,可能是我不会用吧...
                this.color = await analyze(this.movie.images.medium, {
                    ignore: [ 'rgb(255,255,255)', 'rgb(0,0,0)' ],
                    scale: 0.5
                })
                console.log(`The dominant color is ${this.color[0].color} with ${this.color[0].count} occurrence(s)`)
                console.log(`The secondary color is ${this.color[1].color} with ${this.color[1].count} occurrence(s)`)

            } catch(err) {
                console.log(err)
            }

            this.loaded = true  // 做一个loading
            this.stars = this.movie.rating.stars*0.1
            if(this.color) {
                this.$nextTick(() => {
                    let [r, g, b] = this.color[10].color.slice(4, -1).split(',')
                    if(r*0.299 + g*0.578 + b*0.114 >= 192)
                    { //浅色
                        this.deep = false
                    }
                    else
                    {  //深色
                        this.deep = true
                    }
                    this.$refs.movieImage.style.backgroundColor = `${this.color[10].color}`
                    // console.log(this.$refs)
                    // 子组件navbar 的 ref = VueComponent 打印出来就知道怎么用了，加个$el
                    this.$refs.nav.$el.style.backgroundColor = `${this.color[10].color}`
                })
            }
        }
    },
    mounted() {
        this.getMovie();
        // 无存储mock评分时间
        let date = new Date();
        this.time = date.getMonth()+1 + '月' + date.getDate() + '日';
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
        background-color: gray;
        img {
            margin: 0 auto;
            vertical-align: middle;
            height: 330px;
        }
    }
    .movie {
        /* 电影描述 */
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

        /* rated显示框 */
        .watched-selected {
            height: 50px;
            background-color: rgb(252, 240, 172);
            margin: 0 15px;
            padding: 0 10px;
            overflow: hidden;

            display: flex;
            align-items: center;
            justify-content: space-between;
            .wrapper {
                display: flex;
                align-items: center;
            }
            .avatar {
                height: 35px;
                width: 35px;
                border-radius: 100%;
            }
            .info {
                font-size: 14px;
                font-weight: 700;
                margin: 0 5px;
            }
            .van-rate__item {
                padding: 0 1px;
            }
            .time {
                margin-left: 5px;
                font-size: 12px;
                color: gray;
            }
            .icon {
                font-size: 20px;
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
        .dialog-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            margin-top: 20px;
            .title {
                font-size: 0.8em;
                color: gray;
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