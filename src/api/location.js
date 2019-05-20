export default {
    init: function (){
        // 返回/切换会插入多个百度地图的iframe，由于不是重点，先不研究了
        //console.log("初始化百度地图脚本...");
        const AK = "tMI2b6j1dW06MyIZud1IvhNHfKH73b6o";
        const BMap_URL = "https://api.map.baidu.com/api?v=2.0&ak="+ AK +"&s=1&callback=onBMapCallback";
        return new Promise((resolve) => {
            // 如果已加载直接返回
            // console.log(1)
            if(typeof window.BMap !== "undefined") {
                resolve(window.BMap);
            // console.log(2)
            return true;
            }
            // 百度地图异步加载回调处理
            window.onBMapCallback = function () {
                console.log("百度地图脚本初始化成功...");
                resolve(window.BMap);
            };
            // console.log(3)
    
            // 插入script脚本
            let scriptNode = document.createElement("script");
            scriptNode.setAttribute("type", "text/javascript");
            scriptNode.setAttribute("src", BMap_URL);
            document.body.appendChild(scriptNode);
        });
    }
}