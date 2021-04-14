<template>
  <div>
      <div class="navbar-div">
      <van-nav-bar
        title="地址管理"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div class="page-position" v-if="currentLocation && currentLocation !== ''">
      <div class="page-position-name">当前收货地址：</div>
      <div class="page-pay-position">{{ currentLocation }}</div>
    </div>
    <div class="page-position" v-else>
      暂无收获地址，请在地址管理添加收货地址
    </div>
    <div class="my-textarea">
       <el-input
      type="textarea"
      :rows="5"
      placeholder="请输入内容"
      v-model="location"
      maxlength="50"
    >
    </el-input> 
    </div>
    <div class="my-location">
      <el-button type="primary" @click="handleLocationCommit">提交</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../serviceAPIConfig";
import { Toast } from "vant"

export default {
  data() {
    return {
      location: "",
      userName: "",
      currentLocation: "",
    };
  },
  created() {
    if (localStorage.getItem("userInfo")) {
      this.userName = JSON.parse(localStorage.getItem("userInfo")).userName;
    }
    axios
      .post(url.getOrderPaymentData, {
        userName: this.userName,
      })
      .then((res) => {
        if (res.data.code === 200) {
          this.currentLocation = res.data.location;
        } else {
          Toast.fail('获取地址失败');
        }
      })
      .catch((error) => {
       Toast.fail('获取地址失败');
      });
  },
  methods: {
    handleLocationCommit() {
      if (this.location === "") {
        Toast.fail('输入不能为空');
        return;
      }
      axios
        .post(url.userLocationData, {
          userName: this.userName,
          location: this.location,
        })
        .then((res) => {
          if (res.data.code === 200) {
            Toast.success(res.data.message);
          } else {
            Toast.fail(res.data.message);
          }
        })
        .catch((error) => {
          Toast.fail('保存地址失败');
        });
    },
     onClickLeft() {
      this.$router.push('Member');
    },
  },
};
</script>

<style scoped>
.my-textarea{
    margin: 0px auto;
    width: calc( 100% - 20px );
}
.my-location {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  margin-right: 5px;
}
.page-position-name {
    padding: 0px 5px;
  font-size: 18px;
  font-weight: 800;
}
.page-pay-position {
    padding: 8px 5px;
  font-size: 16px;
  color: #999;
}
.page-position {
  padding: 15px 5px;
}
</style>