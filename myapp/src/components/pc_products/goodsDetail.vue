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
                <el-button type="success">加入购物车</el-button>
                <el-button type="danger">直接购买</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="detail-tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="商品详情" name="first">
              <div v-html="goodsInfo.DETAIL" class="detail-images"></div>
            </el-tab-pane>
            <el-tab-pane label="评价" name="second">
              <comment :commentData="goodsInfo.COMMENT" :goodsId='goodsId'></comment>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-col>
      <el-col :span="5">
        <recommend></recommend>
      </el-col>
    </el-row>
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
      goodsId: "",
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
      this.httpRequest();
    },
  },
  created() {
    this.httpRequest();
  },
  methods: {
    httpRequest() {
      this.goodsId = this.$route.query.goodsId;
      console.log(this.$route.query.goodsId);
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style scoped>
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