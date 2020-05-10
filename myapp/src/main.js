// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {CellGroup,Cell,Tabbar,TabbarItem,Stepper,PullRefresh,Tab,Tabs,Button,Col,Row,Swipe,SwipeItem,Lazyload,List,Field,NavBar} from "vant"
//Lazyload 是按需加载
require("../mock/index.js");


Vue.use(Cell).use(CellGroup).use(Tabbar).use(TabbarItem).use(Stepper).use(PullRefresh).use(Tabs).use(Tab).use(NavBar).use(Field).use(Button).use(Col).use(Row).use(Swipe).use(SwipeItem).use(Lazyload).use(List);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
