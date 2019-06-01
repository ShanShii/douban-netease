<!-- 通用回退导航bar -->
<!-- <     title    share -->
<template>
    <!-- 导航栏 -->
    <van-nav-bar class="nav" fixed left-arrow ref="nav"
        :style="{color: color}"
        @click-left="back"
        @click-right="share">
        <span slot="title" class="iconfont" ref="navTitle">
            <template v-if="flag">
                <i class="iconfont iconPopcorn_A_px"></i>
                <span>{{ title }}</span>
            </template>
            <span v-else>{{ title }}</span>
        </span>
        <i class="iconfont iconshare" slot="right"></i>
    </van-nav-bar>
</template>

<script>
export default {
    props: [
        'title',
        'flag',
        'color'
    ],
    data () {
        return {
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        share() {
        },
    }
}

</script>
<style lang='scss' scoped>
.iconPopcorn_A_px {
    @extend .iconshare;
    left: 1px;
    font-size: 23px;
}
.iconshare {
    position: relative;
    top: 1px;
}

.nav {
    /deep/ * {
        color: inherit;
    }
    height: 46px;
    background-color: transparent;
    border: none;
}
</style>