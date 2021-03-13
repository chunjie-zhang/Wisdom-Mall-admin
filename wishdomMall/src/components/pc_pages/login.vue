<template>
  <div class="page-login">
    <div class="login-header">
      <a class="logo" href="http://www.meituan.com"></a>
    </div>
    <div class="login-panel">
      <div class="banner">
        <img
          src="//s0.meituan.net/bs/file/?f=fe-sso-fs:build/page/static/banner/www.jpg"
          width="480"
          height="370"
          alt="美团网"
        />
      </div>
      <div class="form">
        <h4 v-if="error" class="tips">{{ error }}</h4>
        <p>
          <span> 账号登陆 </span>
        </p>
        <el-input
          :class="{ error: error && !userName }"
          v-model="userName"
          placeholder="手机号/用户名/邮箱"
          prefix-icon="profile"
        ></el-input>
        <el-input
          :class="{ error: error && !password }"
          v-model="password"
          type="password"
          placeholder="密码"
          prefix-icon="password"
        ></el-input>
        <div class="foot">
          <a href="#">忘记密码?</a>
        </div>
        <el-button type="primary" :loading="openLoading" class="btn-login" @click="submit"
          >登录</el-button
        >
        <p class="reg">
          <span>还没有账号？</span>
          <router-link :to="{ name: 'register' }">免费注册</router-link>
        </p>
        <div class="oauth-wrapper">
          <h3 class="title-wrapper">
            <span class="title">用合作网站账号登录</span>
          </h3>
          <div class="oauth cf">
            <a
              class="oauth__link oauth__link--qq"
              href="/account/connect/tencent"
              data-mtevent='{"la":"oauth/qq"}'
              target="_blank"
            ></a>
            <a
              class="oauth__link oauth__link--weibo"
              href="/account/connect/sina"
              data-mtevent='{"la":"oauth/sina"}'
              target="_blank"
            ></a>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <ul>
        <li><a href="#">关于智慧商城</a></li>
        <li><a href="#">加入我们</a></li>
        <li><a href="#">商家入驻</a></li>
        <li><a href="#">帮助中心</a></li>
        <li><a href="#">智慧商城手机版</a></li>
      </ul>
      <p>
        Copyright © 2020-2021 天津理工大学中环信息学院 17060054 张春节 All
        rights reserved.
      </p>
    </footer>
  </div>
</template>
<script>
import axios from "axios";
import url from "../../serviceAPIConfig";
export default {
  data() {
    return {
      userName: "",
      password: "",
      error: "",
      openLoading: false
    };
  },
  methods: {
    submit() {
      if (!this.userName) {
        this.error = "请输入账号";
        return false;
      }
      if (!this.password) {
        this.error = "请输入密码";
        return false;
      }
      this.openLoading = true
      axios.post(url.login, {
        userName: this.userName,
        password: this.password,
      }).then((res)=>{
          this.openLoading = false
          if(res.data.code === 200) {
              let user = {userName: this.userName}
              localStorage.setItem('userInfo',JSON.stringify(user));
              this.$router.push('/');
          } else {
              alert('登录失败')
          }
      }).catch((err)=>{
          this.openLoading = false
          console.log('登录失败')
      });
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/css/login/index.scss";
</style>
