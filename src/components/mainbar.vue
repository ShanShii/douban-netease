<!-- navbar -->
<template>
    <div id="nav">
        <van-nav-bar fixed :left-text="location"
            @click-left="onClickLeft"
            @click-right="onClickRight">

            <van-search class="search-bar" slot="right"
                placeholder="请输入搜索关键词" v-model="searchValue"/>
        </van-nav-bar>

        <van-popup v-model="popShow" position="right">
            <Citylist @completed="getSelected"></Citylist>
        </van-popup>
    </div>
</template>

<script>
import BMapLoader from '../api/location.js'
import Citylist from '@/views/Citylist'

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
        // 获得定位地址
        getLocation() {
            ///手机可以，电脑不可以，(浏览器定位)我傻了...
            BMapLoader.init().then(BMap => {
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
            console.log(12);
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
    mounted() {
        this.getLocation();
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