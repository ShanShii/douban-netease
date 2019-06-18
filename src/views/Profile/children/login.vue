<!-- login -->
<template>
    <!-- login和logout好像可以抽象一下，用slot? -->
    <div class="login">
        <van-nav-bar fixed left-arrow @click-left="$router.go(-1)" class="login-nav"></van-nav-bar>
        <div class="wrapper">
            <div class="login-title">欢迎来到豆瓣</div>

            <form class="login-form">
                <input class="login-form-input" type="text" placeholder="账号"
                    v-model.lazy="userAccount" :class="{ 'active-input': active === 'account' }"
                    @focus="active='account'">
                <input class="login-form-input" type="password" placeholder="密码"
                    v-model.lazy="userPassword" :class="{ 'active-input': active === 'password' }"
                    @focus="active='password'">
                <div class="login-form-captcha">
                    <input class="captcha" type="text" placeholder="验证码"
                        v-model.lazy="captchaCode" :class="{ 'active-input': active === 'captcha' }"
                        @focus="active='captcha'">
                    <img :src="captchaCodeImgUrl" alt="CaptchaCode Img"
                        @click="getCaptchaCode">
                </div>
                <button class="login-form-button" @click.prevent="login">登陆</button>
            </form>

            <p class="login-info">* 登陆的未注册账号会自动注册</p>
        </div>
    </div>
</template>

<script>
import {
    getcaptchas,
    accountLogin
} from '@/api/douban'
import { mapMutations } from 'vuex';

export default {
    data () {
        return {
            active: null,
            userAccount: null,
            userPassword: null,
            captchaCode: null,
            userInfo: null,
            captchaCodeImgUrl: null
        };
    },
    methods: {
        ...mapMutations([
            'setUserInfo'
        ]),
        async getCaptchaCode() {
            let res = await getcaptchas();
            this.captchaCodeImgUrl = res.code;
        },
        async login() {
            if(!this.userAccount) {
                this.$dialog.alert({message: '请输入账号'});
                return ;
            }
            if(!this.userPassword) {
                this.$dialog.alert({message: '请输入密码'});
                return ;
            }
            if(!this.captchaCode) {
                this.$dialog.alert({message: '请输入验证码'});
                return ;
            }
            //用户名登录
            this.userInfo = await accountLogin(this.userAccount, this.userPassword, this.captchaCode);
            // console.log(this.userInfo)
            //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
            if (!this.userInfo.user_id) {
                this.$dialog.alert({message: this.userInfo.message});
                this.captchaCode = null;
                this.getCaptchaCode();
            } 
            else{
                this.setUserInfo(this.userInfo);
                this.$router.go(-1);
            }
        }
    },
    created() {
        this.getCaptchaCode();
    }
}

</script>
<style lang='scss' scoped>
.login {
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
        position: absolute;
        top: 25%;
        width: 90%;
        padding: 0 5%;
    }
    &-title {
        font-size: 2.5em;
        font-weight: 500;
        color: #42bd55;
        margin-bottom: 30px;
    }
    &-form {
        .active-input {
            border-color: #42bd55 !important;
        }
        &-input, .captcha {
            width: 94%;
            padding: 0 3%;
            border: none;
            height: 30px;
            border-bottom: 2px solid gray;
            margin-bottom: 20px;
        }
        &-captcha{ 
            width: 100%;
            .captcha{ 
                width: 64%;
            }
            img {
                width: 30%;
            }
        }
        &-button {
            width: 100%;
            height: 50px;
            background-color: #42bd55;
            color: #fff;
            border: none;
            border-radius: 5PX;
        }
    }
    &-info {
        text-align: left;
        font-size: 0.8em;
        color: gray;
    }
}
</style>