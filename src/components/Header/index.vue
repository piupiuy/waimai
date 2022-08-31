<template>
  <div>
    <!-- 头部区域 -->
    <van-nav-bar :fixed="true" left-text="返回"  left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <!-- 内容区域 -->
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      
    };
  },
  props:{
  },

  mounted() {
    
  },

  methods: {
   onClickLeft() {
      window.history.back()
    }
  },
};
</script>

<style lang="scss" scoped>
.van-nav-bar{
  background-color:#ffba91 ;
  height: 70px;
}
</style>