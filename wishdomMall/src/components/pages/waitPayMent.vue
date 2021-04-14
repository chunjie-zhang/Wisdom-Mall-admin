<template>
  <div>
    <div class="navbar-div">
      <van-nav-bar
        title="我的订单"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div v-if="isHas">
      <div class="page-position" v-if="location && location !== ''">
        <div class="page-position-name">收货地址：</div>
        <div class="page-pay-position">{{ location }}</div>
      </div>
      <div class="page-position" v-else>
        暂无收获地址，请在地址管理添加收货地址
      </div>
      <!-- 显示购物车中的商品-->
      <div class="cart-list">
        <div class="pang-row" v-for="(item, index) in cartInfo" :key="index">
          <div class="pang-img">
            <img :src="item.IMAGE1" alt width="100%" :onerror="errorImg" />
          </div>
          <div class="pang-text">
            <div class="pang-goods-name">{{ item.NAME }}</div>
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
          <div>
            <div class="my-pay-zfbli" @click="handlezfbSelect">
              <div>
                <img class="my-order-zfbpay" :src="wxSrc" alt="支付宝支付" />
              </div>
              <div class="my-order-zfbtext">支付宝支付</div>
              <div v-if="isSelect" class="my-order-gou">
                <img class="my-order-select" :src="pay" alt="选择支付方式" />
              </div>
            </div>
            <div class="my-pay-zfbli" @click="handlewxSelect">
              <div>
                <img class="my-order-zfbpay" :src="zfbSrc" alt="微信支付" />
              </div>
              <div class="my-order-zfbtext">微信支付</div>
              <div v-if="hasSelect" class="my-order-gou">
                <img class="my-order-select" :src="pay" alt="选择支付方式" />
              </div>
            </div>
          </div>
          <div class="page-cart-payment">
            <van-button
              :loading="loading"
              size="normal"
              type="info"
              @click="cancelPayMent"
              >取消订单</van-button
            >
            <van-button
              :loading="loading"
              size="normal"
              type="info"
              @click="handlePatMent"
              >支付订单</van-button
            >
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <my-error></my-error>
    </div>
  </div>
</template>

<script>
import { toMoney } from "@/filter/moneyFilter.js";
import myError from "../error";
import axios from "axios";
import url from "@/serviceAPIConfig.js";
import { Toast } from "vant";

export default {
  components: {
    myError,
  },
  data() {
    return {
      location: "",
      isHas: false,
      loading: false,
      isSelect: true,
      hasSelect: false,
      cartInfo: [], //购物车商品信息
      isEmpty: true, //购物车是否为空
      userName: "",
      errorImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"',
      wxSrc: require("../../assets/images/zfb.png"),
      pay: require("../../assets/images/gou.png"),
      zfbSrc: require("../../assets/images/wx.png"),
    };
  },
  created() {
    if (localStorage.getItem("userInfo")) {
      this.userName = JSON.parse(localStorage.getItem("userInfo")).userName;
    }
    axios
      .post(url.getOrderPaymentData, {
        userName: this.userName,
      })
      .then((res) => {
        if (res.data.code === 200) {
          this.cartInfo = res.data.message;
          this.location = res.data.location;
          if (res.data.message && res.data.message.length !== 0) {
            this.isHas = true;
          }
        } else {
          Toast.fail(res.data.message);
          this.isHas = false;
        }
      })
      .catch((error) => {
        Toast.fail("请求待支付订单失败");
        this.isHas = false;
      });
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
    onClickLeft() {
      this.$router.push("Member");
    },
    cancelPayMent() {
      this.loading = true;
      axios
        .post(url.cancelPaymentOrder, {
          userName: this.userName,
        })
        .then((res) => {
          if (res.data.code === 200) {
            Toast.success(res.data.message);
            this.loading = false;
            this.$router.push("/mobile/");
          } else {
            this.loading = false;
            Toast.fail(res.data.message);
          }
        })
        .catch((error) => {
          this.loading = false;
          Toast.fail("请求失败");
        });
    },
    handlePatMent() {
      if (this.location && this.location !== "") {
        let SUB_ID = [];
        let Level = [];
        this.cartInfo.map((item) => {
          SUB_ID.push(item.SUB_ID);
        });

        if (this.totalMoney >= 0 && this.totalMoney <= 100) {
          Level.push(1);
        } else if (this.totalMoney > 100 && this.totalMoney <= 300) {
          Level.push(2);
        } else if (this.totalMoney > 300 && thistotalMoney <= 500) {
          Level.push(3);
        } else if (this.totalMoney > 500 && this.totalMoney <= 1000) {
          Level.push(4);
        } else if (this.totalMoney > 1000) {
          Level.push(5);
        }
        this.loading = true;
        axios
          .post(url.shoppingCartPayment, {
            userName: this.userName,
            shoppingCartData: this.cartInfo,
            total: this.totalMoney,
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.loading = false;
              Toast.success(res.data.message);
              this.$router.push("/mobile/");
            } else {
              this.loading = false;
              Toast.fail(res.data.message);
            }
          })
          .catch((error) => {
            this.loading = false;
            Toast.fail("请求失败");
          });

        axios.post(url.updateUserLoveDate, {
          SUB_ID,
          Level,
          userName: this.userName,
        });
      } else {
        Toast.fail("请添加收货地址");
        this.$router.push({ name: "location" });
      }
    },
    handlezfbSelect() {
      this.isSelect = true;
      this.hasSelect = false;
    },
    handlewxSelect() {
      this.isSelect = false;
      this.hasSelect = true;
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
.pang-input-number {
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
  padding: 5px;
}
.totalSpan {
  font-weight: bold;
  color: red;
}
.page-cart-payment {
}
.cart-delete {
  position: absolute;
  left: 110px;
  top: 14px;
}
.page-position-name {
  font-size: 18px;
  font-weight: 800;
}
.page-pay-position {
  font-size: 16px;
  color: #999;
}
.page-position {
  padding: 10px 5px;
}
.my-order-gou {
  position: absolute;
  right: 30px;
  top: 8px;
}
.my-order-select {
  width: 20px;
  height: 20px;
  margin-top: 5px;
}
.my-order-zfbtext {
  font-size: 16px;
  margin-top: 5px;
  margin-left: 20px;
}
.my-pay-zfbli {
  display: flex;
  margin-top: 8px;
  padding: 8px 8px;
  background-color: #fff;
  position: relative;
}
.my-order-zfbpay {
  width: 35px;
  height: 35px;
}
.page-pay-order {
  margin-right: 20px;
}
.page-detail-cancel {
  margin-right: 50px;
}
.page-pay-price {
  margin-top: 8px;
  margin-right: 30px;
}
.page-pay-event {
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
  margin-top: 5px;
  background-color: #fff;
}
.page-pay-detail {
  display: flex;
  justify-content: flex-end;
}
.page-pay-total {
  color: red;
}
.page-product {
  background-color: #fff;
}
.my-date-filter {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
}
.my-sale-payment {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
}
.my-item-image {
  cursor: pointer;
}
.my-item-name {
  cursor: pointer;
  display: inline;
  font-size: 18px;
  font-weight: 900;
}
.my-item-name:hover {
  color: #008c8c;
}
.item-nocollection {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.item-collection {
  position: absolute;
  right: 50px;
  top: 0px;
}
.item-span-collection {
  position: absolute;
  top: 5px;
  right: 20px;
  font-size: 12px;
  line-height: 16px;
  height: 16px;
  color: #999;
  cursor: pointer;
}
.s-item-myprice {
  font-size: 16px !important;
  font-weight: 600;
}
.my-item-dd {
  position: relative;
}
.my-cartItem-num {
  font-size: 16px;
  padding: 10px 4px;
  color: #999;
}
.my-cartItem-style {
  display: flex;
  margin-left: -384px;
}
.my-cartItem-totalPrice {
  padding: 8px 8px;
  color: black;
  font-size: 16px;
}
.my-cartItem-discount {
  padding: 8px 8px;
  color: #008c8c;
  font-size: 16px;
}
.my-cartItem-discountPrice {
  padding: 8px 8px;
  color: red;
  font-size: 16px;
}
.my-cartItem-btn {
  margin-top: -40px;
}
</style>