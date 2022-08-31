<template>
  <div class="box">
    <van-nav-bar
  title="发表评价"
  left-arrow
  @click-left="onClickLeft"
/>
<!-- 评价区域 -->
  <!-- 评价配送 -->
  <van-swipe-cell>
  <!-- <van-card
    title="商家配送"
    class="goods-card"
    thumb="https://img01.yzcdn.cn/vant/cat.jpeg"
    desc="准时送达"
>
  <template #tags>
    <van-rate v-model="sendRate" />
  </template>
 </van-card>
  <template #right>
    <van-button square text="删除" type="danger" class="delete-button" />
  </template> -->
</van-swipe-cell>
<!-- 评价商家 -->
<van-card
  :title="storeInfo.storename"
  :thumb="storeInfo.avatar"
>
<template #tags>
  <span>满意度</span>   <van-rate v-model="shopRate" @change="changeRate" />
     <span>&nbsp;包装&nbsp;&nbsp;</span> <van-rate v-model="pagRate" />
      <span>&nbsp;味道&nbsp;&nbsp;</span> <van-rate v-model="tasteRate"  />
  </template>
  <template #footer>
   <textarea name="" id="" cols="30" rows="8" placeholder="输入评价" v-model="comment"></textarea>
   上传图片
   <van-uploader :after-read="afterRead" :max-count="3" v-model="fileList" :max-size="30 * 1024" @oversize="onOversize"/>
   <!-- <input type="text"> -->
  </template>
</van-card>
<van-submit-bar button-text="提交评价" @submit="onSubmit" button-color="#FFBA91"/>
  </div>
  
</template>

<script>
import { Toast } from 'vant';
import axios from 'axios';
export default {
  name: 'CommentPage',

  data() {
    return {
       // 配送评分
      sendRate: 1,
      shopRate:0,
      pagRate:0,
      tasteRate:0,
      // 图片列表
      fileList:[],
      orderinfo:{},
      storeInfo:{},
      // 用户输入的评价
      comment:''
    };
  },

  mounted() {
    axios.post('/api/commentinit',{orderid:this.$route.params.id }).then((res)=>{
      // console.log(res);
      if(res.data.code===200){
        // console.log(res.data.data);
        this.orderinfo=res.data.data[0]
        // console.log(res.data.result);
        this.storeInfo=res.data.result[0]
      }
    })
  },

  methods: {
    // 返回订单页
    onClickLeft(){
      this.$router.back()
    },
    // 评分改变时
    changeRate(value){

    },
    // 图片上传
     afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
      // console.log(this.fileList[0].content);
    },
    // 限制大小
    onOversize(file) {
      Toast('文件过大');
    },
     getBase64 (file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    },
    // 上传前处理
    beforeRead(){

    },
    // 提交评价
    onSubmit(){
      var imgs=[]
      this.fileList.forEach(item=>{
        imgs.push(item.content)
      })
      let params={
        orderinfo:this.orderinfo,
        satisfy:this.shopRate,
        pag:this.pagRate,
        taste:this.tasteRate,
        comment:this.comment,
        imgs:imgs,
        orderid:this.$route.params.id
      }
      axios.post('/api/submitcomment',params).then(res=>{
        if(res.data.code===200){
          Toast('提交评价成功')
          this.$router.push('/home')
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.box{
  background-color: #f1f1f1;
}
.goods-card {
    margin: 0;
    background-color: #ffffff;
  }
.delete-button {
    height: 100%;
  }
//  /deep/ .van-rate{
//   display: block;
//  }
/deep/ .van-card{
  span{
    margin-left: 4em;
  }
}
/deep/ .van-card__footer{
  text-align: left;
  width: 100%;
}
// input{
//   width: 100%;
//   background-color: #f6f6f6;
//   border: none;
// }
textarea{
  width: 100%;
  background-color: #f6f6f6;
  border: none;
}
</style>