<template>
  <div>
     <!-- 底部导航 -->
    <van-tabbar v-model="active">
    <van-tabbar-item icon="shop" @click="goHome">首页</van-tabbar-item>
    <van-tabbar-item icon="bill"  @click="goOrder">订单</van-tabbar-item>
    <van-tabbar-item icon="manager" @click="goMy">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>

export default {
  name: 'Footer',

  data() {
    return {
      active:0
    };
  },

  mounted() {
     
  },

  methods: {
    goOrder(){
      this.$router.push('/myorder')
    },
    goMy(){
      this.$router.push('/my')
    },
    goHome(){
      this.$router.push('/home')
    }
  },
};
</script>

<style lang="scss" scoped>
.van-tabbar-item--active {
    color:#ffba91;
    background-color: #fff;
}
</style>