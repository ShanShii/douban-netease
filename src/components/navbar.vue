<!-- navbar -->
<template>
    <div id="nav">
        <van-nav-bar fixed left-text="返回" left-arrow
            @click-left="onClickLeft"
            @click-right="onClickRight">

            <van-search class="search-bar" slot="right"
                placeholder="请输入搜索关键词" v-model="searchValue"/>
        </van-nav-bar>
    </div>
</template>

<script>
export default {
    data () {
        return {
            searchValue: '',
        };
    },
    methods: {
        onClickLeft() {
            // Toast('返回');
            console.log(1);
        },
        onClickRight() {
            console.log(12);
            // Toast('按钮');
        }
    }
}

</script>
<style lang='scss'>
    #nav {
        height: 45px;
        i, span {
            color: #07c160;
        }
        .search-bar {
            i.van-icon.van-icon-search {
                color: #07c160;
                // 这里不能scoped，因为这是searchbar的内容，scoped加不上去了
            }
            width: 285px;
            padding: 6px 0;
        }
    }
</style>