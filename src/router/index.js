// 配置路由的文件
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './route'
// 使用插件
Vue.use(VueRouter)
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
let router= new VueRouter({
  // 配置路由
  routes,
  mode:'history'
  // 滚动条
})
export default router