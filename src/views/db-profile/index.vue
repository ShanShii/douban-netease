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
                <van-tab v-for="name in tabs" :title="name" :key="name">
                    {{name}}
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
export default {
    data () {
        return {
            active: 0,


            tabs: [
                '想看',
                '看过',
                '影人'
            ]
        };
    },
    computed: {
        ...mapState([
            'isLogin',
            'userInfo'
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
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
}
</style>