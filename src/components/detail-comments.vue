<!-- 电影评论/影评 -->
<template>
    <section id="movie-comments">
    <van-tabs>
        <van-tab title="评论">
            <van-list
                :finished="true"
                finished-text="点击查看更多评论"
            >
                <van-cell class="comment"
                    v-for="(item) in comments"
                    :key="item.id"
                >
                    <template slot="title">
                        <img class="avatar" :src="item.author.avatar" alt="avatar">
                        <span class="name">{{ item.author.name }}</span>
                        <van-rate class="rating" v-model="item.rating.value" :size="7" allow-half readonly/>
                    </template>
                    <template slot="label">
                        <p>{{ item.content }}</p>
                    </template>
                </van-cell>
            </van-list>
        </van-tab>

        <van-tab title="影评">
            <van-list
                :finished="true"
                finished-text="点击查看更多影评"
            >
                <van-cell class="review"
                    v-for="(item) in reviews"
                    :key="item.id"
                />
            </van-list>
        </van-tab>
    </van-tabs>
    </section>
</template>

<script>
export default {
    props: [
        'comments',
        'reviews'
    ],
    data () {
        return {
        };
    },
}

</script>
<style lang='scss' scoped>
/* 评论区 */

.comment {
    .avatar {
        height: 45px;
        border-radius: 30px;
        float: left;
    }
    .rating {
        display: inline-block;
        line-height: 2.4vw;
    }
}
</style>