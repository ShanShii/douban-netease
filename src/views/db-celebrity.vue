<!-- 影人页 -->
<template>
    <div id="celebrity" @scroll="onScroll" v-if="loaded">
        <!-- 导航栏 -->
        <navbar ref="nav"
            :title="sclTop<=top? '影人':data.title"
            :flag="sclTop<=top? true:false"></navbar>
        <!-- 海报 -->
        <div class="celebrrity-image">
            <img :src="data.avatars.medium" alt="poster">
        </div>

        <!-- 主体 -->
        <div ref="main" class="main">
            <!-- 名字+收藏 -->
            <div class="head">
                <div class="name">
                    <h3>{{ data.name }}</h3>
                    <p class="name-en">{{ data.name_en }}</p>
                </div>
                <div class="collect">
                    <span>收藏</span>
                </div>
            </div>
            <!-- 个人简介 -->
            <div class="section-title">
                个人简介
            </div>
            <div class="summart">
                <van-icon class="summary-right-arrow" size="14px" name="arrow" />
                <div class="summary-text">
                    {{ data.summary.trim() }}
                </div>
            </div>
            <!-- 作品 -->
            <div class="section-title">
                代表作品
            </div>
            <div class="works">
                <template v-for="(item, index) in data.works">                        
                    <div class="work" :key="item.subject.id" @click="entryMovieDetail(item.subject.id)">
                        <img :src="item.subject.images.small" alt="movie poster">
                        <p class="title">{{ item.subject.title }}</p>
                        <van-rate class="rating-stars" v-model="stars[index]" :size="12" allow-half readonly/>
                        <span>{{ item.subject.rating.average }}</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getCelebrityDetail
} from '@/api/douban.js'
import navbar from '@/components/navbar'

export default {
    props: [
        'celebrityId'
    ],
    components: {
        navbar
    },
    data () {
        return {
            loaded: false,
            data: null,
            sclTop: 0,
            top: 0
        };
    },
    computed: {
        stars() {
            return this.data.works.map(item => item.subject.rating.stars*0.1)
        }
    },
    methods: {

        onScroll(e) {
            this.sclTop = e.target.scrollTop
            this.top = this.$refs.main.offsetTop
        },
        entryMovieDetail(id) {
            console.log(id)
            this.$router.push({name: 'movie', query: {
                'movie_id' : id
            }})
        },

        async getData() {
            await getCelebrityDetail(this.celebrityId).then(res => {
                this.data = res
            })
            this.loaded = true
        }
    },
    mounted() {
        this.getData()
    }
}

</script>
<style lang='scss' scoped>
/* $title-text-space: 5px;
$sections-space: 15px;
用到的地方太少了，每必要 */
#celebrity {
    overflow-x: hidden;
    overflow-y: auto;
    .celebrrity-image {
        position: relative;
        height: 300px;
        padding-top: 30px;
        text-align: center;
        line-height: 300px;
        background-color:rgba(170, 123, 5, 0.589);
        img {
            margin: 0 auto;
            vertical-align: middle;
            height: 230px;
        }
    }

    .main {
        padding: 10px 15px;
        .head {
            *{margin: 0; padding: 0;}
            display: flex;
            justify-content: space-between;
            padding-bottom: 10px;
            margin-bottom: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            .name-en {
                color: grey;
                font-size: 0.85em;
            }
            .collect {
                width: 80px;
                height: 36px;
                text-align: center;
                border: 1px solid gray;
            }
        }

        .section-title {
            font-size: 0.85em;
            color: gray;
            margin-bottom: 10px;
        }
        .summary {
            &-right-arrow {
                float: right;
                line-height: 60px;
                color: gray;
            }
            &-text {
                height: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                line-height: 1.25em;
                margin-bottom: 20px;
            }
        }

        .works {
            display: flex;
            overflow-x: auto;
            overflow-y: hidden;
            p {margin: 0; padding: 0;}
            .work {
                width: 120px;
                margin-right: 5px;
                .title {
                    height:18px;
                    font-size: 14px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
                img {
                    max-width: 120px;
                    height: 150px;
                }
                .rating-stars {
                    display: inline-block;
                    line-height: 3.4vw;
                }
            }
        }
    }
}
</style>