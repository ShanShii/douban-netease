// axios请求封装
import axios from 'axios'

// 取消前面请求
let pending = [];
let cancelToken = axios.CancelToken;
let removePending = (config) => {
    for(let p in pending){
        if(pending[p].u === config.url + '&' + config.method) {
            pending[p].f();
            pending.splice(p, 1);
        }
    }
}

let services = {};
const dbservice = axios.create({
    timeout: 50000,
    params: {
        apikey: '0b2bdeda43b5688921839c8ecb20399b',
    }
}), wyservice = axios.create({
    timeout: 50000
});
services = {
    dbservice, wyservice
}
// 请求拦截
for (let service in services) {
    services[service].interceptors.request.use(
        config => {
            removePending(config); //在一个ajax发送前执行一下取消操作
            // 这里突然变得很有必要，因为在“正在热映”中不知道为什么根据定位切换城市后，会发起两次0-10的请求
            // 改了改又出现了很多其他bug，只能用取消请求来搞一下了
            config.cancelToken = new cancelToken((c)=>{
                pending.push({ u: config.url + '&' + config.method, f: c });
            });
            return config;
        },
        error => {
            Promise.reject(error)
        }
    )
}
// 响应拦截
for (let service in services) {
    services[service].interceptors.response.use(
        response => {
            removePending(response.config);
            return response.data
        },
        error => {
            return Promise.reject(error)
        }
    )
}

export {dbservice, wyservice}