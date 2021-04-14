<!--pc端详情页-左侧商品介绍组件-商品介绍-->
<template>
  <dl class="s-item">
    <dt class="my-item-image">
      <img
        :src="meta.IMAGE1"
        :alt="meta.NAME"
        :title="meta.NAME"
        :onerror="errorImg"
        @click="jumpToDetail(meta.ID)"
      />
    </dt>
    <dd class="my-item-dd">
      <div @click="jumpToDetail(meta.ID)" class="my-item-name">
        {{ meta.NAME }}
      </div>
      <div @click="toCollection(meta.ID)">
        <img
          src="../../assets/images/noCollection.png"
          v-if="isCollection"
          class="item-collection item-nocollection"
          alt="收藏"
        />
        <img
          src="../../assets/images/collection.png"
          v-else
          class="item-collection item-nocollection"
          alt="收藏"
        />
        <div class="item-span-collection">收藏</div>
      </div>
      <p>
        <el-rate
          v-model="score"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}"
        ></el-rate>
        <span v-if="score > 4.5">很好</span>
        <span v-else-if="score > 4">好</span>
        <span v-else-if="score > 3.5">不错</span>
        <span v-else-if="score > 3">一般</span>
        <span v-else>很差</span>
        <span class="">{{ score }}分</span>
        <span class="s-item-comment-total">{{ meta.COMMENT_NUM }}人评论</span>
      </p>
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
      <p class="my-sale-payment">
        <span> 库存:{{ meta.AMOUNT }} </span>
        <span> 已售:{{ meta.SALES_COUNT }} </span>
      </p>
      <p class="my-date-filter">
        更新时间：{{ meta.UPDATE_TIME | dateFormat }}
      </p>
    </dd>
  </dl>
</template>

<script>
import { dateFilter } from "../../filter/dateFilter";
import axios from "axios";
import url from "../../serviceAPIConfig";
export default {
  props: ["meta"],
  data() {
    return {
      isCollection: true,
      score: this.meta.SCORE ? this.meta.SCORE : 5.0,
      errorImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"',
    };
  },
  filters: {
    //过滤器
    dateFormat(date) {
      return dateFilter(date);
    },
  },
  created() {
    const that = this;
    setTimeout(() => {
      this.isCollection = that.meta.IS_RECOMMEND === 0;
      console.log(this.meta);
    }, 300);
  },
  methods: {
    // 跳转详情页
    jumpToDetail(id) {
      this.$router.push({ path: "/detail", query: { goodsId: id } });
    },
    toCollection(id) {
      // this.meta.IS_RECOMMEND === 1
      if (this.meta.IS_RECOMMEND === 0) {
        axios
          .post(url.updateCollectData, {
            goodsId: id,
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.isCollection = false;
              this.meta.IS_RECOMMEND = 1;
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
              message: "请求失败",
              type: "error",
            });
          });
      } else if (this.meta.IS_RECOMMEND === 1) {
        axios
          .post(url.cancelCollectData, {
            goodsId: id,
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.isCollection = true;
              this.meta.IS_RECOMMEND = 0;
              console.log(this.meta.IS_RECOMMEND)
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
              message: "请求失败",
              type: "error",
            });
          });
      }
    },
  },
};
</script>

<style scoped>
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
</style>