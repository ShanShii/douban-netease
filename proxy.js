const http = require('http');
const request = require('request');

const hostname = '127.0.0.1';
const port = 8010;

//本地代理， CORS 跨域
const dbApiServer = http.createServer((req, res) => {
    const url = 'https://api.douban.com/v2' + req.url;
    const options = {
        url: url
    };
    function callback(error, response, body) {
        if(!error && response.statusCode === 200) {
            res.setHeader("Content-Type", "text/plain; charset=UTF-8");
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(body);
        }
    }
    request.get(options, callback);
})
dbApiServer.listen(port, hostname, () => {
    console.log(`接口代理运行在http://${hostname}:${port}/`);
})