// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "@/assets/css/main.css";
import store from './store.js';

import {CellGroup,Cell,Search,Tabbar,TabbarItem,Stepper,PullRefresh,Tab,Tabs,Button,Col,Row,Swipe,SwipeItem,Lazyload,List,Field,NavBar,Toast,ImagePreview,Sticky} from "vant"
//Lazyload 是按需加载


Vue.use(ElementUI)
Vue.use(Cell).use(CellGroup).use(Tabbar).use(TabbarItem).use(Stepper).use(PullRefresh).use(Tabs).use(Tab).use(NavBar).use(Field).use(Button).use(Col).use(Row).use(Swipe).use(Toast).use(SwipeItem).use(Lazyload).use(List).use(ImagePreview).use(Search).use(Sticky);

Vue.config.productionTip = false

Vue.directive("document-click",{
  bind(el,binding,vnode){
      document.addEventListener("click",binding.value,false)
  }
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
