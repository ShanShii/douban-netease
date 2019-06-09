<!-- douban个人主页 -->
<template>
    <div class="profile">
        <header class="profile-head">
            <router-link :to="{ name: 'login' }">
                <img :src=" isLogin ? imgUrl : require('../../assets/timg.gif') " alt="avatar">
                <span class="username">{{ isLogin? username : '请登陆' }}</span>
            </router-link>
        </header>
        <main class="profile-body">

        </main>

        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: "",
    data () {
        return {
            isLogin: false,
        };
    },
    computed: {
        ...mapState[
            'isLogin'
        ]
    }
/* {
    if (!this.userAccount) {
        this.showAlert = true;
        this.alertText = '请输入手机号/邮箱/用户名';
        return
    }else if(!this.passWord){
        this.showAlert = true;
        this.alertText = '请输入密码';
        return
    }else if(!this.codeNumber){
        this.showAlert = true;
        this.alertText = '请输入验证码';
        return
    }
    //用户名登录
    this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
}
//如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
if (!this.userInfo.user_id) {
    this.showAlert = true;
    this.alertText = this.userInfo.message;
    if (!this.loginWay) this.getCaptchaCode();
}else{
    this.RECORD_USERINFO(this.userInfo);
    this.$router.go(-1);

} */
}

</script>
<style lang='scss' scoped>
.profile {
    &-head {
        width: 100%;
        height: 250px;
        background: url('../../assets/profile-bg.jpg') center;
        background-size: cover;
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