<!-- 主页定位navbar -->
<template>
    <div id="nav">
        <nav class="top-nav">
            <div class="location"  @click="onClickLeft">
                {{ location }} <van-icon size="12px" name="arrow-down" />
            </div>
            <van-search class="search" placeholder="请输入搜索关键词"
                @click="onClickRight" v-model="searchValue"/>
        </nav>

        <van-popup v-model="popShow" position="right">
            <Citylist @completed="getSelected"></Citylist>
        </van-popup>
    </div>
</template>

<script>
import { BMapLoader }from '../api/mUtils'
import Citylist from '@/views/Citylist'
import {
    mapMutations
} from 'vuex'

export default {
    components: {
        Citylist
    },
    data () {
        return {
            location: '定位中...',
            searchValue: '',
            popShow: false,
            show: true,
        };
    },
    methods: {
        ...mapMutations([
            'setLocation'
        ]),
        // 获得定位地址
        getLocation() {
            ///手机可以，电脑不可以，(浏览器定位)我傻了...
            BMapLoader().then(BMap => {
                var map = new BMap.Map("allmap");
                var point = new BMap.Point(116.331398,39.897445);
                map.centerAndZoom(point,12);
                //浏览器定位
                var geolocation = new BMap.Geolocation();
                let that = this;
                geolocation.getCurrentPosition(function(r){
                    if(this.getStatus() == 0){
                        var mk = new BMap.Marker(r.point);
                        map.addOverlay(mk);
                        map.panTo(r.point);
                        // alert('您的位置：'+r.point.lng+','+r.point.lat);
                        
                        var gc = new BMap.Geocoder();
                        var pointAdd = new BMap.Point(r.point.lng, r.point.lat);
                        gc.getLocation(pointAdd, function(rs){
                            // 百度地图解析城市名
                            console.log(rs.addressComponents.city);
                            that.location = rs.addressComponents.city;
                        })
                    }
                    else {
                        that.error = 'failed'+this.getStatus();
                    }
                })
            });
        },

        // 点击地址，显示popup输入/选择地址
        onClickLeft() {
            this.popShow = true;
        },
        onClickRight() {
            // console.log(12);
            // Toast('按钮');
        },

        // 获得选择城市popUp中的的相关信息，并关掉popUp
        getSelected({location, show}) {
            this.popShow = show;
            if(location) {
                this.location = location;
            }
        }
    },
    watch: {
        location: function() {
            console.log('*', this.location);
            this.setLocation(this.location);
            this.$emit("switchLocation");
        }
    },
    mounted() {
        this.getLocation();
    }
}

</script>
<style lang='scss' scoped>
    #nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1;
        line-height: 50px;
        color: #07c160;
        border-bottom: 1px solid #ebedf0;
        background-color: #fff;
        /deep/ .top-nav {
            display: flex;
            height: 50px;
            font-size: 14px;
            .location {
                margin: 0 3vw;
            }
            .search {
                flex: auto;
                padding-left: 0;
                i.van-icon.van-icon-search {
                    color: #07c160;
                    // 这里不能scoped，因为这是searchbar的内容，scoped加不上去了
                    // updated -> 改用深度选择器/deep/解决
                }
            }
        }
    }
</style>