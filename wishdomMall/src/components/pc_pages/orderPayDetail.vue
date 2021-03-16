<template>
  <div>
    <div class="page-position">
      <div class="page-position-name">收货地址：</div>
      <div class="page-pay-position">{{ $store.state.position}}</div>
    </div>
    <div
      class="page-product"
      v-for="(meta, index) in orderPaymentData"
      :key="index"
    >
      <dl class="s-item">
        <dt class="my-item-image">
          <img
            :src="meta.IMAGE1"
            :alt="meta.NAME"
            :title="meta.NAME"
            :onerror="errorImg"
          />
        </dt>
        <dd class="my-item-dd">
          <div class="my-item-name">
            {{ meta.NAME }}
          </div>
          <p>
            <span>
              原价￥
              <del>{{ meta.ORI_PRICE }}</del>
            </span>
            <span class="s-item-price">
              现价￥
              <span class="s-item-myprice">{{ meta.PRESENT_PRICE }}</span>
            </span>
          </p>
        </dd>
        <dd>
          <div class="my-cartItem-num">
            {{ "x" + meta.SALES_COUNT }}
          </div>
        </dd>
      </dl>
    </div>
    <div>
      <div class="my-pay-zfbli" @click="handlezfbSelect">
        <div>
          <img class="my-order-zfbpay" src="../../assets/images/zfb.png" alt="支付宝支付"/>
        </div>
        <div class="my-order-zfbtext">支付宝支付</div>
        <div v-if="isSelect" class="my-order-gou">
          <img class="my-order-select" src="../../assets/images/gou.png" alt="选择支付方式">
        </div>
      </div>
      <div class="my-pay-zfbli" @click="handlewxSelect">
        <div>
          <img class="my-order-zfbpay" src="../../assets/images/wx.png" alt="微信支付"/>
        </div>
        <div class="my-order-zfbtext">微信支付</div>
        <div v-if="hasSelect" class="my-order-gou">
          <img class="my-order-select" src="../../assets/images/gou.png" alt="选择支付方式">
        </div>
      </div>
    </div>
    <div class="page-pay-event">
      <div class="page-pay-price">
        总价：
        <span class="page-pay-total">
          {{ total }}
        </span>
        元
      </div>
      <div class="page-pay-detail">
        <div class="page-detail-cancel">
          <el-button type="primary" :loading="loading" @click="cancelOrder"
            >取消订单</el-button
          >
        </div>
        <div class="page-pay-order">
          <el-button type="primary" :loading="loading" @click="payOrder"
            >支付订单</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../serviceAPIConfig";

export default {
  data() {
    return {
      userName: "",
      orderPaymentData: [],
      loading: false,
      isSelect: true,
      hasSelect: false,
      errorImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"',
    };
  },
  computed: {
    total: function (newVal) {
      let allMoney = 0;
      this.orderPaymentData.forEach((item, index) => {
        allMoney += item.PRESENT_PRICE * item.SALES_COUNT;
      });
      return allMoney;
    },
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
          this.orderPaymentData = res.data.message;
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        this.$message({
          showClose: true,
          message: "请求待支付订单失败",
          type: "error",
        });
      });
  },
  methods: {
    cancelOrder() {
      this.loading = true;
      axios
        .post(url.cancelPaymentOrder, {
          userName: this.userName,
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "success",
            });
            this.loading = false;
            this.$router.push("/");
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: "请求失败",
            type: "error",
          });
        });
    },
    payOrder() {
      this.loading = true;
      axios
        .post(url.shoppingCartPayment, {
          userName: this.userName,
          shoppingCartData: this.orderPaymentData,
          total: this.total
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "success",
            });
            this.$router.push("/");
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: "请求失败",
            type: "error",
          });
        });
    },
    handlezfbSelect() {
      this.isSelect = true
      this.hasSelect = false
    },
    handlewxSelect() {
      this.isSelect = false
      this.hasSelect = true
    }
  },
};
</script>

<style lang= 'scss' scoped>
@import "@/assets/css/products/index.scss";
.page-position-name{
  font-size: 18px;
  font-weight: 800;
}
.page-pay-position{
  font-size: 16px;
  color: #999;
}
.page-position{
  display: flex;
  padding: 10px 5px;
}
.my-order-gou{
  position: absolute;
  right: 30px;
  top: 8px;
}
.my-order-select{
  width: 25px;
  height: 25px;
  margin-top: 14px;
}
.my-order-zfbtext{
  font-size: 16px;
  margin-top: 15px;
  margin-left: 20px;
}
.my-pay-zfbli{
  display: flex;
  margin-top: 8px;
  padding: 8px 8px;
  background-color: #fff;
  position: relative;
}
.my-order-zfbpay{
  width: 50px;
  height: 50px;
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