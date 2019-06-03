/* 
TODO:
    403 catch
    图片懒加载，loading 加载状态
    骨架屏
    个人页
    推荐页（轮播窗和豆瓣还原）
    登陆
    搜索
    本地存储
    抽象合并，进一步重构
    webpack打包
 */
<!-- 影人页 -->
<template>
<div>
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
            <div class="summary">
                <template v-if="data.summary.trim()">
                    <van-icon class="summary-right-arrow" size="14px" name="arrow" @click="showSummary"/>
                    <div class="summary-text">
                        {{ data.summary.trim() }}
                    </div>
                </template>
                <p v-else> 暂无简介 </p>
            </div>

            <!-- 详细个人简介弹出层 -->
            <van-popup class="popup" v-model="summaryShow" position="right" :overlay="false">
                <van-nav-bar fixed left-arrow @click-left="closeSummary"></van-nav-bar>
                <div class="popup-header">
                    <h3 class="name">{{ data.name }}</h3>
                    <p class="name-en">{{ data.name_en }}</p>
                </div>
                
                <table class="popup-information" cellspacing="5">
                    <tr v-for="index of 5" :key="index">
                        <td>
                            <i :class="[ 'iconfont', iconList[index-1] ]"></i>
                        </td>
                        <td>
                            {{ titleList[index-1] + '：'}}
                        </td>
                        <td v-if="index!==5">
                            {{ informationList[index-1]||'暂无' }}
                        </td>
                        <td v-else>
                            <template v-for="(name, index) in informationList[index-1]">
                                <span v-if="index" :key="index">{{'/' + name }}</span>
                                <span v-else :key="index">{{ name }}</span>
                            </template>
                        </td>
                    </tr>
                </table>
                <p class="popup-summary">{{ data.summary.trim() }}</p>
            </van-popup>
            <!-- 作品 -->
            <div class="section-title">
                代表作品
            </div>
            <div class="works">
                <template v-for="(item, index) in data.works">                        
                    <div class="work" :key="item.subject.id" @click="entryMovieDetail(item.subject.id)">
                        <img :src="item.subject.images.small" alt="movie poster">
                        <p class="title">{{ item.subject.title }}</p>
                        <template v-if="item.subject.rating.average > 0">
                            <van-rate class="rating-stars" v-model="stars[index]" :size="12" allow-half readonly/>
                            <span class="rating-num">{{ item.subject.rating.average }}</span>
                        </template>
                        <span class="rating-num" v-else>暂无评分</span>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <!-- svg loading -->
    <div class="wrapper" v-else>
        <img src="@/assets/ball-triangle.svg" alt="loading..." class="loading">
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
            top: 0,
            summaryShow: false,

            iconList: [
                'iconxingbie',
                'iconxingzuo',
                'iconriqi',
                'iconweizhi',
                'iconsmile'
            ],
            titleList: [
                '性别',
                '星座',
                '出生日期',
                '出生地',
                '更多中文名'
            ]
        };
    },
    computed: {
        stars() {
            return this.data.works.map(item => item.subject.rating.stars*0.1)
        },
        informationList() {
            return [
                this.data.gender,
                this.data.constellation,
                this.data.birthday,
                this.data.born_place,
                this.data.aka
            ]
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

        showSummary() {
            this.summaryShow = true
        },
        closeSummary() {
            this.summaryShow = false
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
.wrapper {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
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

        .popup {
            .van-nav-bar * {
                color: gray;
            }
            .iconfont {
                color: gray;
            }
            width: 94%;
            height: 100%;
            padding: 0 3%;
            &-header {
                margin-top: 60px;
                .name { margin: 5px 0; }
                .name-en {
                    font-size: 0.85em;
                    color: gray;
                }
            }
            &-information {
                font-size: 0.85em;
                td {
                    white-space: nowrap;
                }
            }
            &-summary {
                line-height: 1.25em;
                font-size: 15px;
            }
        }
    }
}
</style>