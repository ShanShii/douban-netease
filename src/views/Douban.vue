<!-- douban主承载页 -->
<template>
    <div id="douban-main">
        <Navbar></Navbar>
        <div class="wrapper">
            豆瓣 {{ location }}
        </div>
        <Tabbar></Tabbar>
        <div id="allmap"></div>
    </div>
</template>

<script>
import BMapLoader from '../api/location.js'
import Tabbar from '../components/douban-tabbar'
import Navbar from '../components/navbar'
import {
    getMovieList,
} from '@/api/douban.js'
import {getMusicList} from '@/api/netease.js'

export default {
    components: {
        Tabbar, Navbar
    },
    data () {
        return {
            location: '定位中...',
            error: '地图定位出错信息',
            top250Movies: [],
                
        }
    },
    methods: {
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
        getTop250Movies() {
            let params = {
                start: 0,
                count: 10
            }
            getMovieList(params).then(response => {
                console.log(response);
            })
        }
    },
    mounted () {
        this.getLocation();
        this.getTop250Movies();
        getMusicList().then(res => {
            console.log(res);
        })
    }
}

</script>
<style lang='scss'>
    
</style>    