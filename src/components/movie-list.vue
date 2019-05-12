<!-- movie-list电影简介单元格 -->
<template>
    <div class="movie-list">
        <van-cell v-for="(item, index) in data" :key="index">
            <div class="movie-item">
                <img :src="item.images.small" alt="Movie Image">
                <div class="caption">
                    <p class="title">{{ item.title }}</p>
                    <div class="rate">
                        <template v-if="stars[index] > 0">
                            <van-rate v-model="stars[index]" :size="12" allow-half readonly/>
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
                    <div v-if="item.collect_count" class="has-watched">{{ item.collect_count }}人看过</div>
                </div>
            </div>
        </van-cell>
    </div>
</template>

<script>
export default {
    name: "movieList",
    props: {
        data: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
        };
    },
    computed: {
        stars() {
            return this.data.map(item => item.rating.stars*0.1)
        }
    },
    mounted() {
    }
}

</script>
<style lang='scss' scoped>
    .movie-item {
        display: flex;
        img {
            height: 150px;
            width: 110px;
            flex: 0 0 80px;
        }

        .caption {
            flex: 1;
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