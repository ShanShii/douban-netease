<!-- Entrance入口 -->
<template>
    <div id="entrance">
        <router-link to="/douban" class="douban">
            <img src="../assets/douban-logo.png" alt="douban">
        </router-link>
        <router-link to="/netease" class="netease">
            <img src="../assets/netease-logo.gif" alt="netease">
        </router-link>
    </div>
</template>

<script>
export default {
    name: "entrance",
    data () {
        return {
        };
    },

}

</script>
<style lang='scss' scoped>
#entrance {
    height: 100vh;
    text-align: center;
    line-height: 100vh;
    a {
        width: 50vw;
        float: left;
        background-color: #07d714;
        img {
            width: 15vw;
        }
        + a {
            background-color: #e92201;
        }
    }
}
</style>