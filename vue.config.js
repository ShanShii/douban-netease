module.exports = {
    devServer: {
      proxy: {
        '/dbapi': {
          target: 'http://127.0.0.1:8010', // 目标接口的域名
          // secure: true,  // 检测https 且 证书有效 的时候 使用该参数
          changeOrigin: true,  // 是否跨域
          // pathRewrite会失效，不知道为什么
        }
      }
    }
  }