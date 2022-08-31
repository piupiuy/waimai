<template>
  <div>
    <!-- 顶部导航 -->
    <van-nav-bar
  title="标题"
  left-text="返回"
  left-arrow
  @click-left="onClickLeft"
  :fixed="true"
/>
    <!-- 顶部背景图 -->
    <div class="backg">
      <img :src="shopInfo.storeimg" alt="">
      <van-icon name="arrow-left" @click="goBack" />
    </div>
    <!-- 店铺卡片 -->
    <div class="good">
      <h3 class="name"></h3>
      <div class="content">
        <div class="left">
          <!-- 商店图片 -->
          <img :src="shopInfo.avatar" alt="" />
        </div>
        <!-- 商店信息 -->
        <div class="right">
          <!-- 商店名称 -->
          <div class="name">
            <h1>{{ shopInfo.storename }}</h1>
            <div class="love">收藏</div>
          </div>
          <!-- 商店信息 -->
          <div class="info">
            <li>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-paihangbang"></use>
              </svg><span> {{ shopInfo.rank }}</span>
            </li>
            <!-- 配送时间 -->
            <li>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dengdaitishi"></use>
              </svg><span>{{ shopInfo.opentime }}</span>
            </li>
          </div>
        </div>
      </div>
      <!-- 底部公告 -->
      <p class="announce">公告：{{ shopInfo.public }}</p>
    </div>
    <!-- tab栏区域 -->
    <van-tabs v-model="active" swipeable>
      <van-tab title="点菜">
        <template>
          <van-tree-select height="60vm" :items="items" :main-active-index="mainActiveIndex" @click-nav="onNavClick">
            <template #content>
              <van-card v-for="(good, index) in goodInfo[mainActiveIndex]" :num="1" :key="index" :price="good.price"
                :desc="good.describeinfo" :title="good.dishname" :thumb="good.img" :origin-price="good.oprice">
                <!-- 底部按钮 -->
                <div slot="footer">
                  <van-stepper v-model="good.num" theme="round" button-size="22" disable-input v-if="good.num > 0" min="0" @plus="addCart(mainActiveIndex,index,good)"/>
                  <van-icon name="add" size="2em" color="#FFBA91" v-else @click="addCart(mainActiveIndex, index, good)" />
                </div>
              </van-card>
            </template>
          </van-tree-select>
        </template>
      </van-tab>
      <van-tab title="评价" style="background-color:#f6f6f6;">
        <van-cell-group style="margin-bottom: 1em;" inset v-for="(comment,index) in commentList" :key="index">
          <van-cell :title="getid(comment.userid)" value="" :label="'综合'+comment.shopRate+'星   '+'味道  '+comment.taste+'星   '+'包装度   '+comment.pag+'星'"/>
          <van-cell>
            <template #title>
             <p style="text-align:left;">用户评价：{{comment.commentInfo}}</p>
            </template>
          </van-cell>
          <van-cell>
            <template #title>
              <p style="text-align:left;font-size: xx-small;">商品：{{comment.dishArr}}</p>
            </template>
            <template #label> 
              <div v-for="(pic,index) in getImg(comment.img)" :key="index" style="float:left;">
                <img :src="pic" alt="" style="width:100px;0height:100px;">
                
              </div>
              <p v-if="comment.replyInfo!==null">店家回复：{{comment.replyInfo}}</p>
            </template>
            
          </van-cell>
          
        </van-cell-group>
      </van-tab>
    </van-tabs>
    <!-- 选择规格 -->
    <van-sku ref="getSkuData" v-model="show"  @sku-selected="getSelect($event)" stepper-title="数量" :disable-soldout-sku="false" :sku="sku" :show-header-image="false" :goods="goods" :goods-id="goodsId"
       show-add-cart-btn reset-stepper-on-hide
      :initial-sku="initialSku">
      <!-- 自定义步进器 -->
      <template #sku-stepper="step">
        <van-stepper v-model="value" style="float:right;"/>
      </template>
      <!-- 自定义 sku-header-price -->
      <template #sku-header="props">
        <van-card :price="price" :desc="desc" :title="title" :thumb="thumb" :num="num" :origin-price="Oprice">
        </van-card>
      </template>
      <!-- 自定义操作按钮 -->
      <template #sku-actions="actions">
        <van-button round color="#FFBA91"  @click="goCart">加入购物车</van-button>
      </template>
    </van-sku>
    <!-- 购物车 -->
    <van-popup v-model="cartShow" position="bottom" :overlay="false" style="margin-bottom:3em;">
   <!-- 顶部文字及清空按钮 -->
   <div class="cartTop">
      <span>已选商品</span>
      <div class="trash" @click="cleanCart"><van-icon name="delete-o" /><span>清空</span></div>
    </div>
    <!-- 购物车商品展示 -->
      <van-card
      v-for="(good,index) in cart" :key="index"
      :num="good.num"
      :price="good.num*good.goodPrice"
      :desc="good.good"
      :title="good.goodName"
      :thumb="good.goodImg"
    >
    <template #num>
     <van-stepper  v-model="good.num" min="0" />
    </template>
  </van-card>
    </van-popup>
    <!-- 结算 -->
    <van-submit-bar :price="total" button-text="去结算" @submit="onSubmit" :button-color="cart.length>0?'#FFBA91':'gray'" >
      <!-- 购物车 -->
      <van-icon size="2em" name="cart" :badge="cart.length" color="#FFBA91" @click="showCart" v-if="cart.length>0"/>
      <van-icon size="2em" name="cart" :badge="cart.length" color="gray" v-else/>
      <span class="mess" v-if="cart.length>0">{{message}}</span>
    </van-submit-bar>
  </div>
</template>

<script>
// 图片属于静态资源，要使用导入的方式
import defaBack from '../../assets/img/b-cake.jpg'
import axios from 'axios'
import { mapState } from 'vuex'
import CryptoJS from "crypto-js"
// 导入全局事件总线
import bus from '@/bus.js'
export default {
  name: 'detailPage',
  data() {
    return {
      // submitbar显示的信息
      message:'',
      defaBack: defaBack,
      active: 0,
      // items: [
      // ],
      // 左侧高亮元素的index
      mainActiveIndex: 0,
      // 被选中元素的id
      activeId: 0,
      img: '',
      // good: this.$route.params.good,
      storeid: this.$route.params.id,
      shopInfo: {},
      imageURL: '../../assets/logo.png',
      goodInfo: [],
      // active: 0,
      items: [],
      value: 1,
      // 购物车
      cart: [],
      // 购物车的展示
      cartShow:false,
      // 选择规格相关数据
      quota: 0,
      quotaUsed: 0,
      initialSku: {},
      show: false,
      goods: {},
      goodsId: 1,
      num: 1,
      price: 2,
      Oprice: 0,
      desc: '请选择规格',
      title: '',
      thumb: '',
      total:0,
      sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [
          {
            k: '颜色', // skuKeyName：规格类目名称
            k_s: 's1', // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
            v: [
              {
                id: '1', // skuValueId：规格值 id
                name: '红色', // skuValueName：规格值名称
              },
              {
                id: '1',
                name: '蓝色',
              }
            ],
          },
          {
            k: '辣度', // skuKeyName：规格类目名称
            k_s: 's1', // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
            v: [
              {
                id: '1', // skuValueId：规格值 id
                name: '红色', // skuValueName：规格值名称
              },
              {
                id: '1',
                name: '蓝色',
              }
            ],
          }
        ],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [
          // {
          //   id: 2259, // skuId
          //   s1: '1', // 规格类目 k_s 为 s1 的对应规格值 id
          //   s2: '1', // 规格类目 k_s 为 s2 的对应规格值 id
          //   price: 100, // 价格（单位分）
          //   stock_num: 110 ,// 当前 sku 组合对应的库存     
          // },
        ],
        price: '1.00', // 默认价格（单位元）
        stock_num: 227, // 商品总库存
        collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: false, // 是否无规格商品
        messages: [
        ],
        hide_stock: false, // 是否隐藏剩余库存,
        // 默认选中
        initialSku:{
  // 键：skuKeyStr（sku 组合列表中当前类目对应的 key 值）
  // 值：skuValueId（规格值 id）
  s1: '1',
  s2: '1',
  // 初始选中数量
  selectedNum: 3,
  // 初始选中的商品属性
  // 键：属性id
  // 值：属性值id列表
  selectedProp: {
    123: [1222]
  }
}
      },
      cartNum:1,
      // 目前点击的商品
      chooseGood:[],
      goodId:0,
      attrId:0,
      // goodPrice:0,
      goodImg:'',
      goodName:'',
      pagfee:0,
      pagfeeArr:[],
      commentList:[]
    }
  },
  created() {
    axios.post('/business/info', { token: this.$route.params.id }).then(data => {
      if (data.data.code === 200) {
        this.shopInfo = data.data.data[0]
      }
    }).then(() => {
      this.getData()
    })
  },
  mounted() {
    axios.post('/business/getcomment',{ storeid: this.$route.params.id }).then(res=>{
      if(res.data.code===200){
        this.commentList=res.data.data
      }
    })
  },
  methods: {
    // 提交订单
    onSubmit(){
      if(this.total/100<this.shopInfo.startfee){
        alert('未达到起送价')
      }else{
        let token=window.localStorage.getItem('token')
        var bytes = CryptoJS.AES.decrypt(token, "ustinian0912");
        //要解密的值   //解密的秘钥（必须与加密的秘钥一直）
        var originalText = bytes.toString(CryptoJS.enc.Utf8);//解密操作
        // 获得菜品id的集合
        
        // 给结算界面传值：店铺名，用户地址，购物车数据
        var that=this
        setTimeout(function(){
          bus.$emit('orderInfo',{sendfee:that.shopInfo.sendfee,shopName:that.shopInfo.storename,shopId:that.shopInfo.storeid,token:originalText,cart:that.cart,openTime:that.shopInfo.opentime})
        },50)
      this.$router.push('/count')
      }
      
    },
    onNavClick(index) {
      this.mainActiveIndex = index
    },
    onItemClick(data) {
      this.activeId = data.id
    },
    // 返回上一页
    goBack() {
      window.history.back()
    },
    onClickLeft(){
      this.$router.push('/home')
    },
    // 获取商品数据
    getData() {
      //此时就可以获取到在created赋值后的shopInfo了
      let params = { token: this.shopInfo.storeid }
      // 获取商品分类数据
      axios.post('/business/gettype', params).then(res => {
        if (res.data.code === 200) {
          // this.goodInfo=res.data.data
          for (let i = 0; i < res.data.data.length; i++) {
            let obj = { text: res.data.data[i].typename, id: i }
            // 添加分类选项
            this.items.push(obj)
            let arr = []
            this.goodInfo.push(arr)
            axios.post('/business/gettypedish', { typeid: res.data.data[i].typeid }).then(result => {
              if (result.data.code === 200) {
                for (let j = 0; j < result.data.result.length; j++) {
                  // 为当前分类添加数据
                  // 为数据动态绑定一个num属性，用于获取选中商品加入购物车的数量
                  let key = 'num'
                  let value = 0
                  let newResult = result.data.result[j]
                  newResult[key] = value
                  // 添加min属性，为最小售卖量
                  newResult['min']=0
                  this.goodInfo[i].push(newResult)
                }
              }
            })
          }
        }
      })
    },
    // 选规格
    addCart(mainIndex, index, good) {
      axios.post('/api/specificId', { specificId: good.specificId }).then(res => {
        if (res.data.code === 200) {
          let attrInfo=res.data.result[0]
          // 如果商品只有一种规格，则可以直接加入购物车
           // 选中的商品
           this.goodId=good.dishid
           this.attrId=good.specificId
           this.goodImg=good.img
           this.goodName=good.dishname
           this.pagfee=attrInfo.pagfee
          //  let pagfee=attrInfo.pagfee.split('//')
          //  无需选择规格的情况
          if (attrInfo.attr.indexOf('!') === -1 && attrInfo.dailyinvent.indexOf('//') === -1) {
            // 直接加入购物车的情况
            // 第一次添加
            if(good.num===0){
               good.num++
               this.cart.push({good:'',num:good.num,goodId:this.goodId,attrId:this.attrId,goodImg:this.goodImg,goodPrice:good.price,goodName:this.goodName,pagfee:this.pagfee})
            }else{
              // 添加数量
              this.cart.forEach(item=>{
                if(this.goodId===item.goodId){
                  item.num++
                }
              })
            }    
          } else {
            // 要选择规格的情况
            this.chooseGood=good
            this.show = true
            this.sku.price = good.price
            this.sku.stock_num = good.inventory
            this.title = good.dishname
            this.thumb = good.img
            this.price = good.price
            this.Oprice = good.oprice
            let attr=attrInfo.attr.split('!')
            let priceArr=attrInfo.price.split('//')
            let weightArr=attrInfo.weight.split('//')
            this.pagfeeArr=attrInfo.pagfee.split('//')
            // 用于存放属性名
            let attrName=[]
            // 存放属性的详细信息
            let count=0
            let arr=[]
            let gg=[]
            for(let j=0;j<priceArr.length;j++){
              gg.push({id:j+1,name:weightArr[j]+'￥'+priceArr[j],pagfee:this.pagfeeArr[j]})
              // count++
            }
            // 添加规格
            arr.push({k:'规格',k_s:`s${count+1}`,v:gg})
            // 添加属性
            attr.forEach(item => {
              count++
              if(item!==''){
                 attrName.push(item.split(':')[0])
                 let temp=item.split(':')[1].split('//')
                let v=[]
                let i=0
                temp.forEach(info=>{
                  if(info!==''){
                    v.push({id:i,name:info})
                    i++
                  }
                })
                arr.push({k:item.split(':')[0],k_s:`s${count+1}`,v:v})  
              }
             
            });
            this.sku.tree=arr
            // let sn=this.sku.tree.length
            let len=[]
            this.sku.tree.forEach(item=>{
              // len.push(item.v.length)
              let  temp=[]
              for (let i = 0; i < item.v.length; i++) {
                temp.push(i+1)
              }
              len.push(temp)
            })
            let List=this.doExchange(len)
            // 求出sn的个数
            let sn=List[0].length
            let s=[]
            for (let j = 1; j <= sn;j++) {
              let name='s'+j
              s.push(name)
            }
            let index=1
            // 动态展示价格
            // console.log(List);
            // List.forEach((item,j)=>{
            //   console.log(item);
            //   let obj={}
            //   item.forEach((count,k)=>{
            //     obj.id=index
            //     index++
            //     obj[s[k]]=count
            //     if(k===0){
            //       let price=this.sku.tree[0].v[parseInt(count)-1].name.split('￥')[1]
            //       obj.price=parseInt(price)
            //       // this.goodPrice=parseInt(price)
            //     }
            //   })
            //   this.sku.list.push(obj)
            // }).catch(err=>{
            //   console.log(err);
            // })
        }}
      })
    },
   doExchange(arr){
        var len = arr.length;
        // 当数组大于等于2个的时候
        if(len >= 2){
            // 第一个数组的长度
            var len1 = arr[0].length;
            // 第二个数组的长度
            var len2 = arr[1].length;
            // 2个数组产生的组合数
            var lenBoth = len1 * len2;
            //  申明一个新数组
            var items = new Array(lenBoth);
            // 申明新数组的索引
            var index = 0;
            for(let i=0; i<len1; i++){
                for(let j=0; j<len2; j++){
                    if(arr[0][i] instanceof Array){
                        items[index] = arr[0][i].concat(arr[1][j]);
                    }else{
                        items[index] = [arr[0][i]].concat(arr[1][j]);
                    }
                    index++;
                }
            }
            var newArr = new Array(len -1);
            for(let i=2;i<arr.length;i++){
                newArr[i-1] = arr[i];
            }
            newArr[0] = items;
            return this.doExchange(newArr);
        }else{
            return arr[0];
        }
    },
    // 加入购物车
    goCart(){
      if(this.chooseGood.num===0){
               this.chooseGood.num++
      }  
      // selectedSku
      if(this.$refs.getSkuData.selectedSkuValues.length===0){
        alert('请选择规格')
      }else{
        // 获得选中的商品规格
        let arr=this.$refs.getSkuData.selectedSkuValues
        let str=''
        arr.forEach(attr=>{
          str=str+attr.name+'/'
        })
        this.cart.push({good:str,num:this.value,goodId:this.goodId,attrId:this.attrId,goodImg:this.goodImg,goodPrice:this.price,goodName:this.goodName,pagfee:this.pagfee})
        this.show=false
      }
    },
    // 获得挑选的属性
    getSelect (e){
      if(e.skuValue.skuKeyStr=='s1'){
        // 动态展示价格
        let price=e.skuValue.name.split('￥')[1]
        this.price=parseInt(price)
        // let len=this.sku.tree.length
        this.pagfee=this.pagfeeArr[e.skuValue.id-1]
      }
    },
    // 购物车细节的显示与隐藏
    showCart(){
      this.cartShow===true?this.cartShow=false:this.cartShow=true
    },
    // 清空购物车
    cleanCart(){
      this.cartShow=false
      this.cart=[]
      this.goodInfo.forEach(item=>{
        item.forEach(item=>{
          item.num=0
        })
      })
    },
    getImg(imgs){
      let pics=imgs.split(':://')
      return pics
    },
    // 获得用户的id
    getid(id){
      
      let len=String(id)
      let arr=len.split('')
      let newarr=arr[0]+arr[1]+'***'+arr[len.length-1]
      return newarr
    }
  },
  computed: {

  },
  watch: {
  cart:{
    handler(newValue,oldValue){
    // this.total=0
    let temp=0
    for (let i = 0; i < newValue.length; i++) {
      let item=newValue[i]
      // let old=oldValue[i]
      // 如果改变了数量
        let id=item.goodId
        this.goodInfo.forEach(good=>{
          good.forEach(dish=>{
            if(dish.dishid===id){
               dish.num=item.num
            }
          })
        })
    }
    newValue.forEach((item,index)=>{
     temp=temp+item.goodPrice*item.num
    //  当购物车某一项商品数量为0时，删除这一项的数据
     if(item.num===0){
      this.cart.splice(index,1)
      if(this.cart.length>0){
        this.cartShow=false
      }
     }
     let message=''
     if(temp<this.shopInfo.startfee){
      let rest=this.shopInfo.startfee-temp
      message='还差'+rest+'元起送'
     }else{
        if(this.shopInfo.sendfee===0){
          message='免配送费'
        }else{
          message='预估加配送费￥'+this.shopInfo.sendfee+'元'
        }
     }
     this.message=message
    })
    
    this.total=temp.toFixed(2)*100
   },
   deep:true
  }
  }
}
</script>

<style lang="scss" scoped>
div {
  /deep/ .van-nav-bar{
    z-index: 1000;
  }
  .backg {
    position: absolute;
    margin-bottom: 3em;
    top: 3em;
    left: 0;
    width: 100%;
    height: 100px;
    opacity: 0.6;

    img {
      width: 100%;
      height: 100%;
    }

    .van-icon {
      color: #fafafa;
      float: left;
      margin-top: 35px;
    }
  }

  .good {
    margin-bottom: 3em;
    position: absolute;
    color: #323233;
    padding: 5px 15px;
    font-size: 12px;
    box-sizing: border-box;
    background-color: #fafafa;
    border: 1px saddlebrown solid;
    height: 100px;
    width: 90%;
    margin-left: 5%;
    z-index: 2;
    top: 90px;
    border-radius: 10px;

    .left {
      height: 50px;
      right: 50px;
      overflow: hidden;
      float: left;
      border: 1px solid salmon;

      img {
        height: 50px;
        width: 50px;
      }
    }

    .right {
      .name {
        h1 {
          float: left;
          position: absolute;
          top: 0;
          left: 80px;
        }

        .love {
          float: right;
          border: 1px solid gray;
          width: 40px;
          font-size: 12px;
        }
      }

      .info {
        position: absolute;
        top: 50px;
        left: 50px;

        li {
          list-style: none;
          float: left;
          margin-left: 30px;
        }
      }
    }

    .announce {
      position: absolute;
      top: 65px;
      color: gray;
    }
  }

 .van-tabs {

    margin-bottom: 3em;
   /deep/ .van-tab{
      margin-top: 2em;
      margin-bottom: 3em;
    }
   /deep/ .van-tree-select{
    margin-top:1em;
   }
    /deep/ .van-tabs__line {
      background-color: #FFBA91;
    }

    display: block;
    margin-top: 180px;

    /deep/ .van-stepper--round .van-stepper__plus {
      background-color: #FFBA91
    }

    /deep/ .van-sidebar-item--select::before {
      background-color: #FFBA91;
    }
  }

  /deep/ .van-card__title {
    font-weight: bold;
  }

  /deep/ .van-sku-row__title {
    text-align: left;
  }

  /deep/ .van-card__price {
    color: red;
  }

  /deep/ .van-card__price-integer {
    color: red;
  }
  // /deep/ .van-popup{
  //   z-index: 50;
  // }
 
  .cartTop{
    margin: 1em;
    margin-bottom: 3em;
    span{
      float: left;
      font-weight: bold;
    }
    .trash{
      float: right;
    //   .van-icon{
    //   float: right;
    // }
    span{
      font-size: xx-small;
    }
    }
    
  }
  .mess{
    font-size: xx-small;
    color: gray;
  }
}
</style>
