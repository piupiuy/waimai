import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'
Vue.use(Vuex)
// 导入小仓库
import home from './home'
import search from './search'
export default new Vuex.Store({
  // 保证刷新页面数据不消失
  plugins:[
    persistedState({storage:window.localStorage})
  ],
  // 注册小仓库
  modules:{
    home,
    search
  }
})