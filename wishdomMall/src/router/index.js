import Vue from 'vue'
import Router from 'vue-router'

//移动端路由
import ShoppingMall from '@/components/pages/ShoppingMall'
import Register from '@/components/pages/Register'
import Login from '@/components/pages/Login'
import Goods from '@/components/pages/goods'
import CategoryList from '@/components/pages/CategoryList'
import Cart from '@/components/pages/Cart'
import Main from '@/components/pages/Main'
import Member from '@/components/pages/Member'
const collection = () => import ('@/components/pages/collection')
const waitPayMent = () => import ('@/components/pages/waitPayMent')
const location = () => import ('@/components/pages/location')
const search = () => import ('@/components/pages/search')
const chat = () => import ('@/components/pages/chat')

//pc端路由
const pcDefault = () => import('@/layout/default')
const pcLogin = () => import('@/components/pc_pages/login')
const pcRegister = () => import('@/components/pc_pages/register')
const pcBlank = () => import('@/layout/blank')
const pcIndex = () => import('@/components/pc_pages/index')
const changeCity = () => import('@/components/pc_pages/changeCity')
const goodsList = () => import("@/components/pc_index/goodsList")
const goodDetail = () => import('@/components/pc_products/goodsDetail')
const pcCollect = () => import('@/components/pc_pages/collect')
const pcCart = () => import('@/components/pc_pages/shoppingCart')
const pcOrderDetail = () => import('@/components/pc_pages/orderPayDetail')
const pcLocation = () => import('@/components/pc_pages/location')

Vue.use(Router)

const routes = new Router({
  mode: "history",
  routes: [
    //移动端路由
    {
      path: '/mobile',
      name: 'Main',
      component: Main,
      children: [{
          path: '/mobile/',
          name: 'ShoppingMall',
          component: ShoppingMall
        },
        {
          path: '/mobile/CategoryList',
          name: 'CategoryList',
          component: CategoryList
        },
        {
          path: '/mobile/Cart',
          name: 'Cart',
          component: Cart
        },
        {
          path: '/mobile/member',
          name: 'Member',
          component: Member
        },
      ]
    },
    {
      path: '/moblie/search',
      name: 'search',
      component: search
    },
    {
      path: '/moblie/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/moblie/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/moblie/goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/moblie/chat',
      name: 'chat',
      component: chat
    },
    {
      path: '/mobile/collection',
      name: 'Collection',
      component: collection
    },
    {
      path: '/mobile/waitPayMent',
      name: 'waitPayMent',
      component: waitPayMent
    },
    {
      path: '/mobile/location',
      name: 'location',
      component: location
    },

    //pc端路由
    {
      path: "/",
      name: "Pc_deafult",
      component: pcDefault,
      redirect: "/index",
      children: [{
          path: "/index",
          name: "pc_index",
          component: pcIndex,
        }, {
          path: '/changeCity',
          name: 'changeCity',
          component: changeCity,
        }, {
          path: 's/:name',
          name: 'goods',
          component: goodsList,
        }, {
          path: '/detail',
          name: 'Pc_detail',
          component: goodDetail
        }, {
          path: '/collect',
          name: 'pc_collect',
          component: pcCollect
        },
        {
          path: '/shoppingCart',
          name: 'shoppingCart',
          component: pcCart
        },
        {
          path: '/orderPayDetail',
          name: 'pc_orderDetail',
          component: pcOrderDetail
        },
        {
          path: '/location',
          name: 'pc_location',
          component: pcLocation
        }
      ]
    },
    {
      path: "/blank",
      name: "Pc_blank",
      component: pcBlank
    },
    {
      path: "/login",
      name: "login",
      component: pcLogin
    },
    {
      path: "/register",
      name: "register",
      component: pcRegister
    },
  ]
});

const routerName = ['goods','Pc_detail', 'pc_collect','shoppingCart', 'pc_orderDetail','pc_location','Goods','Cart','Collection','waitPayMent','CategoryList', 'location']
routes.beforeEach((to, from, next) => {
  console.log(to.name)
  if (routerName.includes(to.name)) {
    if (localStorage.getItem('userInfo')) {
      next()
    } else {
      next({
        name: 'login'
      })
    }
  } else {
    next()
  }
})
export default routes
