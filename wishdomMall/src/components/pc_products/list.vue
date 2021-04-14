<!--pc端详情页-左侧商品介绍组件-->
<template>
  <div class="page-list">
    <div class="m-products-list" v-if="hasData">
      <div class="m-products__name">
        {{ searchName }}
      </div>
      <ul>
        <li
          v-for="(item, index) in nav"
          :key="item.key"
          class="page-list-title"
          :class="{ 's-nav-active': item.active }"
          @click="handleTitleChange(item, index)"
        >
          {{ item.name }}
          <div
            class="page-list-sort"
            v-if="index > 0"
            :class="{ isSort:  (sort1 === -1 || sort2 === -1) && index === i }"
            @click.stop="handlejiantou(index)"
          >
            <img
              class="page-sort-jiantou"
              src="../../assets/images/箭头.png"
              alt="sort"
            />
          </div>
        </li>
      </ul>
      <el-row>
        <div v-for="(item, index) in productList" :key="index">
          <item :meta="item" />
        </div>
      </el-row>
      <div class="page-list-pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
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
          name: "默认排序",
          active: true,
        },
        {
          key: "s-price",
          name: "价格排序",
          active: false,
        },
        {
          key: "s-score",
          name: "人气排序",
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
      total: 0,
      sort1: 1,
      sort2: 1,
      i: "",
    };
  },
  components: { item, myError },
  created() {
    this.searchName = this.$route.params.name;
    this.categorySubId = this.$route.query.categorySubId;
    this.httpRequest();
  },
  methods: {
    httpRequest() {
        axios
          .post(url.getGoodsListByCategorySubID, {
            categorySubId: this.categorySubId,
            page: this.page,
          })
          .then(
            (res) => {
              this.productList = res.data.message;
              this.total = res.data.total;
              if (res.data.message.length === 0 || res.data.message === null) {
                this.hasData = false;
              }
            },
            (err) => {
              this.hasData = false;
            }
          );
    },
    getGoodsListByPrice() {
      axios
          .post(url.getGoodsListByPrice, {
            categorySubId: this.categorySubId,
            page: this.page,
            sort: this.sort1
          })
          .then(
            (res) => {
              this.productList = res.data.message;
              this.total = res.data.total;
              if (res.data.message.length === 0 || res.data.message === null) {
                this.hasData = false;
              }
            },
            (err) => {
              this.hasData = false;
            }
          );
    },
    getGoodsListBySaleCount() {
      axios
          .post(url.getGoodsListBySaleCount, {
            categorySubId: this.categorySubId,
            page: this.page,
            sort: this.sort2
          })
          .then(
            (res) => {
              this.productList = res.data.message;
              this.total = res.data.total;
              if (res.data.message.length === 0 || res.data.message === null) {
                this.hasData = false;
              }
            },
            (err) => {
              this.hasData = false;
            }
          );
    },
    handlePageChange(val) {
      this.page = val;
      this.httpRequest();
    },
    handleTitleChange(item,index) {
      this.nav.map((item) => {
        item.active = false;
      });
      item.active = true;
      if(index ===1 ) {
        this.getGoodsListByPrice()
      } else if (index === 2){
        this.getGoodsListBySaleCount()
      } else {
        this.httpRequest()
      }
      
    },
    handlejiantou(index) {
      this.i = index;
      if(index === 1) {
        this.sort1 === 1 ? this.sort1 = -1 : this.sort1 = 1;
        this.getGoodsListByPrice()

      } else if (index === 2){
        this.sort2 === 1 ? this.sort2 = -1 : this.sort2 = 1;
        this.getGoodsListBySaleCount()
      }
      console.log(this.sort1, this.sort2)
    },
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
.page-list-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #999;
}
.page-sort-jiantou {
  width: 25px;
  height: 25px;
  margin-top: 5px;
}
.page-list-title {
  position: relative;
}
.page-list-sort {
  position: absolute;
  right: -8px;
  top: -8px;
}
.isSort {
  transform: rotate(180deg);
}
</style>