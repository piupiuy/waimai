<template>
  <div>
   <!-- 头部导航栏 -->
   <van-nav-bar
  title="标题"
  left-text="返回"
  left-arrow
  @click-left="onClickLeft"
/>
<!-- 地址列表 -->
  <van-address-list
  v-model="chosenAddressId"
  :list="list"
  @edit="onEdit"
  @add="onAdd"
  @select="chooseChange"
/>
  </div>
  
</template>

<script>
import bus from '@/bus.js'
import CryptoJS from "crypto-js"
export default {
  name: 'addressPage',

  data() {
    return {
       chosenAddressId: '',
      list: [
       
      ],
      disabledList: [
        {
          id: '3',
          name: '王五',
          tel: '1320000000',
          address: '浙江省杭州市滨江区江南大道 15 号'
        }
      ]
    };
  },

  mounted() {
    this.getAddress()
  },
  beforeDestroy(){
    
  },
  methods: {
    // 返回首页
    onClickLeft(){
      this.$router.back()
    },
    // 修改地址信息
    onEdit(item,index){
      // item:地址对象  index：索引
      this.$router.push('/addresschange')
      setTimeout(function(){
        bus.$emit('changeAddress',item)
      },100)
    },
    // 新增地址
    onAdd(){
      this.$router.push('/addressedit')
    },
    // 获得用户的地址列表
    getAddress(){
      // 解密获得用户的token
      var tk = localStorage.getItem("token");//把存储的值取出
      var bytes = CryptoJS.AES.decrypt(tk, "ustinian0912");
      //要解密的值   //解密的秘钥（必须与加密的秘钥一直）
      var originalText = bytes.toString(CryptoJS.enc.Utf8);//解密操作
      // 要传输给后台的数据
      let params={token:originalText}
      this.$http.post('http://127.0.0.1:3000/api/getaddress',params).then(res=>{
        if(res.data.code===200){
          let id=0
          res.data.result.forEach(item => {
            this.list.push({
              addressid:item.addressid,
              id:`${id++}`,
              name:item.username,
              tel:item.tel,
              address:item.province===undefined?item.city+'/'+item.county+'/'+item.detail:item.province+'/'+item.city+'/'+item.county+'/'+item.detail,
              province:item.province,
              city:item.city,
              county:item.county,
              addressDetail:item.detail,
              areaCode:item.areaCode,
              isDefault:item.isDefault==1?true:false
            })
            if(item.isDefault==1){
              this.chosenAddressId=`${id-1}`
            }
          });
        }
      })
    },
    // 改变地址选择
    chooseChange(item,index){
      this.$router.push('/home')
      setTimeout(function(){
        bus.$emit('changeChoose',item)
      },100)
    },
    // 传递地址给选择地址页
    // sendAddress(){
    //   bus.$emit('sendAddress',this.list)
    // }
  },
};
</script>

<style lang="scss" scoped>
// .van-button--danger{
//   background-color: #FFBA91;
//   border: #FFBA91;
// }
</style>