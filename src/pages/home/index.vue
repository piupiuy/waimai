<template>
  <div>
    <div class="address">
      <!-- <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-_dingwei"></use>
      </svg> -->
     <van-cell-group>
      <van-field left-icon="location" v-model="value" :placeholder="this.address" @click="goAddress" />
    </van-cell-group>
    </div>
    <!-- <Search></Search> -->
    <van-search
      v-model="keyword"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <Type></Type>
    <div class="goods">
      <div class="good" v-for="(shop, index) in shops" :key="index" @click="goDetail(shop.storeid,shop)">
        <img :src="shop.avatar" alt="" />
        <h3 class="name">{{ shop.storename }}</h3>
        <div class="content">
          <!-- <div class="info">
            <div class="left">
              <li>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jingxuanshoucang"></use>
                </svg><span>{{getRate(shop.storeid) }}</span>
              </li>
              <li>月售:{{ shop.sendfee }}</li>
            </div>
            <div class="right">
              <li>{{ shop.sendfee }}</li>
              <li>{{ shop.sendfee}}</li>
            </div>
          </div> -->
          <div class="deliver">
            <ul>
              <li>起送:￥{{shop.startfee}}</li>
              <li>配送:￥{{shop.sendfee }}</li>
              <li>人均:￥{{ shop.startfee }}</li>
            </ul>
          </div>
          <p class="comment">{{ shop.public }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Type from './type/index.vue'
import Search from './search/index.vue'
// 导入仓库的state
import { mapState } from 'vuex'
import CryptoJS from "crypto-js"
// 导入全局事件总线
import bus from '@/bus'
import axios from 'axios'
export default {
  name: 'Home',

  data() {
    return {
      // 用户的地址信息
      img: '../../assets/logo.png',
      // 用户的经纬度
      ak: '7khcth5v6N9ddhW0spLMGg8ZuF5HAbzq',
      // imgs: [],
      imgShow: false,
      value:'',
      keyword:''
    }
  },
  components: {
    Type,
    Search,
  },
  mounted() {
    // 获得默认地址
     this.getDefaultAddress()
  },
  created() { 
    bus.$on('changeChoose',(item)=>{
      this.value=item.address
    })
  },
  beforeDestroy() { },
  methods: {
    getGeo() {
      this.$store.dispatch('getGeo')
      this.getAddress()
    },
    // 根据得到的经纬度得到当前地址
    getAddress() {
      //  let geo =window.localStorage.getItem("geo")
      if (this.geo) {
        this.$store.dispatch('getAddress', this.geo)
      } else {
        let geo = window.localStorage.getItem('geo')
        this.$store.dispatch('getAddress', geo)
      }

      this.getHomeGoods()
    },
    //-------------------------------------------------------------------------
    // 获得默认地址
    getDefaultAddress(){
       var tk = localStorage.getItem("token");//把存储的值取出
      var bytes = CryptoJS.AES.decrypt(tk, "ustinian0912");
      //要解密的值   //解密的秘钥（必须与加密的秘钥一直）
      var originalText = bytes.toString(CryptoJS.enc.Utf8);//解密操作
      // 要传输给后台的数据
      let params={token:originalText}
      this.$http.post('http://127.0.0.1:3000/api/getdefault',params).then(res=>{
      if(res.data.code===200){
        let result=res.data.data[0]
        this.value=result.province+'/'+result.city+'/'+result.county+'/'+result.detail
         this.getGoods(this.value)
       }
      })
    
    },
     // 进入选择地址界面
    goAddress(){
      this.$router.push('/address')
    },
    // 根据选择的地址展示首页商店
    getGoods(value){
      let params={address:value}
      this.$store.dispatch('getGoods', params)
    },
    // 跳转到商品详情页
    goDetail(storeid,shop) {
      // var image=document.querySelector('.good img')
      // let imgpath = shop.storeimg
      // var pic = window.localStorage.getItem(imgpath)
      this.$router.push({path:`/detail/${storeid}`})
      setTimeout(function () {
        bus.$emit('getShopInfo',shop )
      },100)
      
    },
    // ------------------------------------------------------------------------------
    // 获得店铺评分
    // getRate(storeid){
    //   axios.post('/business/gettotal', {storeid:storeid}).then(res => {
    //     if (res.data.code === 200) {
    //      let  soldSum = res.data.data[0].sold
    //      let soldCount = res.data.data[0].count1
    //      let dishNum = res.data.result[0].count2   
    //     }
    //   })
    // return soldCount
    // }
  //  搜索
  onSearch(){
    this.$router.push({path:`/search/${this.keyword}`})
   
  }
  },
  computed: {
    ...mapState({
      shopNum: (state) => state.home.shops.length,
      shops: (state) => state.home.shops,
      // geo: (state) => state.home.geo,
      address: (state) => state.home.address,
      imgs: (state) => state.home.imgs,
    }),
  },
  watch:{

     value:{
      handler(newName, oldName) {
        setTimeout(() => {
          let address=newName
         this.getGoods(address)
        }, 500);
        
      },
     }
  }
}
</script>

<style lang="scss" scoped>
.address {
  height: 25px;
  width: 100%;
  overflow: hidden;

  svg {
    float: left;
  }

  // input {
  //   overflow: hidden;
  //   width: 200px;
  // }
  .van-cell{
    padding: 0;
  }
}

.goods {
  margin-bottom: 22px;

  .good {
    position: relative;
    color: #323233;
    padding: 5px 15px;
    font-size: 12px;
    box-sizing: border-box;
    background-color: #fafafa;
    height: 120px;
    margin: 5px;

    img {
      position: absolute;
      height: 80px;
      width: 80px;
      left: 2px;
      top: 10px;
    }

    h3 {
      position: absolute;
      top: 0;
      left: 90px;
    }

    .content {
      position: absolute;
      left: 90px;
      top: 40px;
      width: 270px;
      height: 50px;
      padding: 0;

      .info {
        height: 10px;
        line-height: 12px;

        .left {
          float: left;

          li {
            list-style: none;
            float: left;
            margin: 2px;

            span {
              font-size: 5px;
            }
          }
        }

        .right {
          float: right;
          width: 100px;

          li {
            list-style: none;
            margin: 2px;
          }

          li:nth-child(1) {
            float: left;
          }
        }
      }

      .deliver {
        margin-left: 2px;
        margin-top: 10px;
        line-height: 12px;
        position: relative;

        ul {
          position: absolute;

          li {
            list-style: none;
            float: left;
            margin-right: 10px;
          }
        }
      }

      .comment {
        margin-top: 25px;
        background: #f8edda;
        color: orange;
        border-radius: 4px;
      }
    }
  }
}
</style>
