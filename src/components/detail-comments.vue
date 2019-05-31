<!-- 电影评论/影评 -->
<template>
    <section id="movie-comments">
        <van-tabs color="grey">
            <van-tab title="评论">
                <van-list
                    :finished="true"
                    finished-text="点击查看更多评论"
                >
                    <li class="comment"
                        v-for="(item) in comments"
                        :key="item.id"
                    >
                        <img class="avatar" :src="item.author.avatar" alt="avatar">
                        <div class="wrapper">
                            <span class="name">{{ item.author.name }}</span>
                            <van-rate class="rating" v-model="item.rating.value" :size="7" allow-half readonly/>
                            <p class="content">{{ item.content }}</p>
                            <p class="date">{{ item.created_at }}</p>
                        </div>
                    </li>
                </van-list>
            </van-tab>

            <van-tab title="影评">
                <van-list
                    :finished="true"
                    finished-text="点击查看更多影评"
                >
                    <li class="review"
                        v-for="(item) in reviews"
                        :key="item.id"
                    >
                    <a :href="item.alt">
                        <h5 class="title">{{ item.title }}</h5>
                        <div class="content">
                            <span>{{ item.author.name }}</span>
                            <van-rate class="rating" v-model="item.rating.value" :size="7" allow-half readonly/>
                            <p class="summary">{{ item.summary }}</p>
                        </div>
                    </a>
                    </li>
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
    }
}

</script>
<style lang='scss' scoped>
/* 评论区 */
* {
    list-style: none;
}
p {
    margin: 0;
}
.rating {
    display: inline-block;
    line-height: 2.4vw;
}
.comment {
    display: flex;
    position: relative;
    padding: 15px;
    font-size: 15px;
    .avatar {
        height: 45px;
        border-radius: 30px;
        margin-right: 10px;
    }
    .wrapper {
        flex: auto;
        .name {
            margin-right: 5px;
            font-weight: bold;
        }
        .content {
            margin: 10px 0;
        }
        .date {
            color: grey;
        }
    }
}

.review {
    padding: 15px;
    padding-top: 0;
    a{ color: black;}
    .title {
        margin: 10px 0;
    }
    .content {
        font-size: 14px;
        color: grey;
        .summary {
            margin-top: 8px;
        }
    }
}
</style>