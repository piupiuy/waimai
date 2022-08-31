<template>
  <div class="box">
    <!-- 顶部 -->
    <van-nav-bar left-arrow left-text="返回首页" @click-left="onClickLeft" :title="title">
      <template #right>
        <van-icon name="service-o" size="18" color="#fff" />
        <span style="color:#fff;">客服</span>
      </template>
    </van-nav-bar>
    <!-- 状态信息 -->
    <div class="head">
      <p class="insurance">
        <van-icon name="shield-o" size="18" />食安险
        <van-icon name="arrow" size="18" />
      </p>
      <van-cell-group inset>
        <van-cell>
          <template #title>
            <h3>{{ welcomeTalk }}</h3>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
            <van-icon name="after-sale" size="18" />
            <span>申请售后</span>
          </template>
          <template #default>
            <van-icon name="phone-o" size="18" />
            <span>联系商家</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <!-- 订单信息 -->
    <van-cell-group inset>
      <!-- 商品卡片区 -->
      <van-card v-for="(good, index) in goods" :key="index" :num="good.num" :price="good.price" :desc="good.attr"
        :title="good.name" :thumb="good.img"></van-card>
      <!-- 其他信息 -->
      <!-- 收货信息 -->
      <van-cell title="收货信息" :value="orderInfo.address + orderInfo.userphone + orderInfo.username" />
      <!-- 备注 -->
      <van-cell title="备注" :value="orderInfo.remark" />
      <!-- 订单号码 -->
      <van-cell title="订单号码" :value="orderInfo.orderid" />
      <!-- 展开的信息 -->
      <van-collapse v-model="activeNames">
        <van-collapse-item :title="activeNames.length > 0 ? '收起' : '展开'" name="1">
          <!-- 送达时间 -->
          <van-cell title="送达时间" value="内容" />
          <!-- 配送方式 -->
          <van-cell title="配送方式" value="商家配送" />
          <!-- 支付方式-->
          <van-cell title="支付方式" value="在线支付" />
          <!-- 下单时间-->
          <van-cell title="下单时间" :value="ordertime" />
        </van-collapse-item>
      </van-collapse>

    </van-cell-group>
  </div>
</template>

<script>
import axios from 'axios';
import bus from '@/bus'
export default {
  name: 'OrderPage',

  data() {
    return {
      orderInfo: {},
      orderStatus: 0,
      title: '',
      imgs: [],
      goods: [],
      activeNames: [],
      ordertime: '',
      welcomeTalk: '欢迎光临，下次再来'
    };
  },
  created() {
    // 获得当前订单信息
    axios.post('/api/getorder', { code: this.$route.params.id }).then(res => {
      if (res.data.code === 200) {
        // 获取订单商品信息

        this.orderInfo = res.data.data[0]
        switch (this.orderInfo.orderStatus) {
          case 0:
            this.welcomeTalk = '尚未支付，十五分钟后自动取消订单'
            break;
          case 1:
            this.welcomeTalk = '已支付，正在等待商家接单'
            break;
          case 2:
            this.welcomeTalk = '商家已接单'
            break;
          case 3:
            this.welcomeTalk = '已出餐，正在等待配送'
            break;
          case 4:
            this.welcomeTalk = '欢迎光临，下次再来'
            break;
          case 5:
            this.welcomeTalk = '欢迎光临，下次再来'
            break;
          case -1:
            this.welcomeTalk = '订单已取消'
            break;
          case -2:
            this.welcomeTalk = '商家已拒绝，换家试试吧'
            break;
        }
        let dishid = this.orderInfo.dishidArr.split('//')
        let attr = this.orderInfo.attrArr.split('::')
        let num = this.orderInfo.dishNumArr.split('//')
        let price = this.orderInfo.priceArr.split('//')
        let img = this.orderInfo.imgArr.split('//::')
        let name = this.orderInfo.dishNameArr.split('//')
        // 获取订单时间
        this.ordertime = this.GMTToStr(this.orderInfo.orderTime)
        for (let i = 0; i < dishid.length - 1; i++) {
          this.goods.push({ dishid: dishid[i], attr: attr[i], num: num[i], price: price[i], img: img[i], name: name[i] })
        }
        this.orderStatus = res.data.data[0].orderStatus
        switch (this.orderStatus) {
          case 0:
            this.title = '待付款'
            break;
          case 1:
            this.title = '正在等待商家接单'
            break;
          case -1:
            this.title = '订单已取消'
            break;
        }
      } else {
        alert('服务器错误')
      }
    })
  },
  mounted() {


  },

  methods: {
    // 格林威治时间格式转普通格式
    GMTToStr(time) {
      let date = new Date(time)
      let Str = date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds()
      return Str
    },
    // 返回首页
    onClickLeft() {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .van-nav-bar__content {
  background-color: #ffba91;
}

/deep/ .van-nav-bar__title {
  color: white;
}

.head {
  background-image: linear-gradient(to bottom, #ffba90, #ffffff);

  .insurance {
    text-align: left;
    margin-top: 0;
    padding-top: 1em;
    color: #ffffff;
  }
}

/deep/ .van-card {
  background-color: #ffffff;
}

/deep/ .van-nav-bar__text {
  color: #ffffff;
}

/deep/ .van-icon-arrow-left:before {
  color: #ffffff;
}
</style>