// 豆瓣 api
import { dbservice as request } from './request';

request.defaults.baseURL = '/dbapi';

export function getMovieList(params) {
    return request({
        url: '/top250',
        method: 'get',
        params,
    })
}