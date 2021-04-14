<template>
  <div class="my-detail">
    <el-row>
      <el-col :span="19" class="detail-col">
        <el-row>
          <el-col :span="10">
            <el-image
              :src="goodsInfo.IMAGE1"
              :preview-src-list="imgArr"
              :onerror="errorImg"
              fit="cover"
            >
            </el-image>
          </el-col>
          <el-col :span="14" class="detail-col">
            <div class="detail-right">
              <div class="detail-name">
                {{ goodsInfo.NAME }}
              </div>
              <div class="detail-price">
                <div>
                  原 &nbsp &nbsp &nbsp 价: ￥
                  <del>{{ goodsInfo.ORI_PRICE }}</del>
                </div>
                <div class="miao-price">
                  秒 杀 价:
                  <span class="detail-price-miao"
                    >￥{{ goodsInfo.PRESENT_PRICE }}</span
                  >
                </div>
              </div>
              <div class="detail-sales">
                <div>
                  库 存:
                  <span class="sales-kuncun">{{ goodsInfo.AMOUNT }}</span>
                </div>
                <div>
                  已 售:
                  <span class="sales-old">{{ goodsInfo.SALES_COUNT }}</span>
                </div>
              </div>
              <div class="my-date-filter">
                更新时间：{{ goodsInfo.UPDATE_TIME | dateFormat }}
              </div>
              <div class="detail-cart">
                <el-button type="success" @click="handleShoppingCart"
                  >加入购物车</el-button
                >
                <el-button type="danger" @click="handleGOPay"
                  >直接购买</el-button
                >
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="detail-tabs">
          <el-tabs v-model="activeName">
            <el-tab-pane label="商品详情" name="first">
              <div v-html="goodsInfo.DETAIL" class="detail-images"></div>
            </el-tab-pane>
            <el-tab-pane label="评价" name="second">
              <comment
                :commentData="goodsInfo.COMMENT"
                :goodsId="goodsId"
              ></comment>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-col>
      <el-col :span="5">
        <recommend></recommend>
      </el-col>
    </el-row>
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
import { dateFilter } from "../../filter/dateFilter";
import recommend from "../../components/pc_products/recommend";
import comment from "../../components/pc_products/comment";
export default {
  components: { recommend, comment },
  name: "Pc_detail",
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
      goodsId: "",
      userName: "",
      goodsInfo: {},
      imgArr: [],
      activeName: "first",
      errorImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"',
    };
  },
  filters: {
    //过滤器
    dateFormat(date) {
      return dateFilter(date);
    },
  },
  watch: {
    $route: function () {
      this.goodsId = this.$route.query.goodsId;
      this.httpRequest();
    },
  },
  created() {
    if (localStorage.getItem("userInfo")) {
      this.userName = JSON.parse(localStorage.getItem("userInfo")).userName;
    }
    this.goodsId = this.$route.query.goodsId;
    this.httpRequest();
  },
  methods: {
    httpRequest() {
      console.log(this.goodsId);
      axios
        .post(url.getDetailGoodsInfo, {
          goodsId: this.goodsId,
        })
        .then(
          (res) => {
            console.log(res.data.message);
            this.goodsInfo = res.data.message;
            this.imgArr.push(res.data.message.IMAGE1);
          },
          (err) => {
            this.goodsInfo = {};
          }
        );
    },
    // 加入购物车
    handleShoppingCart() {
      axios
        .post(url.insertShoppingCartData, {
          goodsId: this.goodsId,
          userName: this.userName,
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "success",
            });
          } else if (res.data.code === 201 || res.data.code === 202) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "warning",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "请求错误",
            type: "error",
          });
        });
    },
    // 直接购买
    handleGOPay() {
      this.goodsInfo.SALES_COUNT = 1;
      axios
        .post(url.waitOrderPaymentData, {
          shoppingCartData: [this.goodsInfo],
          userName: this.userName,
          doPay: true,
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.$router.push({ name: "pc_orderDetail" });
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "去支付失败",
            type: "error",
          });
        });
    },
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
  },
};
</script>

<style scoped>
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
.my-detail {
  width: 1180px;
  padding-top: 12px;
  margin: 0px auto;
}
.detail-right {
  margin-left: 12px;
  margin-right: 12px;
}
.detail-name {
  padding-top: 12px;
  padding-bottom: 12px;
  line-height: 1;
  font-size: 16px;
  font-weight: 700;
  color: #000;
}
.detail-col {
  background-color: #fff;
}
.detail-price {
  padding: 10px 8px;
  color: #999;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.1);
}
.detail-price-miao {
  color: red;
  font-size: 18px;
}
.miao-price {
  padding-top: 5px;
}
.detail-sales {
  margin-top: 5px;
  padding: 10px 8px;
  color: #999;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.1);
}
.sales-kuncun {
  padding-left: 5px;
}
.sales-old {
  color: red;
  padding-left: 5px;
}
.my-date-filter {
  overflow: hidden;
  float: right;
  margin-top: 5px;
}
.detail-cart {
  margin-top: 60px;
  text-align: center;
}
.detail-images {
  margin: 0px auto;
}
.detail-tabs {
  border-top: 4px solid rgba(0, 0, 0, 0.1);
}
</style>