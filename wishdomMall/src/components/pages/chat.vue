<template>
  <div>
    <div>
      <div class="navbar-div">
        <van-nav-bar
          title="智能客服"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
        />
      </div>
      <div>
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
                  class="scoket-container-kehu"
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/serviceAPIConfig.js";
import { Toast } from "vant";
export default {
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
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    kefu() {
      this.dialogTableVisible = true;
    },
    handleSocketSubmit() {
      if (this.keyword === "") {
        Toast.fail("请输入您的问题");
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
            Toast.fail("获取请求失败");
          }
        );
    },
  },
};
</script>

<style scoped>
.scoket-container-name {
  position: relative;
  top: -14px;
  left: -5px;
}
.scoket-customer-service {
  color: #606266;
  max-width: 160px;
  display: inline-block;
  margin-right: 8px;
  padding: 10px 10px;
  background: #dcdcdc;
  border-radius: 8px;
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
  color: #606266;
  max-width: 160px;
  margin-left: 8px;
  padding: 10px 10px;
  background: #dcdcdc;
  border-radius: 8px;
}
.scoket-container {
  width: 40px;
  height: 40px;
  margin-right: 5px;
  border-radius: 50%;
}
.scoket-container-kehu {
  width: 40px;
  height: 40px;
  margin-right: 5px;
  border-radius: 50%;
}
.input-btn {
  margin-left: 10px;
  margin-right: 8px;
  height: 40px;
}
.input {
  position: fixed;
  bottom: 0px;
  width: 100%;
  background-color: white;
  height: 50px;
  padding: 0px 5px;
  display: flex;
  align-items: center;
}
.zhinkef {
  text-align: center;
  padding-top: 10px;
  font-size: 18px;
  font-weight: 700;
}
.scoket::-webkit-scrollbar {
  width: 0 !important;
}
.scoket {
  min-height: 600px;
  padding-bottom: 50px;
  overflow: scroll;
  background-color: #f5f5f5;
}
.page-img {
  width: 80px;
  height: 80px;
}
.kefu-text {
  color: #999;
  padding-left: 6px;
}
.kefu-zhin {
  padding-top: 8px;
  padding-right: 4px;
}
</style>