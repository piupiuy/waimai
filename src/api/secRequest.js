// 对axios进行二次封装
import axios from 'axios'

// // 引入进度条
// import nprogress from 'nprogress'
// 引入样式
// import "nprogress/nprogress.css"
// import store from '@/store'
// start：进度条开始 done：进度条结束


// 利用axios对象的方法create，创建一个实例
const secRequests=axios.create({
  baseURL:"",
  // 请求超时的时间
  timeout:5000
})

// 请求拦截器，在发请求之前，请求拦截器可以监测到，可以在请求发出去前进行一些处理
// requests.interceptors.request.use((config)=>{
//   // config:配置对象，里面有header请求头属性
//   if(store.state.detail.uuid_token){
//    // 请求头添加一个字段（与后台对应的）userTempId
//    config.headers.userTempId=store.state.detail.uuid_token
//   }
//   if(store.state.user.token){
//     config.headers.token=store.state.user.token
//   }
//   // 进度条开始动
//   nprogress.start()
//   return config
// })
// // 响应拦截器
// requests.interceptors.response.use((res)=>{
//   // 成功的回调函数
//   nprogress.done()
//   return res.data
// },(error)=>{
//   return Promise.reject(error)
// })

export default secRequests