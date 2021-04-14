<template>
  <div class="my-recommend">
    <div class="recommend-title">智能推荐</div>
    <div v-if="isShow">
        <div
        v-for="(item, index) in hotGoods"
        :key="index"
        class="recommend-item"
      >
        <div>
          <img
            class="recommend-image"
            :src="item.IMAGE1"
            :alt="item.NAME"
            :title="item.NAME"
            :onerror="errorImg"
            @click="jumpToDetail(item.ID)"
          />
        </div>
        <div>
          <div class="recommend-goodsName" @click="jumpToDetail(item.ID)">
            {{ item.NAME }}
          </div>
          <div class="recommend-font">
            原价￥:
            <del>{{ item.ORI_PRICE }}</del>
          </div>
          <div class="recommend-font">
            市场价￥:
            <span class="recommend-price">{{ item.PRESENT_PRICE }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
        <div
        v-for="(item, index) in hotGoods"
        :key="index"
        class="recommend-item"
      >
        <div>
          <img
            class="recommend-image"
            :src="item.image"
            :alt="item.goodsName"
            :title="item.goodsName"
            :onerror="errorImg"
            @click="jumpToDetail(item.goodsId)"
          />
        </div>
        <div>
          <div class="recommend-goodsName" @click="jumpToDetail(item.goodsId)">
            {{ item.goodsName }}
          </div>
          <div class="recommend-font">
            原价￥:
            <del>{{ item.price }}</del>
          </div>
          <div class="recommend-font">
            市场价￥:
            <span class="recommend-price">{{ item.mallPrice }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../serviceAPIConfig";
export default {
  name: "recommend",
  data() {
    return {
      isShow: true,
      hotGoods: [],
      errorImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"',
    };
  },
  created() {
    if (localStorage.getItem("userInfo")) {
      this.userName = JSON.parse(localStorage.getItem("userInfo")).userName;
    }
    axios
      .post(url.getUserRecommendData, {
        userName: this.userName,
      })
      .then(
        (res) => {
          console.log(res);
          if (res.data.code === 200) {
            if (res.data.message && res.data.message.length !== 0) {
              this.isShow = true
              this.hotGoods = res.data.message;
              console.log(this.hotGoods);
            } else {
              this.isShow = false
              axios.get(url.getShopingMallInfo).then(
                (res) => {
                  this.hotGoods = res.data.message[0].recommend;
                },
                (err) => {
                  console.log(err);
                }
              );
            }
          } else {
            this.isShow = false
            axios.get(url.getShopingMallInfo).then(
              (res) => {
                this.hotGoods = res.data.message[0].recommend;
              },
              (err) => {
                console.log(err);
              }
            );
          }
        },
        (err) => {
          this.isShow = false
          axios.get(url.getShopingMallInfo).then(
            (res) => {
              this.hotGoods = res.data.message[0].recommend;
            },
            (err) => {
              console.log(err);
            }
          );
        }
      );
  },
  methods: {
    // 跳转详情页
    jumpToDetail(id) {
      this.$router.push({ path: "/detail", query: { goodsId: id } });
    },
  },
};
</script>

<style scoped>
.my-recommend {
  margin-left: 5px;
  border-radius: 4px;
  background-color: #fff;
}
.recommend-title {
  padding: 10px 10px;
  font-size: 16px;
  color: #008c8c;
  font-weight: 900;
}
.recommend-image {
  cursor: pointer;
  width: 120px;
  height: 100px;
}
.recommend-item {
  display: flex;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 4px 1px;
}
.recommend-price {
  color: red;
  font-size: 16px;
  font-weight: 700;
}
.recommend-goodsName {
  cursor: pointer;
  line-height: 1;
  font-size: 13px;
  font-weight: 700;
  color: #000;
}
.recommend-goodsName:hover {
  cursor: pointer;
  line-height: 1;
  font-size: 13px;
  font-weight: 700;
  color: #008c8c;
}
.recommend-font {
  margin-top: 4px;
  font-size: 14px;
}
</style>