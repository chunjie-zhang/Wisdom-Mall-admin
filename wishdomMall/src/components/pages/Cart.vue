<template>
  <div>
    <div v-if="!isEmpty">
      <div class="navbar-div">
        <van-nav-bar title="购物车" />
      </div>
      <div class="cart-title">
        <van-button size="small" type="danger" @click="handleMoreRemove" plain
          >清空购物车</van-button
        >
      </div>
      <!-- 显示购物车中的商品-->
      <div class="cart-list">
        <div class="pang-row" v-for="(item, index) in cartInfo" :key="index">
          <div class="pang-img">
            <img :src="item.IMAGE1" alt width="100%" />
          </div>
          <div class="pang-text">
            <div class="pang-goods-name">{{ item.NAME }}</div>
            <div class="pang-control">
              <el-input-number class="pang-input-number" size="mini" v-model="item.SALES_COUNT" :min ='1'></el-input-number>
              <van-button
                type="warning"
                class="cart-delete"
                size="mini"
                @click="clearItemCart(item.ID, index)"
                >删除</van-button
              >
            </div>
          </div>
          <div class="pang-goods-price">
            <div>￥{{ item.PRESENT_PRICE | moneyFilter }}</div>
            <div>x{{ item.SALES_COUNT }}</div>
            <div class="allPrice">
              ￥{{ (item.PRESENT_PRICE * item.SALES_COUNT) | moneyFilter }}
            </div>
          </div>
        </div>
        <!--显示总价格-->
        <div class="totalMoney">
          商品总价格:
          <span class="totalSpan">￥{{ totalMoney | moneyFilter }}</span>
          <van-button
            class="page-cart-payment"
            size="normal"
            type="info"
            @click="handlePatMent"
            >去支付</van-button
          >
        </div>
      </div>
    </div>
    <div v-else>
      <error></error>
    </div>
  </div>
</template>

<script>
import { toMoney } from "@/filter/moneyFilter.js";
import error from "@/components/error";
import axios from "axios";
import url from "@/serviceAPIConfig.js";
import { Toast } from "vant";

export default {
  components: {
    error,
  },
  data() {
    return {
      cartInfo: [], //购物车商品信息
      isEmpty: true, //购物车是否为空
      userName: "",
    };
  },
  created() {
    if (localStorage.getItem("userInfo")) {
      this.userName = JSON.parse(localStorage.getItem("userInfo")).userName;
    }
    this.getCartInfo();
    setTimeout(()=>{
      this.cartInfo.map((item) => {
        item.SALES_COUNT = 1
      })
    },200)
  },
  computed: {
    totalMoney() {
      let allMoney = 0;
      this.cartInfo.forEach((item, index) => {
        allMoney += item.PRESENT_PRICE * item.SALES_COUNT;
      });
      return allMoney;
    },
  },
  methods: {
    //得到购物车数据的方法
    getCartInfo() {
      axios
        .post(url.getShoppingCartData, {
          userName: this.userName,
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.cartInfo = res.data.message;
            this.cartInfo && this.cartInfo.length === 0
              ? (this.isEmpty = true)
              : (this.isEmpty = false);
          } else {
            this.cartInfo = [];
            this.cartInfo && this.cartInfo.length === 0
              ? (this.isEmpty = true)
              : (this.isEmpty = false);
          }
        })
        .catch(() => {
          this.isEmpty = true;
          Toast.fail("请求失败");
        });
    },
    // 去支付
    handlePatMent() {
      axios
        .post(url.waitOrderPaymentData, {
          shoppingCartData: this.cartInfo,
          userName: this.userName,
        })
        .then((res) => {
          if (res.data.code === 200) {
            Toast.success(res.data.message);
            this.$router.push({ name: "waitPayMent" });
          } else {
            Toast.fail(res.data.message);
          }
        })
        .catch((err) => {
          Toast.fail("请求失败");
        });
    },
    // 清空购物车
    handleMoreRemove() {
      axios
        .post(url.removeAllShoppingData, {
          userName: this.userName,
        })
        .then((res) => {
          if (res.data.code === 200) {
            Toast.success(res.data.message);
            this.cartInfo = [];
            this.isEmpty = true;
          } else {
            Toast.fail(res.data.message);
          }
        })
        .catch(() => {
          Toast.fail("请求失败");
        });
    },
    // 删除某个购物车商品
    clearItemCart(goodsId, index) {
      axios
        .post(url.removeShoppingCartData, {
          userName: this.userName,
          goodsIdData: typeof goodsId === Array ? goodsId : [goodsId],
        })
        .then((res) => {
          if (res.data.code === 200) {
            Toast.success(res.data.message);
            this.cartInfo.splice(index, 1);
            this.cartInfo.length === 0
              ? (this.isEmpty = true)
              : (this.isEmpty = false);
          } else {
            Toast.fail(res.data.message);
          }
        })
        .catch((err) => {
          Toast.fail("请求失败");
        });
    },
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    },
  },
};
</script>

<style scoped>
.pang-input-number{
  width: 100px;
}
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
  position: relative;
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
  padding-bottom: 60px;
}
.totalSpan {
  font-weight: bold;
  color: red;
}
.page-cart-payment {
  margin-left: 15px;
  width: 100px;
  font-size: 18px;
}
.cart-delete {
  position: absolute;
  left: 110px;
  top: 14px;
}
</style>