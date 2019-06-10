<!-- 登陆后的profile -->
<template>
    <div class="logout">
        <van-nav-bar fixed left-arrow @click-left="$router.go(-1)" class="logout-nav"></van-nav-bar>
        <div class="wrapper">
            <button @click="onClick">登出</button>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    data () {
        return {
        };
    },
    methods: {
        ...mapMutations([
            'logout'
        ]),
        onClick() {
            this.logout();
            this.$router.go(-1);
        }
    }
}

</script>
<style lang='scss' scoped>
.logout {
    .van-nav-bar .van-icon {
        color: #42bd55;
    }
    position: fixed;
    top: 0; bottom: 0;
    left: 0; right: 0;
    text-align: center;
    background-color: #fff;
    z-index: 2;
    .wrapper {
        margin-top: 50px;
        width: 90%;
        padding: 0 5%;
        button {
            width: 100%;
            height: 50px;
        }
    }
}
</style>