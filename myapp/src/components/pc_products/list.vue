<!--pc端详情页-左侧商品介绍组件-->
<template>
  <div class="page-list">
    <div class="m-products-list" v-if="hasData">
      <div class="m-products__name">
        {{ searchName }}
      </div>
      <ul>
        <li
          v-for="item in nav"
          :key="item.key"
          :class="{ 's-nav-active': item.active }"
        >
          {{ item.name }}
        </li>
      </ul>
      <el-row>
        <div v-for="(item, index) in productList" :key="index">
          <item :meta="item" />
        </div>
      </el-row>
    </div>
    <my-error v-else></my-error>
  </div>
</template>

<script>
import item from "./item.vue";
import axios from "axios";
import url from "../../serviceAPIConfig";
import myError from "../error";
export default {
  data() {
    return {
      nav: [
        {
          key: "s-default",
          name: "智能排序",
          active: true,
        },
        {
          key: "s-price",
          name: "价格最低",
          active: false,
        },
        {
          key: "s-score",
          name: "人气最高",
          active: false,
        },
        {
          key: "s-comment",
          name: "评价最高",
          active: false,
        },
      ],
      productList: [
        {
          image:
            "http://images.baixingliangfan.cn/shopGoodsImg/20180408/20180408162323_88.jpg",
          title: "新希望（天香）活润草莓桑葚果粒风味酸牛奶340g/杯",
          type: "food",
          score: 4.1,
          commentNum: 0, //评论数量
          comment: [
            {
              username: "张过年",
              evalaute: "好吃",
              sub_comment: [
                {
                  username: "张过年",
                  replay: "张春节",
                  evalaute: "好吃",
                },
                {
                  username: "张过年",
                  replay: "张春节",
                  evalaute: "好吃",
                },
              ],
            },
          ],
          tab: ["火锅", "沙河"],
          address: "昌平区小汤山尚信村沿温渝河畔北岸向西3.5公里",
          avg_price: 64,
          deal_items: [
            {
              title: "新希望（天香）活润草莓桑葚果粒风味酸牛奶340g/杯",
              price: 10.9,
              counter_price: 10.9,
              saleNum: 100,
              price_type: "元",
            },
          ],
        },
      ],
      page: 1,
      categorySubId: "",
      searchName: "",
      hasData: true,
    };
  },
  components: { item, myError },
  created() {
    this.searchName = this.$route.params.name;
    this.categorySubId = this.$route.query.categorySubId;
    axios
      .post(url.getGoodsListByCategorySubID, {
        categorySubId: this.categorySubId,
        page: this.page,
      })
      .then(
        (res) => {
          console.log(res.data.message);
          this.productList = res.data.message;
          if (res.data.message.length === 0 || res.data.message === null) {
            this.hasData = false;
          }
        },
        (err) => {
          this.hasData = false;
        }
      );
  },
};
</script>

<style scoped>
.m-products__name {
  color: black;
  padding: 8px 6px;
  font-weight: 800;
  font-size: 18px;
}
</style>