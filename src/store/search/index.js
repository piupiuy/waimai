import { reqType } from "@/api"
const state={
  shops:[]
}
const mutations={
  GETCATEGORY(state,shops){
    state.shops=shops
  }
}
// 得到分类数据
const actions={
  async getCategory({commit},params){
    let result=await reqType(params)
    console.log(result);
    if(result.status==200){
      console.log(result.config);
      commit('GETCATEGORY',result.data)
    }else{
      Promise.reject(new Error('faile'))
    }
  }
}
const getters={}
export default{
  state,
  mutations,
  actions,
  getters
}