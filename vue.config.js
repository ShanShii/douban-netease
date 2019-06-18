module.exports = {
    devServer: {
      // 局域网内访问用，启动一定的ip和取消检查
      disableHostCheck: true,
      // host: '192.168.137.1',
      proxy: {
        '/dbapi': {
          target: 'https://api.douban.com/v2', // 目标接口的域名
          // secure: true,  // 检测https 且 证书有效 的时候 使用该参数
          changeOrigin: true,  // 是否跨域
          // pathRewrite会失效，不知道为什么
          pathRewrite: {
            '^/dbapi' : ''
          }
        }
      }
    }
  }