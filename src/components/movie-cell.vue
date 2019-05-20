<!-- movie-cell -->
<template>
    <van-cell @click="onClick">
        <!-- 电影描述主体 -->
        <div class="movie-item">
            <img :src="item.images.small" alt="Movie Image">
            <div class="caption">
                <p class="title">{{ item.title }}</p>
                <div class="rate">
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
                <div v-if="item.collect_count && !type" class="has-watched">{{ item.collect_count }}人看过</div>
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
        }
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
</style>