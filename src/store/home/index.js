import { reqGeo,reqAddress,reqGoods,reqType } from "@/api"
const state={
  shops:[],
  // imgs:[],
  geo:'',
  address:'江西省新余市渝水区'
}
const mutations={
  GETGOODS(state,shops){
    state.shops=shops
  },
  GETGEO(state,geo){
    state.geo=geo
  },
  GETADDRESS(state,address){
    if(address.length>0){
      state.address=address
    }
    
  }
}
const actions={
  // 获取经纬度
  async getGeo({commit}){
    let result=await reqGeo()
    if(result.status==200){
      let point=result.data.content.point
      // 得到经纬度
      let geo=point.x+','+point.y
      commit('GETGEO',geo)
      window.localStorage.setItem("geo",JSON.stringify(geo))
    }else{
      Promise.reject(new Error('faile'))
    }
  },
  // 获取地址
  async getAddress({commit},geo){
    await reqAddress(geo).then(result=>{
      if(result.status==200&&result.data.regeocode.formatted_address){
        let address=result.data.regeocode.formatted_address
        // address=address.substring(1,address.length-1)
        commit('GETADDRESS',address)
        window.localStorage.setItem("address",JSON.stringify(address))
      }else{
        let address=window.localStorage.getItem("address")
        commit('GETADDRESS',address)
        alert('faile:获取地址失败')
        
      }
    }).catch(err=>{
      let address=window.localStorage.getItem("address")
        address=address.substring(1,address.length-1)
        commit('GETADDRESS',address)
      console.log('获取地址失败:'+err);
    })
   
    
  },
  //------------------修改过的--------------------------- 
  // 首页商店
  async getGoods({ commit }, params) {
    let result = await reqGoods(params);
    if (result.data.code === 200) {
      commit("GETGOODS", result.data.data);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  // ----------------------------------------------
  // 获取分类数据
  async getType({commit},params){
    let result=await reqType(params)
    if(result.status!==200){
      alert('服务器出错')
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