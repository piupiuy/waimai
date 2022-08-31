<template>
  <div class="box">
    <!-- 顶部导航 -->
    <van-nav-bar title="确认订单" left-arrow @click-left="onClickLeft" />
    <!-- 选择地址区 -->
    <van-cell-group inset>
      <van-cell :title="title" :label="desc" icon="aim" value="" is-link @click="chooseAddress" />
      <van-cell title="送达时间" :value="sendtime" is-link  @click="timeShow=true"/>
    </van-cell-group>
    <!-- 购物车数据 -->
    <van-panel :title="this.orderInfo.shopName">
      <div>
        <van-card v-for="(good, index) in this.orderInfo.cart" :key="index" :num="good.num"
          :price="good.goodPrice * good.num" :desc="good.good" :title="good.goodName" :thumb="good.goodImg" />
      </div>
      <template #footer>
        <van-panel>
          <template #header>
            <p v-if="pagfee > 0">包装费:￥{{ pagfee }}</p>
            <p v-if="sendfee > 0">配送费:￥{{ sendfee }}</p>
          </template>
          <!-- <div>内容</div> -->
          <template #footer>
            <p style="font-size:medium;text-align: right;color: red;">总计：￥{{ total }}</p>
          </template>
        </van-panel>
      </template>
    </van-panel>
    <!-- 其他信息 -->
    <van-cell-group inset>
      <van-cell title="支付方式" :value="pay" is-link />
      <van-cell title="备注" :value="remarkInfo" @click="goRemark" is-link />
      <van-cell title="餐具份数" :value="wareInfo" is-link @click="wareChoose" />
    </van-cell-group>
    <!-- 地址弹出层 -->
    <van-popup v-model="show" position="bottom" :round="true" style="height:30em">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
         @select="chooseChange"
      />
    </van-popup>
    <!-- 选择时间弹出层 -->
    <van-action-sheet
  v-model="timeShow"
  cancel-text="取消"
  close-on-click-action
 
>
<div class="content">
  <van-picker show-toolbar title="选择送达时间"  @confirm="chooseSendTime" :columns="columns" />
</div>
    </van-action-sheet>
    <!-- 备注弹出层 -->
    <van-popup v-model="remarkShow" closeable position="bottom" round>
    <p>填写订单备注</p>
      <textarea name="" id="" cols="36" rows="6" placeholder="请输入口味，偏好等，不支持额外代购其他商品" maxlength="50" v-model="remarkInfo" ></textarea>
      <van-button type="danger" round style="display:block;margin: 0 auto; width: 15em;" @click="addRemark">确定</van-button>
    </van-popup>
    <!-- 选择餐具 -->
    <van-popup
  v-model="wareShow"
  closeable
  position="bottom"
  round
>
<p>选择餐具份数</p>
<p style="font-size:12px;color: gray;">应监管条例要求，商家不得主动提供一次性餐具</p>
<van-picker
  show-toolbar
  :columns="wares"
  @confirm="onConfirm"
/>
</van-popup>
    <!-- 提交订单 -->
    <van-submit-bar button-color="#FFBA91" :price="total * 100" button-text="提交订单" @submit="onSubmit" />
    </div>
</template>

<script>
import bus from '@/bus.js'
import CryptoJS from 'crypto-js';
import axios from 'axios';
export default {
  name: 'countPage',

  data() {
    return {
      // 接收订单数据
      orderInfo: {},
      pagfee: 0,
      sendfee: 0,
      total: 0,
      pay: '微信支付',
      // 控制地址弹出层的显示
      show: false,
      // 地址相关
      chosenAddressId: 1,
      list: [
      ],
      defaultAddress:{},
      title:'选择收货地址',
      desc:'',
      phone:'',
      username:'',
      timeShow:false,
      actions: [{ name: '选项一' }, { name: '选项二' }, { name: '选项三' }],
      columns: [
        // 第一列
        {
          values:[],
          defaultIndex: 0,
        },
        // 第二列
        {
          values: ['上午', '下午', '晚上'],
          defaultIndex: 1,
        },
      ],
      openTime:'',
      sendtime:'立即送出',
      remarkShow:false,
      remarkInfo:'',
      // 餐具
      wareShow:false,
      wares:['需要餐具，商家依据餐量提供','1份','2份','3份','4份','5份','6份','7份','8份','9份','10份','10份以上'],
      wareInfo:'必选',
      imgs:[],
      // 收货地址的号码
      telephone:''
    };
  },

  mounted() {
    bus.$on('orderInfo', (data) => {
      this.orderInfo = data
      this.openTime=data.openTime
      this.getChooseTime(data.openTime)
      let goodsFee = 0
      data.cart.forEach(item => {
        this.pagfee += parseInt(item.pagfee) * item.num
        goodsFee += item.goodPrice * item.num
        this.imgs.push(item.goodImg)
      });
      this.sendfee = data.sendfee
      this.total = this.pagfee + this.sendfee + goodsFee
    })
    this.getAddress()
  },
  methods: {
    // 返回上一页
    onClickLeft() {
      this.$router.go(-1)
    },
    // 提交订单
    onSubmit() {
      if(this.wareInfo==='必选'){
        alert('请选择餐具')
      }else if(this.phone.length!==11){
        alert('请输入用户地址信息')
      }else{
        let params={
          addressInfo:this.list[this.chosenAddressId],
          sendTime:this.sendtime,
          orderInfo:this.orderInfo,
          pagfee:this.pagfee,
          sendfee:this.sendfee,
          pay:this.pay,
          total:this.total,
          remark:this.remarkInfo,
          tableWare:this.wareInfo,
          address:this.title,
          phone:this.phone,
          username:this.username
        }
        axios.post('/api/submitorder',params).then(res=>{
          if(res.data.code===200){
            this.$router.push('/pay')
          
          
            setTimeout(() => {
               bus.$emit('orderPay',{code:res.data.orderCode,total:this.total,shopId:this.orderInfo.shopId,shopName:this.orderInfo.shopName})
            }, 100)
           
          }else{
            alert('服务器错误')
          }
        })
      }
    },
    chooseAddress() {
      this.show = true
    },
    // 添加地址
    onAdd() {
      this.$router.push('/addressedit')
    },
    // 编辑地址
    onEdit(item, index) {
      // item:地址对象  index：索引
      this.$router.push('/addresschange')
      setTimeout(function(){
        bus.$emit('changeAddress',item)
      },100)
    },
    // 获取地址
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
              this.defaultAddress=item
              this.chosenAddressId=`${id-1}`
              this.title=item.county+item.detail
              this.desc=item.username+'  '+item.phone
              this.username=item.username
            }
          });
        }
      })
    },
    // 选择地址
    chooseChange(item,index){
      this.title=item.county+item.addressDetail
      this.desc=item.name+item.tel
      this.phone=item.tel
      this.show=false
      this.chosenAddressId=index
    },
    onSelect(item) {
      this.show = false;
    },
    // 获取可选择时间()
    getChooseTime(opentime){
      // 获取当天星期数
      var a = new Array("日", "一", "二", "三", "四", "五", "六");  
      var week = new Date().getDay();  
      var str = "星期"+ a[week];
      this.columns[0].values[0]=str
      // 处理时间字符串
      let temp=opentime.toString().split('-')
      let arr=[]
      temp.forEach((item,index)=>{
        arr.push(item.toString().split(':'))
      })
      let hour=[]
      let min=[]
      arr.forEach((item,index)=>{
        item.forEach((ele,i)=>{
          ele=parseInt(ele)
          if(i===0){
            // if(ele>12){
            //   hour.push(ele-12)
            // }else{
              hour.push(ele)
            // }
          }else{
            min.push(ele)
          }
        })    
      })
      let timeValue=[]
      let len=((hour[1]*60+min[1])-(hour[0]*60+min[0]))/20
      for (let i = 0; i < len; i++) {
        let time=hour[0]*60+min[0]+i*20
        let str=''
        if(time%60===0){
          str=parseInt(time/60)+':'+time%60+'0'
        }else{
          str=parseInt(time/60)+':'+time%60
        }
        timeValue.push(str)
        
      }
      timeValue.push(hour[1]+':'+min[1])
      this.columns[1].values=timeValue
    },
    chooseSendTime(item,index){
      // this.sendtime=
      this.timeShow=false
      this.sendtime='今天('+item[0]+')'+item[1]
    },
    // 备注
    goRemark(){
      // this.$router.push('/remark')
      this.remarkShow=true
    },
    addRemark(){
      // this.remarkInfo
      this.remarkShow=false
    },
    wareChoose(){
      this.wareShow=true
    },
    onConfirm(item,index){
     this.wareInfo=item
     this.wareShow=false
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-icon-aim:before {
  color: #FFBA91;
}
.box{
  margin-bottom: 3em;
}
.goods {
  margin-top: 3em;
}

/deep/ .van-cell {
  text-align: left;
}

.van-panel {
  margin-top: 2em;

  p {
    font-size: small;
    // color: gray;
    text-align: left;
  }
}
/deep/ .van-button--danger{
  border:1px solid #FFBA91;
  background-color:#fff;
  color: black;
}
/deep/ .van-cell__title, .van-cell__value{
  flex: auto;
}
textarea{
  background-color: #f3f3f3;
  border:1px solid #f3f3f3;
  border-radius: 1em;
  font-size: 14px;
}
</style>