<template>
  <div>
    <div>
      <van-nav-bar title="会员中心" />
    </div>
    <div class="top">
      <img :src="toux" class="top-img" />
      <div class="myname">{{myname.userName}}</div>
    </div>
    <div class="login">
        <div v-if="display">
          <van-button type="warning" @click="onclickNewLogin()">重新登录</van-button>
        </div>
      <div v-else>
        <van-button type="warning" @click="onclickLogin()">我要登录</van-button>
      </div>
      <div>
        <van-button type="primary" @click="onclickRegister()">我要注册</van-button>
      </div>
    </div>
    <div>
      <van-cell-group>
        <van-cell title="会员卡" is-link />
        <van-cell title="地址管理" is-link />
        <van-cell title="我的订单" is-link />
        <van-cell title="会员权益" is-link />
        <van-cell title="联系我们" is-link />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
    export default {
        data(){
            return{
                myname:"",
                display:false,
                toux:require("@/assets/images/toux.jpeg"),
            }
        },
        created(){
           if(localStorage.userInfo){
               this.myname = JSON.parse(localStorage.userInfo);
               this.display=true;
           }
        },
        methods:{
           onclickRegister(){
               this.$router.push({name:"Register"});
           },
            onclickLogin(){
               this.$router.push({name:"Login"});
           },
           onclickNewLogin(){
               localStorage.removeItem("userInfo");
               this.$router.push({name:"Login"});
           }
        }
    }
</script>

<style scoped>
.top-img {
  width: 5rem;
  height: 5rem;
  border-radius: 50px;
}
.top {
  height: 5rem;
  text-align: center;
  padding: 0rem 0rem 2.4rem 0rem;
  background-color: #eea2ad;
}
.login {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 0.8rem;
}
.login div {
  flex: 1;
  text-align: center;
}
.myname{padding-bottom: 0.4rem;
    text-align: center;
    font-size: 1.4rem;
    color:white;
}
</style>