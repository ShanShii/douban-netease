// 豆瓣 api
import { dbservice as request } from './request';
import areaList from './area_list'

// dbapi代理：https://api.douban.com/v2
request.defaults.baseURL = '/dbapi';
// 电影相关api: https://api.douban.com/v2/movie/xxx
const movie = '/movie';

// 城市列表api不知道，直接用了vant里的area表
export function getCityList() {
    return areaList;
}

// top250电影列表
export function getMovieList(params) {
    return request({
        url: movie + '/top250',
        method: 'get',
        params,
    })
}

// 正在热映
export function getInTheaters(params) {
    return request({
        url: movie + '/in_theaters',
        method: 'get',
        params,
    })
}

// 即将上映
export function getComingSoon(params) {
    return request({
        url: movie + '/coming_soon',
        method: 'get',
        params,
    })
}