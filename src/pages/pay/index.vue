<template>
  <div>
     <!-- 顶部导航 -->
    <van-nav-bar title="支付订单" left-arrow @click-left="onClickLeft" />
    <!-- 倒计时 -->
   剩余支付时间:<van-count-down :time="time" @finish="calcelOrder" ref="countDown"/>
   <!-- 价格 -->
  <h1>￥{{this.orderInfo.total}}</h1>
   <!-- 商店名 -->
   <p>{{this.orderInfo.shopName}}外卖订单</p>
   <!-- 支付卡片 -->
   <van-cell-group inset>
    <van-cell color="#07C160" icon="wechat" title="微信支付">
    <template #right-icon>
     <van-checkbox v-model="checked"></van-checkbox>
    </template>
    </van-cell>
  </van-cell-group>
  <!-- 支付按钮 -->
  <van-submit-bar  button-text="点击支付" @submit="onSubmit" />
  <!-- 密码输入 -->
  <!-- <van-popup v-model="show" style="height:10em;width: 10em;"> -->
  <!-- 密码输入框 -->
   <van-password-input
      :value="value"
      :focused="showKeyboard"
      :length="6"
      @focus="showKeyboard = true"
      :gutter="10"
      v-show="showKeyboard"
    />
   
  <!-- </van-popup> -->
       <!-- 数字键盘 -->
    <van-number-keyboard
      v-model="value"
      :show="showKeyboard"
      @blur="showKeyboard = false"
    />
   
 </div>
</template>

<script>
import bus from '@/bus.js'
import { Toast } from 'vant'
import axios from 'axios';
export default {
  name: 'Pay',

  data() {
    return {
      // 倒计时的时间,
      time:15*60*1000,
      checked:true,
      orderInfo:{},
      // 密码输入相关
      password:'',
      showKeyboard: false,
      value:'',
      show:false,
    };
  },

  mounted() {
    bus.$on('orderPay',(data)=>{
      this.orderInfo=data
    })
  },

  methods: {
    // 返回上一页
    onClickLeft() {
      this.$router.go(-1)
    },
    // 倒计时完成取消订单
    calcelOrder(){
      // axios.post('/api/cancelorder')
    },
    onSubmit(){
      this.showKeyboard=true
      this.show=true
    },
    // 倒计时暂停
    pause() {
      this.$refs.countDown.pause();
    },
  },
  watch:{
    value:{
      handler(newValue,oldValue){
        if(newValue.length===6){
          axios.post('/api/payorder',{orderCode:this.orderInfo.code}).then(res=>{
            if(res.data.code===200){
               Toast.success('支付成功');
                // 支付成功暂停计时
                this.pause()
                this.$router.push('/paysuccess')
                setTimeout(()=>{
                  bus.$emit('orderCode',{code:this.orderInfo.code,imgs:this.orderInfo.imgs})
                },100)
                  }
                })
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .van-cell__left-icon{
  color: #07C160;
}
/deep/ .van-submit-bar__button--danger{
 background: #FFBA91;
}
/deep/ .van-password-input__security li{
  background-color: #f3f3f3;
}
</style>