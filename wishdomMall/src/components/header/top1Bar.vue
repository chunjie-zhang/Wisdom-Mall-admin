 <!-- pc端的头部导航组件-->
<template>
  <div class="m-header-topbar m-header">
    <el-col :span="10">
      <geo />
    </el-col>
    <el-col :span="10">
      <my-nav />
    </el-col>
    <el-col :span="4">
      <div class="m-user">
        <div v-if="isShow">
          <router-link class="login" :to="{ name: 'login' }">
            立即登录
          </router-link>
          <router-link class="register" :to="{ name: 'register' }">
            注册
          </router-link>
        </div>
        <div v-else class="my-user-div">
          <span>
            <el-avatar size="medium" :src="circleUrl"></el-avatar>
          </span>
          <span class="my-user-name"> {{ userName }}</span>
          <span class="my-user-btn">
            <el-button type="primary" size="mini" @click="handleQuit"
              >退出</el-button
            >
          </span>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
import geo from "./geo.vue";
import myNav from "./nav.vue";
export default {
  components: {
    geo,
    myNav,
  },
  data(){
    return {
      isShow: true,
      userName: '',
      circleUrl:"//s0.meituan.net/bs/fe-web-meituan/e350c4a/img/avatar.jpg"
    }
  },
  created(){
    if (localStorage.getItem("userInfo")) {
        this.isShow = false;
        this.userName = JSON.parse(localStorage.getItem('userInfo')).userName
    }
  },
  methods:{
    handleQuit(){
          localStorage.removeItem('userInfo')
          this.isShow = true
          this.$router.go(0);
      }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public/header/topbar.scss";
.my-user-btn {
  margin-left: 20px;
}
.my-user-name {
  font-size: 16px;
  color: #999;
  margin-left: 20px;
  cursor: pointer;
}
.my-user-div{
  display: flex;
  margin-left: 40px;
}
.login{
  margin-left: 40px;
}
.register{
  margin-left: 10px;
}
</style>