import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import axios from 'axios'
import {Uploader,Rate,SwipeCell,Empty,Tag,Collapse, CollapseItem ,Toast,PasswordInput, NumberKeyboard,Checkbox,CountDown,Picker,ActionSheet,Panel,Cell,Popup,SubmitBar,Sku,Button,NavBar,Tabbar,TabbarItem,Search,Card, AddressList ,AddressEdit ,Field,Icon,Tab,Tabs,TreeSelect,CellGroup,Stepper} from 'vant'
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'
// 引入仓库
import store from '@/store/index.js'

Vue.prototype.$http=axios
axios.defaults.baseURL='/api'
Vue.config.productionTip = false
Vue.use(Button).use(Uploader).use(Rate).use(SwipeCell).use(Tag).use(Empty).use(Collapse).use(Toast).use(CollapseItem).use(PasswordInput).use(NumberKeyboard).use(Checkbox).use(CountDown).use(Picker).use(ActionSheet).use(Panel).use(Cell).use(Popup).use(SubmitBar).use(Sku).use(NavBar).use(Tabbar).use(TabbarItem).use(AddressList ).use(AddressEdit ).use(Search).use(Card).use(Field).use(Icon).use(Tab).use(Tabs).use(TreeSelect).use(CellGroup).use(Stepper)
new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
