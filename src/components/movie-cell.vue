<!-- movie-cell -->
<template>
    <van-cell @click="onClick">
        <!-- 电影描述主体 -->
        <div class="movie-item">
            <img class="movie-image" :src="item.images.small" alt="Movie Image">
            <div class="caption">
                <p class="title">{{ item.title }}</p>
                <div class="rate" v-if="rate">
                    <template v-if="stars > 0">
                        <van-rate v-model="stars" :size="12" allow-half readonly/>
                        <span>{{ item.rating.average.toFixed(1) }}</span>
                    </template>
                    <template v-else>
                        <span font-size="14px" color="grey">暂无评分</span>
                    </template>
                </div>
                <div class="info van-ellipsis">
                    导演: 
                    <span
                        v-for="(director, index) of item.directors" :key="index">
                        <template v-if="index === 0">
                            {{ director.name }}
                        </template>
                        <template v-else>
                            {{ " / " + director.name }}
                        </template>
                    </span>
                </div>
                <div class="info van-ellipsis">
                    主演: 
                    <span
                        v-for="(cast, index) of item.casts" :key="index">
                        <template v-if="index === 0">
                            {{ cast.name }}
                        </template>
                        <template v-else>
                            {{ " / " + cast.name }}
                        </template>
                    </span>
                </div>
                <div v-if="item.collect_count && !type && rate" class="has-watched">
                    {{ item.collect_count }}人看过
                </div>

                <slot name="my-rate"></slot>
            </div>
        </div>
    </van-cell>
</template>

<script>
export default {
    props: {
        item: {
        },
        type: {
            type: String,
            default: ''
        },
        rate: {     // rate控制普通cell中评分的正常显示，rate=false说明在profile中使用，不需要rate/xxx人看过
            type: Boolean,
            default: true
        },
    }, // item : movie-data
    data () {
        return {
            stars: this.item.rating.stars*0.1
        };
    },
    methods: {
        // 进入电影详情页
        onClick() {
            this.$router.push({name: 'movie', query: {
                movie_id: this.item.id
            }})
        }
    }
}

</script>
<style lang='scss'>
    .van-cell::after {
        content: ' ';
        position: absolute;
        pointer-events: none;
        box-sizing: border-box;
        left: 15px;
        right: 15px;
        bottom: 0;
        -webkit-transform: scaleY(0.7);
        transform: scaleY(0.7);
        border-bottom: 1px solid #ebedf0;
    }
    .movie-item {
        display: flex;
        .movie-image {
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
</style>