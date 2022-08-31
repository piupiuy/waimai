<template>
  <div>
     <!-- 顶部导航 -->
    <van-nav-bar  left-arrow @click-left="onClickLeft" right-text="完成"  @click-right="onClickRight"/>
    <h2 style="color:#7a7a7a;"><span style="color:#000;">下单成功&nbsp;</span>预计16：00送达 </h2>
    <p style="color:#7a7a7a;"><van-icon name="info-o" />关注食品安全，请安全健康饮食</p>
    <van-button type="info" @click="goOrder">查看订单</van-button>
  </div>
</template>

<script>
import bus from '@/bus.js'
export default {
  name: 'AppIndex',

  data() {
    return {
      code:''
      // imgs:[]
    };
  },

  mounted() {
    bus.$on('orderCode',(data)=>{
      this.code=data.code
      // this.imgs=data.imgs
    })
  },

  methods: {
    onClickLeft(){
      this.$router.back()
    },
    // 点击完成
    onClickRight(){
      this.$router.push('/home')
    },
    // 查看订单
    goOrder(){
      this.$router.push({path:`/order/${this.code}`})
      // setTimeout(() => {
      //   bus.$emit('sendImg',this.imgs)
      // }, 100);
    }
  },
};
</script>

<style lang="scss" scoped>
.van-button{
  margin-top: 2em;
}
</style>