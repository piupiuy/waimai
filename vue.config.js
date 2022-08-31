const { defineConfig } = require('@vue/cli-service')
const { resolve } = require('path')
// const { config } = require('vue/types/umd')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    host:'127.0.0.1',
    port:'8080',
    open:true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin:true,
        pathRewrite:{
          '^/api':''
        }
      },
      "/location": {
        target: "http://api.map.baidu.com/location",
        changeOrigin:true,
        pathRewrite:{
          '^/location':''
        }
      },
      
    },
  },
  configureWebpack:{
    resolve:{
      extensions:['.js','.vue','.json'],
      alias:{
        '@':resolve('src')
      }
    }
  }
  
})
