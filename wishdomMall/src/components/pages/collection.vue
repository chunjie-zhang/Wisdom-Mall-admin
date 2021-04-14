<template>
  <div>
    <div v-if="!isError">
      <div class="navbar-div">
        <van-nav-bar
          title="我的收藏"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
        />
      </div>
      <div id="list-div">
        <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
          <van-list
            v-model="loading"
            finished-text="亲,没有更多了"
            :finished="finished"
            @load="onLoad"
          >
            <div
              class="list-item"
              @click="goGoodsInfo(item.ID)"
              v-for="(item, index) in serviceData"
              :key="index"
            >
              <div class="list-item-img">
                <img :src="item.IMAGE1" width="100%" :onerror="errorImg" />
              </div>
              <div class="list-item-text">
                <div>{{ item.NAME }}</div>
                <div
                  @click.stop="
                    handleCollection(item.ID, item.IS_RECOMMEND, index)
                  "
                >
                  <img
                    v-if="item.IS_RECOMMEND === 0"
                    class="list-item-collection"
                    src="../../assets/images/noCollection.png"
                    alt="收藏"
                  />
                  <img
                    v-else
                    class="list-item-collection"
                    src="../../assets/images/collection.png"
                    alt="收藏"
                  />
                </div>
                <div class="list-item-text-2">
                  ￥{{ item.ORI_PRICE | moneyFilter }}
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <div v-else>
      <my-error></my-error>
    </div>
  </div>
</template>

<script>
import item from "../pc_products/item";
import axios from "axios";
import url from "../../serviceAPIConfig";
import myError from "../error";
import { Toast } from "vant";
import { toMoney } from "@/filter/moneyFilter.js";
export default {
  components: {
    item,
    myError,
  },
  data() {
    return {
      noCollection: require("../../assets/images/noCollection.png"),
      collection: require("../../assets/images/collection.png"),
      loading: false, //是否加载
      finished: false, //上拉加载是否有数据
      isRefresh: false, //下拉加载
      errorImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"',
      serviceData: [],
      isError: false,
      collectNum: 0,
      pageSize: 1,
    };
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    },
  },
  created() {
    this.httpRequest();
  },

  methods: {
    onClickLeft() {
      this.$router.push('Member');
    },
    httpRequest() {
      if (this.refreshing) {
        this.serviceData = [];
        this.refreshing = false;
      }
      this.loading = true;
      axios
        .get(url.goodsCollectData, {
          params: {
            page: this.pageSize,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            if (res.data.message && res.data.message.length !== 0) {
              this.pageSize++;
              this.collectNum = res.data.collectNum;
              this.finished = false;
              this.serviceData = this.serviceData.concat(res.data.message);
            } else {
              this.finished = true;
              this.loading = false;
            }
            this.loading = false;
          } else {
            Toast.fail("获取请求失败");
          }
        })
        .catch(() => {
          Toast.fail("获取请求失败");
        });
    },
    //上拉加载
    onLoad() {
      setTimeout(() => {
        this.httpRequest();
      }, 1000);
    },
    //下拉加载方法
    onRefresh() {
      setTimeout(() => {
        this.isRefresh = false;
        this.serviceData = [];
        this.pageSize = 1;
        this.finished = false;
        this.onLoad();
      }, 500);
    },
    handleCollection(id, IS_RECOMMEND, index) {
      if (IS_RECOMMEND === 0) {
        axios
          .post(url.updateCollectData, {
            goodsId: id,
          })
          .then((res) => {
            res.data.code === 200
              ? (this.serviceData[index].IS_RECOMMEND = 1)
              : Toast.fail("获取请求失败");
          })
          .catch(() => {
            Toast.fail("获取请求失败");
          });
      } else if (IS_RECOMMEND === 1) {
        axios
          .post(url.cancelCollectData, {
            goodsId: id,
          })
          .then((res) => {
            res.data.code === 200
              ? (this.serviceData[index].IS_RECOMMEND = 0)
              : Toast.fail("获取请求失败");
          })
          .catch(() => {
            Toast.fail("获取请求失败");
          });
      }
    },
    //跳转商品详情页 编程式导航不能用query应该用params
    goGoodsInfo(id) {
      this.$router.push({ name: "Goods", query: { goodsId: id } });
    },
  },
};
</script>

<style lang="scss">
.collect-collcet {
  background-color: #fff;
}
.my-collect-title {
  font-size: 18px;
  font-weight: 800;
  padding: 8px 6px;
}
.collect-pagination {
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
}
.page-collect {
  display: flex;
  justify-content: center;
}
.list-item {
  display: flex;
  flex-direction: row;
  font-size: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
  padding: 5px;
}
#list-div {
  overflow: scroll;
}
.list-item-img {
  flex: 8;
}
.list-item-text {
  flex: 16;
  margin-top: 10px;
  margin-left: 10px;
  position: relative;
}
.list-item-text-2 {
  font-size: 1rem;
  color: red;
}
.list-item-collection {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 20px;
  top: 35px;
}
</style>
