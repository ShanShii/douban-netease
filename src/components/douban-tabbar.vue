<!-- doubanTabbar -->
<template>
  <div class="tabbar">
    <van-tabbar v-model="active" active-color="#07c160">
        <van-tabbar-item icon="home-o">热映</van-tabbar-item>
        <van-tabbar-item icon="search">标签</van-tabbar-item>
        <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
    data() {
        return {
            active: 0,
        };
    }
};
</script>
<style lang='scss' scoped>

</style>