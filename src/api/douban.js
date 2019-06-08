// 豆瓣 api
import { dbservice as request } from './request';
import areaList from './area_list'

// dbapi代理：https://api.douban.com/v2
request.defaults.baseURL = '/dbapi';
// 电影相关api: https://api.douban.com/v2/movie/xxx?apikey=
const movie = '/movie';

// 城市列表api不知道,直接mock了一下数据,用了vant里的area表
export function getCityList() {
    return areaList;
}

// top250电影列表
export function getMovieList(params) {
    return request({
        url: movie + '/top250',
        method: 'get',
        params
    })
}

// 正在热映
export function getInTheaters(params) {
    // console.log('request', params.start, 'city', params.city)
    return request({
        url: movie + '/in_theaters',
        method: 'get',
        params
    })
}

// 即将上映 count=100 
export function getComingSoon(params) {
    return request({
        url: movie + '/coming_soon',
        method: 'get',
        params
    })
}

// 北美票房榜
export function getUsBoxList() {
    return request({
        url: movie + '/us_box',
        method: 'get',
    })
}

// 一周口碑榜
export function getWeeklyList() {
    return request({
        url: movie + '/weekly',
        method: 'get',
    })
}

// 新片榜
export function getNewList() {
    return request({
        url: movie + '/new_movies',
        method: 'get',
    })
}


//电影详情
export function getMovieDetail(movieId) {
    return request({
        url: movie + `/subject/${movieId}`,
        method: 'get'
    })
}

// 影人详情
export function getCelebrityDetail(celebrityId) {
    return request({
        url: movie + `/celebrity/${celebrityId}`,
        method: 'get'
    })
}