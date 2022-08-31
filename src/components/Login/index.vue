<template>
  <div>
     <div class="log">
        <h1>登录</h1>
          <input type="text" placeholder="请输入手机号" id="phone" v-model="phone">
          <input type="password" placeholder="请输入密码" id="password" v-model="password">
        <van-button round type="info" @click="login">登录</van-button>
      </div>
      <router-link to="/register">未注册账号？点击注册</router-link>
  </div>
</template>

<script>
import CryptoJS from "crypto-js"
export default {
  name: 'login',

  data() {
    return {
      phone:"",
      password:""
    };
  },

  mounted() {
    
  },

  methods: {
    login(){
      let params={phone:this.phone,password:this.password}
      this.$http.post("/api/login",params)
      .then(res=>{
        // 成功访问
          // 成功登录
         alert(res.data.message);
          if(res.data.code===200){
                                               //要存储的值 //加密的秘钥（解密的时候必须要根据秘钥才能解密） 
            // 加密用户手机号
            let cipherText = CryptoJS.AES.encrypt(res.data.data[0].phone, "ustinian0912").toString();
            window.localStorage.setItem('token',cipherText)                   
            window.localStorage.setItem("username",res.data.data[0].username );//本地存储
            
            this.$router.push('/home')
          }
      })
      .catch(err=>{
        console.log("出错啦:"+err);
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.log{
  border: 1px solid #f2f3f5;
  width: 330px;
  height: 400px;
  margin: 0 auto;
  input{
    border-radius:999px;
    margin-bottom: 40px;
    height: 30px;
    border: inherit;
  }
}
.van-button{
  width: 200px;
  background-color: #ffba91;
}
</style>