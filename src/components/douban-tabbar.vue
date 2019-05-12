<!-- doubanTabbar -->
<template>
    <div class="tabbar">
        <van-tabbar v-model="active" active-color="#07c160">
            <van-tabbar-item icon="home-o" to="/douban/main">热映</van-tabbar-item>
            <van-tabbar-item icon="video-o" to="/douban/recommend">推荐</van-tabbar-item>
            <van-tabbar-item icon="user-o" to="/douban/mine">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
    props: {
        pos: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
        };
    },
    computed: {
        // 避免修改prop报错，其实修改是无所谓的，因为父的index也是按照路由命名改的
        // 这里从父传子active是想让tabbar和路由历史纪录保持一致,回退时相应tabbar仍可保持高亮
        active: {
            get() {
                return this.pos
            },
            set() {
                // console.log(val, '*', this.pos, '*', this.active);
            }
        }
    }
};
</script>
<style lang='scss' scoped>
    .van-tabbar {
        height: 45px;
    }
</style>