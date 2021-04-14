<template>
  <div>
    <div v-if="isHas">
      <div class="page-position" v-if="location && location !== ''">
        <div class="page-position-name">收货地址：</div>
        <div class="page-pay-position">{{ location }}</div>
      </div>
      <div class="page-position" v-else>
        暂无收获地址，请在地址管理添加收货地址
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
            <img
              class="my-order-zfbpay"
              src="../../assets/images/zfb.png"
              alt="支付宝支付"
            />
          </div>
          <div class="my-order-zfbtext">支付宝支付</div>
          <div v-if="isSelect" class="my-order-gou">
            <img
              class="my-order-select"
              src="../../assets/images/gou.png"
              alt="选择支付方式"
            />
          </div>
        </div>
        <div class="my-pay-zfbli" @click="handlewxSelect">
          <div>
            <img
              class="my-order-zfbpay"
              src="../../assets/images/wx.png"
              alt="微信支付"
            />
          </div>
          <div class="my-order-zfbtext">微信支付</div>
          <div v-if="hasSelect" class="my-order-gou">
            <img
              class="my-order-select"
              src="../../assets/images/gou.png"
              alt="选择支付方式"
            />
          </div>
        </div>
      </div>
      <div class="page-pay-event">
        <div class="page-pay-price">
          总价：
          <span class="page-pay-total">
            {{ total.toFixed(2) }}
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
    <div v-else>
      <my-error></my-error>
    </div>
    <div class="page-kefu" @click="kefu">
      <div>
        <img class="page-img" src="../../assets/images/客服.png" alt="客服" />
      </div>
      <div class="kefu-text">
        <span class="kefu-zhin">智能客服</span>
      </div>
    </div>
    <div>
      <el-dialog title="智能客服" :visible.sync="dialogTableVisible">
        <div>
          <div class="zhinkef">智能客服正在营业中</div>
          <div class="scoket">
            <div v-for="(item, index) in scoket" :key="index">
              <div
                class="scoket-customer-block"
                v-if="item.keyword && item.keyword !== ''"
              >
                <div class="scoket-customer-service">
                  {{ item.keyword }}
                </div>
                <div>
                  <img
                    class="scoket-container"
                    src="../../assets/images/toux.jpeg"
                    alt="用户"
                  />
                </div>
              </div>
              <div
                class="scoket-container-block"
                v-if="item.repaly && item.repaly !== ''"
              >
                <div class="scoket-container-toux">
                  <img
                    class="scoket-container"
                    src="../../assets/images/客服.png"
                    alt="客服"
                  />
                  <span class="scoket-container-name">小智</span>
                </div>
                <div class="scoket-container-service">
                  {{ item.repaly }}
                </div>
              </div>
            </div>
          </div>
          <div class="input">
            <el-input
              v-model.trim="keyword"
              placeholder="请输入你的问题"
            ></el-input>
            <el-button
              class="input-btn"
              type="primary"
              @click="handleSocketSubmit"
              >提交</el-button
            >
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../serviceAPIConfig";
import myError from "../error";

export default {
  components: {
    myError,
  },
  data() {
    return {
      dialogTableVisible: false,
      keyword: "",
      scoket: [
        {
          repaly: "你好，需要什么帮助吗?", // 客服
          keyword: "", // 顾客
        },
      ],
      userName: "",
      isHas: false,
      orderPaymentData: [],
      location: "",
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
          this.location = res.data.location;
          if (res.data.message && res.data.message.length !== 0) {
            this.isHas = true;
          }
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: "error",
          });
          this.isHas = false;
        }
      })
      .catch((error) => {
        this.$message({
          showClose: true,
          message: "请求待支付订单失败",
          type: "error",
        });
        this.isHas = false;
      });
  },
  methods: {
    kefu() {
      this.dialogTableVisible = true;
    },
    handleSocketSubmit() {
      if (this.keyword === "") {
        this.$message({
          showClose: true,
          message: "请输入你的问题",
          type: "warning",
        });
        return;
      }
      let index = this.scoket.length;
      setTimeout(() => {
        this.scoket.push({
          repaly: "",
          keyword: this.keyword,
        });
      }, 300);
      axios
        .post(url.getScokeReturntData, {
          keyword: this.keyword,
        })
        .then(
          (res) => {
            if (res.data.code === 200) {
              if (
                res.data.message &&
                JSON.stringify(res.data.message) !== "{}"
              ) {
                setTimeout(() => {
                  this.scoket[index].repaly = res.data.message.repaly;
                }, 1000);
              } else {
                setTimeout(() => {
                  this.scoket[index].repaly =
                    "亲，请描述的更详细一些.小智还不了解您说的呢？";
                }, 1000);
              }
            } else {
              setTimeout(() => {
                this.scoket[index].repaly = "亲，请求发生故障了,请稍后再试！";
              }, 1000);
            }
          },
          () => {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error",
            });
          }
        );
    },
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

    /***
     * Level: 1: 0-50
     *        2: 50-150
     *        3: 150-300
     *        4: 300-500
     *        5: >500
     * total: 1: 0-100
     *        2: 100-300
     *        3: 300-500
     *        4: 500-1000
     *        5: >1000
     *
     */
    payOrder() {
      if (this.location && this.location !== "") {
        let SUB_ID = [];
        let Level = [];
        this.orderPaymentData.map((item) => {
          SUB_ID.push(item.SUB_ID);
        });

        if (this.total >= 0 && this.total <= 100) {
          Level.push(1);
        } else if (this.total > 100 && this.total <= 300) {
          Level.push(2);
        } else if (this.total > 300 && this.total <= 500) {
          Level.push(3);
        } else if (this.total > 500 && this.total <= 1000) {
          Level.push(4);
        } else if (this.total > 1000) {
          Level.push(5);
        }
        this.loading = true;
        axios
          .post(url.shoppingCartPayment, {
            userName: this.userName,
            shoppingCartData: this.orderPaymentData,
            total: this.total,
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

        axios.post(url.updateUserLoveDate, {
          SUB_ID,
          Level,
          userName: this.userName,
        });
      } else {
        this.$message({
          showClose: true,
          message: "请添加收货地址",
          type: "error",
        });
        this.$router.push({ name: "pc_location" });
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
};
</script>

<style lang= 'scss' scoped>
@import "@/assets/css/products/index.scss";
.scoket-container-name {
  position: relative;
  top: -10px;
}
.scoket-customer-service {
  display: inline-block;
  margin-right: 8px;
  max-width: 200px;
  padding: 10px 10px;
  background-color: rgba($color: #000000, $alpha: 0.1);
}
.scoket-customer-block {
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}
.scoket-container-block {
  display: flex;
  margin-top: 20px;
}
.scoket-container-service {
  display: inline-block;
  margin-left: 8px;
  max-width: 200px;
  padding: 10px 10px;
  background-color: rgba($color: #000000, $alpha: 0.1);
}
.scoket-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.input-btn {
  margin-left: 10px;
}
.input {
  padding: 0px 40px;
  display: flex;
}
.zhinkef {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
}
.scoket::-webkit-scrollbar {
  width: 0 !important;
}
.scoket {
  margin: 20px auto;
  max-width: 600px;
  height: 500px;
  overflow: scroll;
  background-color: rgba($color: #000000, $alpha: 0.02);
}
.page-img {
  width: 80px;
  height: 80px;
}
.page-kefu {
  position: fixed;
  right: 0px;
  bottom: 90px;
  border-radius: 10px;
  cursor: pointer;
}
.kefu-text {
  color: #999;
  padding-left: 6px;
}
.kefu-zhin {
  padding-top: 8px;
  padding-right: 4px;
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
  display: flex;
  padding: 10px 5px;
}
.my-order-gou {
  position: absolute;
  right: 30px;
  top: 8px;
}
.my-order-select {
  width: 25px;
  height: 25px;
  margin-top: 14px;
}
.my-order-zfbtext {
  font-size: 16px;
  margin-top: 15px;
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