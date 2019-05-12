<!-- 定位 & 城市选择 -->
<template>
  <div id="citylist">
    <van-search v-model="location" placeholder="输入城市名称查询"
        shape="round">
    </van-search>

    <div class="search-result" v-if="location.trim().length > 0">
        <p v-show="searchList.length === 0">这里是空哒~</p>
        <van-list>
            <van-cell
                v-for="item in searchList"
                :key="item"
                :title="item"
                @click="selectCity(item)"
            />
        </van-list>
    </div>
    <!-- 默认选定要加value="xxx"，否则下级市/县无法选定=>传递 -->
    <van-area v-else value="110000"
        :area-list="cityList" :columns-num="2" :visible-item-count="10" title="选择城市"
        @confirm="onConfirm"
        @cancel="onCancel"/>
  </div>
</template>

<script>
import { getCityList } from "@/api/douban.js";

export default {
    data() {
        return {
            cityList: [],   // 省+城市列表
            location: '',   // 搜索框输入内容
        };
    },
    methods: {
        // areaList选定城市
        onConfirm(data) {
            this.location = data[1].name
            this.completed()
        },
        onCancel() {
            this.completed()
        },
        // 重设地址emit到父组件
        completed() {
            this.$emit("completed", {location: this.location, show: false})
            this.location = ''
        },
        // 搜索选定城市
        selectCity(item) {
            this.location = item;
            this.completed(true);
        }
    },
    computed: {
        // searchList: [], 搜索结果，按拼音首字母分组...
        // 由于数据没有拼音，所以不知道怎么实现拼音分组排序，只能汉字分组了，api工作不是重点不想做了
        searchList: function() {
            let location = this.location.trim()
            let list = this.cityList.city_list, result = []
            Object.values(list).forEach(item => {
                if(item.includes(location)) result.push(item)
            });
            return result
        }
    },
    created() {
        this.cityList = getCityList();
    }
};
</script>
<style lang='scss'>
    #citylist {
        width: 100vw;
        height: 100vh;
        .van-picker__cancel, .van-picker__confirm {
            color: #07c160;
        }
        .search-result {
            text-align: center
        }
    }
</style>