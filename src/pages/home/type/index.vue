<template>
  <div>
    <ul @click="findType">
      <li data-type="home"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-diancai"></use></svg><span>家常菜</span> </li>
      <li data-type="drink"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shiwuqimin1"></use></svg><span>酒水饮料</span></li>
      <li data-type="chicken"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-mbefengge_zhaji"></use></svg><span>炸鸡汉堡</span></li>
      <li data-type="noodle"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shiwumiantiao"></use></svg><span>暖胃粉面</span></li>
      <li data-type="super"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shangdian"></use></svg><span>超市便利</span></li>
      <li data-type="xiaochi"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiaochi"></use></svg><span>小吃</span></li>
      <li data-type="cake"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shiwutubiao00-74"></use></svg><span>甜品蛋糕</span></li>
      <li data-type="summer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shiwutubiao-48"></use></svg><span>夏日饮品</span></li>
    </ul>
  </div>
</template>

<script>
// 引入仓库
import {mapState} from 'vuex'
export default {
  name: 'Type',

  data() {
    return {
      type:''
    };
  },

  mounted() {
    // this.getType()
  },

  methods: {
    findType(e){
      var ul=document.querySelector('ul')
      if(e.target!==ul){
      if(e.target.innerText){
        this.type=e.target.innerText
      }else if(e.target.nextElementSibling){
        this.type=e.target.nextElementSibling.innerText
      }else{
        this.type=e.target.parentNode.parentNode.innerText
      }
    
      }
      // {path:`/detail/${storeid}`}
      this.$router.push({path:`/search/${this.type}`})
    
  },
  
},
computed:{
    // ...mapState({
    //   address:state=>state.home.address
    // })
  }
}
</script>
<style lang="scss" scoped>
ul{
  border: 1px solid #f2f3f5;
  border-radius: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10px 10px;
}
ul li{
  width: 86px;
  height: 80px;
  // flex-wrap: wrap;
  // justify-content: space-around;
  span{
    display: block;
    font-family:'simhei';
    font-size: 14px;
  }
}
.icon{
  width: 40px;
  height: 40px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>