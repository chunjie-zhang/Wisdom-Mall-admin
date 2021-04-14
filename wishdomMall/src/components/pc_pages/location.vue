<template>
  <div>
    <div class="page-position" v-if="currentLocation && currentLocation !== ''">
        <div class="page-position-name">当前收货地址：</div>
        <div class="page-pay-position">{{  currentLocation }}</div>
      </div>
      <div class="page-position" v-else>
        暂无收获地址，请在地址管理添加收货地址
      </div>
    <div>
    </div>
    <el-input
      type="textarea"
      :rows="5"
      placeholder="请输入内容"
      v-model="location"
    >
    </el-input>
    <div class="my-location">
       <el-button type="primary" @click="handleLocationCommit">提交</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../serviceAPIConfig";

export default {
  data() {
    return {
      location: "",
      userName: '',
      currentLocation: ''
    };
  },
  created(){
     if(localStorage.getItem('userInfo')) {
      this.userName = JSON.parse(localStorage.getItem('userInfo')).userName
    }
    axios
      .post(url.getOrderPaymentData, {
        userName: this.userName,
      })
      .then((res) => {
        if (res.data.code === 200) {
          this.currentLocation = res.data.location
        } else {
          this.$message({
            showClose: true,
            message: '获取地址失败',
            type: "error",
          });
        }
      })
      .catch((error) => {
        this.$message({
          showClose: true,
          message: "获取地址失败",
          type: "error",
        });
      });
  },
  methods:{
    handleLocationCommit() {
      if(this.location === ''){
        this.$message({
          showClose: true,
          message: "输入不能为空",
          type: "error",
        });
        return;
      }
      axios.post(url.userLocationData,{
        userName: this.userName,
        location: this.location
      }).then((res)=>{
        if(res.data.code === 200){
          this.$message({
          message: res.data.message,
          type: 'success'
        });
        } else {
          this.$message({
          message: res.data.message,
          type: 'error'
        });
        }
      }).catch((error) => {
        this.$message({
          message: '地址保存失败',
          type: 'error'
        });
      })
    }
  }
};
</script>

<style scoped>
.my-location{
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
}
.page-position-name {
  font-size: 18px;
  font-weight: 800;
}
.page-pay-position {
  font-size: 16px;
  color: #999;
}
.page-position {
  display: flex;
  padding: 10px 5px;
}
</style>