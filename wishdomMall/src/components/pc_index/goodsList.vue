<!--pc端商品详情页-->
<template>
  <div class="page-product">
    <el-row>
      <el-col :span="19">
        <el-row>
          <list />
        </el-row>
      </el-col>
      <el-col :span="5">
        <recommend />
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
import recommend from "../../components/pc_products/recommend";
import list from "@/components/pc_products/list.vue";
export default {
  components: {
    list,
    recommend,
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
    };
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
  },
};
</script>

<style lang="scss">
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
</style>