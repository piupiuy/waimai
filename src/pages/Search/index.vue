<template>
  <div>
    <!-- 搜索区域 -->
    <div class="goods" v-if="shopList.length>0">
      <div class="good" v-for="(good, index) in shopList" :key="index" @click="goDetail(good.storeid,good)" >
        <img :src="good.avatar" alt="" />
        <h3 class="name">{{ good.storename }}</h3>
        <div class="content">
          <!-- <div class="info">
            <div class="left">
              <li>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jingxuanshoucang"></use>
                </svg><span>{{ good.rating }}</span>
              </li>
              <li>月售:{{ good.recent_order_num }}</li>
            </div>
            <div class="right">
              <li>{{ good.order_lead_time }}</li>
              <li>{{ good.distance }}</li>
            </div>
          </div> -->
          <div class="deliver">
            <ul>
              <li>起送:￥{{good.startfee}}</li>
              <li>配送:￥{{ good.sendfee }}</li>
              <li>人均:￥{{ good.startfee }}</li>
            </ul>
          </div>
          <p class="comment">{{ good.public}}</p>
        </div>
      </div>
    </div>
    <!-- 空状态 -->
    <van-empty
  class="custom-image"
  image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
  description="未找到结果"
  v-else
/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios';
import bus from '@/bus';
export default {
  name: 'Search',
  // 注入reload方法
  data() {
    return {
      type: this.$route.params.name,
      shopList:[]
    };
  },
  created() {

  },
  mounted() {
    // if (this.address) {
    //   let params = { address: this.address, type: this.$route.params.type }
    //   // this.$store.dispatch('getCategory', params)
    // } else {
    //   alert('获取地址失败')
    // }
    axios.post('/api/gettype',{type:this.type}).then(res=>{
      if(res.data.code===200){
        res.data.data.forEach(item=>{
          this.shopList.push(item)
        })
        
      }
    })
    axios.post('/api/search',{keyword:this.type}).then(res=>{
      if(res.data.code===200){
        res.data.arr.forEach(item=>{
          this.shopList.push(item)
        })
      }
    })
  },

  methods: {
    goDetail(storeid,shop){
       this.$router.push({path:`/detail/${storeid}`})
      setTimeout(function () {
        bus.$emit('getShopInfo',shop )
      },100)
    }
  },
  computed: {
    ...mapState({
      address: state => state.home.address,
      shops: state => state.search.shops,

    })
  },
  watch: {

  }
};
</script>

<style lang="scss" scoped>
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