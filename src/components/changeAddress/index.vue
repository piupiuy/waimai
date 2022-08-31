<template>
  <div>
    <!-- 头部导航栏 -->
   <van-nav-bar
  title="标题"
  left-text="返回"
  left-arrow
  @click-left="onClickLeft"
/>
<!-- 地址编辑 -->
<van-address-edit
  :area-list="areaList"
  show-delete
  show-set-default
  show-search-result
  :address-info="addressinfo"
  :search-result="searchResult"
  @save="onChange"
  @delete="onDelete"
  @change-detail="onChangeDetail"
/>
  </div>
</template>

<script>
// 导入地区列表
import { areaList } from '@vant/area-data';
import CryptoJS from "crypto-js"
// 导入bus
import bus from '@/bus.js'
export default {
  name: '',

  data() {
    return {
       areaList,
      searchResult: [],
      addressinfo:{
      }
    };
  },
  created(){
    bus.$on('changeAddress',(data)=>{
      this.addressinfo=data
    })
  },
  mounted() {
    
  },

  methods: {
     // 返回地址列表
    onClickLeft(){
      this.$router.back()
    },
    // 保存地址
    onChange(content) {
      // 表单数据格式：addressDetail: "111111" ，areaCode: "110101"， city: "北京市" ，country: "" ，county: "东城区"， isDefault: true ，name: "111" ， province: "北京市" ，tel: "12345678901"
      // Toast('save');
      // 解密获得用户的token
      var tk = localStorage.getItem("token");//把存储的值取出
      var bytes = CryptoJS.AES.decrypt(tk, "ustinian0912");
      //要解密的值   //解密的秘钥（必须与加密的秘钥一直）
      var originalText = bytes.toString(CryptoJS.enc.Utf8);//解密操作
      // 要传输给后台的数据
      let params={content:content,token:originalText}
      this.$http.post('http://127.0.0.1:3000/api/addresschange',params).then(res=>{
        alert(res.data.message)
        if(res.data.code===200){
          this.$router.push('/address')
        }
      })
    },
    onDelete(content) {
      let params={addressid:content.addressid}
      this.$http.post('http://127.0.0.1:3000/api/addressdelete',params).then(res=>{
        alert(res.data.message)
        if(res.data.code===200){
          this.$router.push('/address')
        }
      })
    },
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [{
          name: '黄龙万科中心',
          address: '杭州市西湖区'
        }];
      } else {
        this.searchResult = [];
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.van-button--danger{
  background-color: #FFBA91;
  border: #FFBA91;
}
</style>