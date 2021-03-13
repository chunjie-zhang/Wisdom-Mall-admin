<template>
  <div>
    <div class="navbar-div">
      <van-nav-bar title="购物车" />
    </div>
    <div class="cart-title">
      <van-button size="small" type="danger" @click="clearCart" plain>清空购物车</van-button>
    </div>
    <!-- 显示购物车中的商品-->
    <div class="cart-list">
      <div class="pang-row" v-for="(item,index) in cartInfo" :key="index">
        <div class="pang-img">
          <img :src="item.image" alt width="100%" />
        </div>
        <div class="pang-text">
          <div class="pang-goods-name">{{item.name}}</div>
          <div class="pang-control">
            <van-stepper v-model="item.count" />
          </div>
        </div>
        <div class="pang-goods-price">
          <div>￥{{item.price | moneyFilter}}</div>
          <div>x{{item.count}}</div>
          <div class="allPrice">￥{{ item.price*item.count | moneyFilter}}</div>
        </div>
      </div>
      <!--显示总价格-->
      <div class="totalMoney">商品总价格:
          <span class="totalSpan">￥{{totalMoney | moneyFilter}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { toMoney } from "@/filter/moneyFilter.js";

export default {
  data() {
    return {
      cartInfo: [], //购物车商品信息
      isEmpty: false //购物车是否为空
    };
  },
  created() {
    this.getCartInfo();
  },
  computed:{
     totalMoney(){
         let allMoney = 0;
         this.cartInfo.forEach((item,index)=>{
            allMoney+=item.price*item.count;
         })
         localStorage.cartInfo = JSON.stringify(this.cartInfo);
         return allMoney;
     }
  },
  methods: {
    //得到购物车数据的方法
    getCartInfo() {
      if (localStorage.cartInfo) {
        this.cartInfo = JSON.parse(localStorage.cartInfo);
      }
      console.log(JSON.stringify(this.cartInfo));
      this.isEmpty = this.cartInfo.length > 0 ? true : false;
    },
    clearCart() {
      localStorage.removeItem("cartInfo");
      this.cartInfo = [];
    }
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    }
  }
};
</script>

<style scoped>
.cart-title {
  margin-top: 0.2rem;
  height: 2rem;
  line-height: 2rem;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 5px;
  text-align: right;
}
.cart-list {
  background-color: #fff;
}
.pang-row {
  margin-top: 0.2rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0.4rem;
  font-size: 0.85rem;
  border-bottom: 0.2rem solid #e4e7ed;
}
.pang-img {
  flex: 6;
}
.pang-text {
  font-weight: bold;
  flex: 14;
  padding-left: 10px;
}
.pang-control {
  padding-top: 10px;
}
.pang-goods-price {
  font-weight: bold;
  flex: 4;
  text-align: right;
}
.allPrice {
  color: red;
}
.pang-goods-price div {
  padding: 0.2rem 0rem;
}
.totalMoney {
  text-align: right;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 5px;
}
.totalSpan{
    font-weight: bold;
    color:red;
}
</style>