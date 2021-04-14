<template>
  <div>
    <div class="navbar-div">
      <van-nav-bar
        title="商品详情"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div class="topimage-div">
      <img
        :src="goodsInfo.IMAGE1"
        width="100%"
        @click="imageView(goodsInfo.IMAGE1)"
      />
    </div>
    <div class="goods-name">{{ goodsInfo.NAME }}</div>
    <div class="goods-count">
      <div>
        库 存:
        <span class="sales-kuncun">{{ goodsInfo.AMOUNT }}</span>
      </div>
      <div class="sale-have">
        已 售:
        <span class="sales-old">{{ goodsInfo.SALES_COUNT }}</span>
      </div>
    </div>
    <div class="goods-count">
      <div>
        原 价: ￥
        <del class="sales-kuncun">{{ goodsInfo.ORI_PRICE }}</del>
      </div>
      <div class="sale-have">
        秒 杀 价:
        <span class="sales-old">￥{{ goodsInfo.PRESENT_PRICE }}</span>
      </div>
    </div>
    <div class="goods-info">
      <!--swipeable 滑动 sticky 吸顶-->
      <van-tabs swipeable sticky>
        <van-tab title="商品详情">
          <div class="detail" v-html="goodsInfo.DETAIL"></div>
        </van-tab>
        <van-tab title="评价">
          <comment
            :commentData="goodsInfo.COMMENT"
            :goodsId="goodsId"
          ></comment>
        </van-tab>
      </van-tabs>
    </div>
    <div class="goods-bottom">
        <el-button class="goods-bottom-button" icon="el-icon-chat-dot-round" circle @click="handleJumpToLiao(goodsInfo)">
        </el-button>
      <div>
        <van-button
          size="large"
          type="primary"
          :loading="loading"
          @click="addGoodsToCart"
          >加入购物车</van-button
        >
      </div>
      <div>
        <van-button
          size="large"
          type="danger"
          :loading="loading"
          @click="goPayMent"
          >直接购买</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Toast, ImagePreview } from "vant";
import url from "@/serviceAPIConfig.js";
import { toMoney } from "@/filter/moneyFilter.js";
import comment from "../../components/component/mobile_comment";

export default {
  components: { comment },
  data() {
    return {
      loading: false,
      goodsId: "",
      goodsInfo: {}, //商品信息
    };
  },
  created() {
    if (localStorage.getItem("userInfo")) {
      this.userName = JSON.parse(localStorage.getItem("userInfo")).userName;
    }
    this.goodsId = this.$route.query.goodsId
      ? this.$route.query.goodsId
      : this.$route.params.goodsId;
    this.getInfo();
  },
  methods: {
    // 跳转聊天室
    handleJumpToLiao(goodsInfo) {
      this.$router.push({name: 'chat'})
    },
    // 获取到商品数据
    getInfo() {
      axios({
        url: url.getDetailGoodsInfo,
        method: "post",
        data: {
          goodsId: this.goodsId,
        },
      })
        .then((res) => {
          if (res.data.code == 200 && res.data.message) {
            this.goodsInfo = res.data.message;
          } else {
            Toast.error("服务器错误，数据获取失败");
          }
        })
        .catch((error) => {
          Toast.error("服务器错误，数据获取失败");
        });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    // 加入购物车
    addGoodsToCart() {
      axios
        .post(url.insertShoppingCartData, {
          goodsId: this.goodsId,
          userName: this.userName,
        })
        .then((res) => {
          if (res.data.code === 200) {
            Toast.success(res.data.message);
          } else if (res.data.code === 201 || res.data.code === 202) {
            Toast.fail(res.data.message);
          } else {
            Toast.fail("服务器错误，数据获取失败");
          }
        })
        .catch(() => {
          Toast.fail("服务器错误，数据获取失败");
        });
    },
    // 直接购买
    goPayMent() {
      this.goodsInfo.SALES_COUNT = 1;
      axios
        .post(url.waitOrderPaymentData, {
          shoppingCartData: [this.goodsInfo],
          userName: this.userName,
          doPay: true,
        })
        .then((res) => {
          if (res.data.code === 200) {
            Toast.success(res.data.message);
            this.$router.push({ name: "waitPayMent" });
          } else {
            Toast.console.error();
            res.data.message;
          }
        })
        .catch((err) => {
          Toast.error("去支付失败");
        });
    },
    imageView(item) {
      ImagePreview([item]);
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
.goods-bottom-button{
  margin: 5px 0px  0px 5px;
  width: 50px;
  height: 50px
}
.sales-old {
  color: red;
}
.sales-kuncun {
  color: #999;
}
.sale-have {
  padding-left: 15px;
}
.goods-count {
  display: flex;
  margin-top: 4px;
  justify-content: center;
}
.detail {
  font-size: 0px;
}
.goods-name {
  margin-top: 0.2rem;
  text-align: center;
  background-color: #fff;
}
.goods-price {
  text-align: center;
  color: red;
  background-color: #fff;
}
.topimage-div {
  margin-top: 0.4rem;
}
.goods-info {
  margin: 0.4rem 0rem 4.6rem;
}
.goods-bottom {
  position: fixed;
  bottom: 0px;
  left: 0px;
  background-color: #fff;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-flow: nowrap;
}
/**均分*/
.goods-bottom > div {
  flex: 1;
  padding: 5px;
}
</style>