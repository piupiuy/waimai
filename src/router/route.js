import Home from '@/pages/home/index.vue'
import Order from '@/pages/order/index.vue'
import My from '@/pages/my/index.vue'
import Register from '@/components/Register/index.vue'
import Login from '@/components/Login/index.vue'
import Detail from '@/pages/datail/index.vue'
import Search from '@/pages/Search/index.vue'
import Address from '@/components/address/index.vue'
import AddressEdit from '@/components/addressEdit/index.vue'
import changeAddress from '@/components/changeAddress/index.vue'
import Count from '@/pages/Count/index.vue'
import Pay from '@/pages/pay/index.vue'
import PaySuccess from '@/pages/paySuccess/index.vue'
import MyOrder from '@/pages/MyOrder/index.vue'
import Comment from '@/pages/comment/index.vue'
export default[
  {
    path:'/',
    component:Home,
    meta:{
      isshow:true
    }
  },
  {
    path:'/home',
    component:Home,
    beforeEnter: (to, from, next) => {
      if (from.path === '/login' || localStorage.getItem('token').length > 0) {
        next()
      } else {
        next(false)
      }
    },
    meta:{
      isshow:true
    },
    children:[
      
    ]
  },
  {
    path:'/register',
    component:Register,
    meta:{
      isshow:false
    }
  },
  {
    path:'/login',
    component:Login,
    meta:{
      isshow:false
    }
  },
  {
    path:'/my',
    component:My,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token').length > 0) {
        next()
      } else {
        next(false)
      }
    },
    meta:{
      isshow:true
    }
  },
// 店铺详情
  {
    path:'/detail/:id',
    name:'detailPage',
    component:Detail,
    beforeEnter: (to, from, next) => {
      if (from.path === '/home'||localStorage.getItem('token').length > 0) {
        next()
      } else {
        next(false)
      }
    },
    meta:{
      isshow:false
    }
  },
  // 结算
  {
    path:'/count',
    name:'countPage',
    component:Count,
    beforeEnter: (to, from, next) => {
      if (from.path === '/detail/:id'||localStorage.getItem('token').length > 0) {
        next()
      } else {
        next(false)
      }
    },
    meta:{
      isshow:false
    }
  },
  // 订单
  {
    path:'/order/:id',
    name:'OrderPage',
    component:Order,
    beforeEnter: (to, from, next) => {
      if (from.path === '/detail/:id'||localStorage.getItem('token').length > 0) {
        next()
      } else {
        next(false)
      }
    },
    meta:{
      isshow:false
    }
  },
  {
    path:'/search/:name',
    name:'Search',
    beforeEnter: (to, from, next) => {
      if (from.path === '/home'||localStorage.getItem('token').length > 0) {
        next()
      } else {
        next(false)
      }
    },
    component:Search,
    meta:{
      isshow:true
    }
  },
  {
    path:'/address',
    component:Address,
    meta:{
      isShow:false
    }
  },
  {
    path:'/addressedit',
    component:AddressEdit,
    meta:{
      isShow:false
    }
  },
  {
    path:'/addresschange',
    component:changeAddress,
    meta:{
      isShow:false
    }
  },
  {
    path:'/pay',
    component:Pay,
    meta:{
      isShow:false
    }
  },
  {
    path:'/paysuccess',
    component:PaySuccess,
    meta:{
      isShow:false
    }
  },
  // 我的订单
  {
    path:'/myorder',
    component:MyOrder,
    meta:{
      isshow:true
    }
  },
  // 评价
  {
    path:'/comment/:id',
    name:'CommentPage',
    component:Comment,
    // beforeEnter: (to, from, next) => {
    //   if (from.path === '/myorder') {
    //     next()
    //   } else {
    //     next(false)
    //   }
    // },
    meta:{
      isshow:false
    }
  }
]