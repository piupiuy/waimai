<template>
  <div>
    <!-- 顶部标签页 -->
    <van-tabs v-model="active" sticky offset-top="70" style="margin-bottom:3em;">
      <van-tab title="全部">
        <van-empty description="暂无内容" v-if="orderinfo.length===0"/>
        <div v-for="(order,index) in orderinfo" :key="index" @click="gotoOrder(order.orderid)">
          <van-cell :value="getStatus(order.orderStatus)" />
          <van-card :desc="'订单金额：￥' +order.total" :title="getOrderTime(order.orderTime)" :thumb="getImg(orderinfo,index)">
            <template #tags>
              <span>实付金额：￥{{order.total}}</span>
            </template>
            <template #footer>
              <!-- <van-tag plain type="danger">标签</van-tag> -->
              <span>订单状态以订单详情页为准</span>
            </template>
          </van-card>
        </div>
      </van-tab>
      <van-tab title="待付款">
        <div v-for="(order,index) in orderinfo0" :key="index"  @click="gotoOrder(order.orderid)">
          <van-cell :value="getStatus(order.orderStatus)" />
          <van-card :desc="'订单金额：￥' +order.total" :title="getOrderTime(order.orderTime)" :thumb="getImg(orderinfo0,index)">
            <template #tags>
              <span>实付金额：￥{{order.total}}</span>
            </template>
            <template #footer>
              <!-- <van-tag plain type="danger">标签</van-tag> -->
              <span>订单状态以订单详情页为准</span>
            </template>
          </van-card>
        </div>
        <van-empty description="暂无内容" v-if="orderinfo0.length===0"/>
      </van-tab>
      <van-tab title="待评价">
         <div v-for="(order,index) in orderinfo4" :key="index">
          <van-cell :value="getStatus(order.orderStatus)" />
          <van-card :desc="'订单金额：￥' +order.total" :title="getOrderTime(order.orderTime)" :thumb="getImg(orderinfo4,index)">
            <template #tags>
              <span>实付金额：￥{{order.total}}</span>
            </template>
            <template #footer>
              <!-- <van-tag plain type="danger">标签</van-tag> -->
              <!-- <span>订单状态以订单详情页为准</span> -->
              <van-button round size="small" color="#FFBA91" @click="goComment(order.orderid)">&nbsp; 评价&nbsp;</van-button>
            </template>
          </van-card>
        </div>
         <van-empty description="暂无内容" v-if="orderinfo4.length===0"/>
      </van-tab>
      <van-tab title="已完成">
         <div v-for="(order,index) in orderinfo5" :key="index"  @click="gotoOrder(order.orderid)">
          <van-cell :value="getStatus(order.orderStatus)" />
          <van-card :desc="'订单金额：￥' +order.total" :title="getOrderTime(order.orderTime)" :thumb="getImg(orderinfo5,index)">
            <template #tags>
              <span>实付金额：￥{{order.total}}</span>
            </template>
            <template #footer>
              <!-- <van-tag plain type="danger">标签</van-tag> -->
              <!-- <span>订单状态以订单详情页为准</span> -->
              <p>订单已完成</p>
            </template>
          </van-card>
        </div>
         <van-empty description="暂无内容" v-if="orderinfo5.length===0"/>
      </van-tab>
      <van-tab title="退款/售后">
        <van-empty description="暂无内容" v-if="orderinfof.length===0" />
        <div v-for="(order,index) in orderinfof" :key="index"  @click="gotoOrder(order.orderid)">
          <van-cell :value="getStatus(order.orderStatus)" />
          <van-card :desc="'订单金额：￥' +order.total" :title="getOrderTime(order.orderTime)" :thumb="getImg(orderinfof,index)">
            <template #tags>
              <span>实付金额：￥{{order.total}}</span>
            </template>
            <template #footer>
              <!-- <van-tag plain type="danger">标签</van-tag> -->
              <span>订单状态以订单详情页为准</span>
            </template>
          </van-card>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import axios from 'axios';
import CryptoJS from 'crypto-js';
export default {
  name: 'AppIndex',

  data() {
    return {
      active: 0,
      orderinfo: [],
      // 待付款
      orderinfo0:[],
      // 待评价
      orderinfo4:[],
      // 退款/售后
      orderinfof:[],
      // 已完成
      orderinfo5:[]

    };
  },

  mounted() {
    // 解密获得用户的token
    var tk = localStorage.getItem("token");//把存储的值取出
    var bytes = CryptoJS.AES.decrypt(tk, "ustinian0912");
    //要解密的值   //解密的秘钥（必须与加密的秘钥一直）
    var originalText = bytes.toString(CryptoJS.enc.Utf8);//解密操作
    // 要传输给后台的数据
    let params = { token: originalText }
    axios.post('/api/getmyorder', params).then(res => {
      if (res.data.code === 200) {
        this.orderinfo = res.data.data
        this.orderinfo.forEach(item=>{
          switch (item.orderStatus) {
            // 待付款
            case 0:
              this.orderinfo0.push(item)
              break
          // 待评价
            case 4:
              this.orderinfo4.push(item)
              break
          // 待完成
            case 5:
              this.orderinfo5.push(item)
              break
          // 退款售后
            case -1||-2:
              this.orderinfof.push(item)
              break
          }
        })
      }
    })
  },

  methods: {
    onClickLeft() {
      this.$router.back()
    },
    // 判断订单的状态
    getStatus(status){
      switch (status) {
        case 0:
         return "未支付"
        case 1:
         return "已支付"
        case 2:
         return "已接单"
        case 3:
         return "配送中"
        case 4:
         return "已完成"
        case 5:
         return "已完成"
        case -1:
         return "已取消"
        case -2:
         return "已拒绝"
      }
    },
    //获取订单的时间
    getOrderTime(time){
    let date = new Date(time)
    let Str=date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' + 
    date.getDate() + ' ' + 
    date.getHours() + ':' + 
    date.getMinutes() + ':' + 
    date.getSeconds()
    return Str
    },
    // 获取订单的图片
    getImg(orderList,index){
      let imgarr=orderList[index].imgArr.split('//::')
      return imgarr[0]
    },
    // 点击评价订单
    goComment(orderid){
      this.$router.push(`/comment/${orderid}`)
    },
    gotoOrder(orderid){
      this.$router.push(`/order/${orderid}`)
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-card__title {
  margin-top: 1em;
  text-align: left;
}

/deep/ .van-card__desc {
  text-align: left;
}

/deep/ .van-card__content {
  text-align: left;
}

/deep/ .van-tabs__line {
  background-color: #FFBA91;
}
</style>