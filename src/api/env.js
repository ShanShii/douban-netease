/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * 
 */

let baseUrl = ''; 

if (process.env.NODE_ENV == 'development') {
    // devServer中的proxy
    baseUrl = '/dbapi';
}else if(process.env.NODE_ENV == 'production'){
    // 花生壳端口映射的外网地址，本质还是127的那个接口，不过这个是上线时候用的
    // 要先打开本地proxy
	baseUrl = 'http://25c29634q4.qicp.vip:51936';
}

export default baseUrl;