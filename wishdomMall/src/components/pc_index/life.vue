<template>
  <!--pc端的主体部分右侧组件-->
  <div class="m-life">
      <el-row>
          <ul class="nav">
              <li>
                  <router-link to="#" class="takeout">新鲜水果</router-link>
              </li>
              <li>
                  <router-link to="#" class="business">中外名酒</router-link>
              </li>
              <li>
                  <router-link to="#" class="partment">营养奶品</router-link>
              </li>
              <li>
                  <router-link to="#" class="business">个人护理</router-link>
              </li>
              <li>
                  <router-link to="#" class="takeout">食品饮料</router-link>
              </li>
          </ul>
      </el-row>
      <el-row>
          <el-col :span="14">
             <slider/>
          </el-col>
           <el-col :span="4">
              <div class="m-life-pic"></div>
          </el-col>
           <el-col :span="6">
              <div class="m-life-login">
                  <h4>
                     <img src="//s0.meituan.net/bs/fe-web-meituan/e350c4a/img/avatar.jpg" alt="头像">
                  </h4>
                  <p class="m-life-login-name">{{ username }}</p>
                  <p>
                      <router-link :to="{name:'register'}"><el-button round>注册</el-button></router-link>
                  </p>
                  <p>
                      <router-link :to="{name:'login'}"><el-button round>登录</el-button></router-link>
                  </p>
              </div>
          </el-col>
      </el-row>
      <el-row>
          <el-col :span="7">
              <div class="m-life-hotel"> </div>
          </el-col>
          <el-col :span="7">
              <div class="m-life-music"> </div>
          </el-col>
          <el-col :span="4">
              <div class="m-life-coop"> </div>
          </el-col>
          <el-col :span="6">
              <div class="m-life-downapp">
                <img src="//s1.meituan.net/bs/fe-web-meituan/60ac9a0/img/download-qr.png" alt="下载APP">
                <p>智慧商城APP手机版</p>
                <p class="last-p">
                    <span class="red">1元起包邮</span>
                    放心购物
                </p>
              </div>
          </el-col>
      </el-row>
  </div>
</template>

<script>
import slider from '@/components/pc_index/slider.vue'
export default {
  components:{
      slider,
  },
  data(){
      return {
          username: 'Hi! 您好'
      }
  },
  created(){
      if( localStorage.getItem('userInfo')){
          console.log(JSON.parse(localStorage.getItem('userInfo')));
          this.username = JSON.parse(localStorage.getItem('userInfo')).userName
      }
  }
}
</script>

<style lang="scss" scoped>
   @import"@/assets/css/index/life.scss";
</style>