<!-- douban个人主页 -->
<template>
    <div class="profile">
        <header class="profile-head">
            <router-link :to="{ name: isLogin? 'logout':'login' }" class="wrapper">
                <img class="avatar" src="../../assets/timg.gif" alt="avatar" :class="{ 'logged-avatar': isLogin }">
                <span class="username">{{ isLogin? userInfo.username : '请登陆' }}</span>
            </router-link>
        </header>
        <main class="profile-body">
            <van-tabs v-model="active" sticky color="gray" animated swipeable>
                <van-tab v-for="(name, index) in tabs" :title="tabsTitle[index]" :key="name">
                    <!-- {{ name }} -->
                    <template v-for="item in [wanted, watched, celebrities][index]">
                        <movie-cell :key="item.id" :item="item" :rate="index?false:true" v-if="index !== 2">
                            <template v-slot:my-rate v-if="index === 1">
                                <div class="rate">
                                    <van-rate :size="14" v-model="item.rate_value" readonly/>
                                    <van-icon class="icon" name="edit"/>
                                </div>
                            </template>
                        </movie-cell>
                    </template>
                </van-tab>
            </van-tabs>
        </main>

        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import movieCell from '../../components/movie-cell'

export default {
    components: {
        movieCell
    },
    data () {
        return {
            active: 0,
            tabsTitle: [
                '想看',
                '看过',
                '影人'
            ],
            tabs: [
                'watched',
                'wanted',
                'celebrities'
            ]
        };
    },
    computed: {
        ...mapState([
            'isLogin',
            'userInfo',
            'watched',
            'wanted',
            'celebrities'
        ])
    },
    methods: {
        ...mapActions([
            'getUser'
        ]),
    },
    mounted() {
    }
}

</script>
<style lang='scss' scoped>
.profile {
    &-head {
        position: relative;
        width: 100%;
        height: 250px;
        background: url('../../assets/profile-bg.jpg') center;
        background-size: cover;

        .wrapper {
            position: absolute;
            top: 30%;
            display: flex;
            justify-content: center;
            align-items: center;
            .logged-avatar {
                transform: rotate(180deg);
            }
            .avatar {
                height: 30%;
                width: 30%;
                border-radius: 100%;
                flex: none;
                margin-right: 10px;
            }
            .username {
                font-size: 1.5em;
                color: #fff;

            }
        }
    }

    &-body {
        /* 修改movie-cell中的image大小 */
        /deep/ .movie-item .movie-image {
            height: 110px;
            width: 75px;
        }
        .rate {
            margin-top: 5px;
            height: 35px;
            border-left: 3px solid gray;
            background-color: rgba(172, 172, 172, 0.475);

            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px 0 5px;
        }
    }
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
}
</style>