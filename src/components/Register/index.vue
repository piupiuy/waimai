<template>
  <div>
    <div>
      <div class="reg">
        <h1>注册</h1>
        <input type="text" placeholder="请输入用户名" id="username" v-model="username">
          <input type="text" placeholder="请输入手机号" id="phone" v-model="phone">
          <input type="text" placeholder="请输入密码" id="password" v-model="password">
           <!-- <input type="password" placeholder="确认密码" id="password" v-model="checkPassword"> -->
        <van-button round type="info" @click="register">注册</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'register',

  data() {
    return {
      username:"",
      password:"",
      phone:""
    };
  },

  mounted() {
    
  },

  methods: {
    register(){
      let params={username:this.username,phone:this.phone,password:this.password}
      this.$http.post("/api/register",params).then((res)=>{
        console.log(res);
          if(res.data.code===200){
            alert(res.data.message)
            this.$router.push('/login')
          }else{
            alert('注册失败：'+res.data.message)
          }
      })
      .catch((err)=>{
        console.log(err);
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.reg{
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