<template>
  <div>
    <van-card  
  :title="userinfo.username"
  :thumb="imageURL"
/>

    <ul>
      <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-hongbao"></use></svg><span>红包</span></li>
      <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-jifenrenwu"></use></svg><span>积分</span></li>
      <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-youhuiquan"></use></svg><span>优惠券</span></li>
      <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-qianbao"></use></svg><span>我的钱包</span></li>
  <router-link to="/myorder"> <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-dingdan"></use></svg><span>我的订单</span></li></router-link> 
      <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-_dingwei"></use></svg><span>我的地址</span></li>
      <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-jingxuanshoucang"></use></svg><span>我的收藏</span></li>
      <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiaoxi"></use></svg><span>我的评价</span></li>
      <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-kefu"></use></svg><span>客服</span></li>
      <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-yijianfankui"></use></svg><span>意见反馈</span></li>
    </ul>
    <van-button plain round type="warning" @click="logout">退出登录</van-button>
  </div>
</template>

<script>
import img from '@/assets/img/ava.png'
import CryptoJS from 'crypto-js'; 
import axios from 'axios';
export default {
  name: 'WorkspaceJsonIndex',

  data() {
    return {
      imageURL:img,
      userinfo:{}
    };
  },

  mounted() {
    // 获取用户的基本信息
     // 解密获得用户的token
      var tk = localStorage.getItem("token");//把存储的值取出
      var bytes = CryptoJS.AES.decrypt(tk, "ustinian0912");
      //要解密的值   //解密的秘钥（必须与加密的秘钥一直）
      var originalText = bytes.toString(CryptoJS.enc.Utf8);//解密操作
      // 要传输给后台的数据
      let params = { token: originalText }
      axios.post('/api/getuserinfo',params).then(res=>{
        if(res.data.code===200){
          // console.log(res.data.data);
          this.userinfo=res.data.data[0]
        }
      })
  },

  methods: {
    // 退出登录
    logout(){
      this.$router.push('/login')
    }
  },
};
</script>

<style lang="scss" scoped>
ul li{
  height: 50px;
  text-align: center;
  border-bottom: 1px solid #f2f3f5;
  span{
    float: left;
    font-size: 14px;
    margin-top: 10px;
    margin-left: 10px;
  }
}
.icon{
  margin-left: 10px;
  float: left;
  width: 30px;
  height: 40px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.van-button{
  margin-bottom: 4em;
  width: 80%;
}
</style>