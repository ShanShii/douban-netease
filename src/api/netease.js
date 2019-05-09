// 要先启动本地端口
// 网易云音乐 api
import { wyservice as request } from './request';

// 本地代理的网易接口
request.defaults.baseURL = 'http://localhost:8011';

export function getMusicList(params) {
    return request({
        url: '/top/playlist?limit=10&order=new',
        method: 'get',
        params,
    })
}
