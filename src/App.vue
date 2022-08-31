<template>
<div>
 <div id="app">
    <!-- 头部区域 -->
    <Header style="margin-bottom:75px" v-show="$route.meta.isshow"></Header>
    <!-- 内容区域 -->
    <!-- 路由组件出口 -->
 <keep-alive include="countPage">
 <router-view></router-view>
 </keep-alive>

    
    <!-- 底部区域 -->
    <Footer v-show="$route.meta.isshow"></Footer>
  </div>
</div>
 
</template>

<script>
import Header from "@/components/Header/index.vue";
import Footer from '@/components/Footer/index.vue'
export default {
  // 引入组件
  
  name: 'App',
  data(){
    return{
    
    }
  },
  components: {
    Header,
    Footer
  },
  methods:{
   
  }
}
</script>

<style>
/* @import './assets/font/iconfont.css'; */
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 70px; */
}
</style>
