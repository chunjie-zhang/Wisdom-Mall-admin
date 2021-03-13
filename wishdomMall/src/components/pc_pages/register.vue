<template>
  <div class="page-register">
    <div class="header">
      <header>
        <a href="/" class="my-register">
          <img src="../../assets/images/logo.png" class="my-register" alt="">
        </a>
        <div class="login">
          <span>已有智慧商城账号</span>
          <router-link :to="{name: 'login'}">登录</router-link>
        </div>
      </header>
    </div>
    <div class="content">
      <el-form
        :model="registerForm"
        status-icon
        :rules="rules"
        ref="registerForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input type="text" v-model="registerForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerForm.password" autocomplete="off" @input="input"></el-input>
          <div class="pw-strength">
            <div :class="['bar', strengthClass]"></div>
            <div class="letter">
              <span>弱</span>
              <span>中</span>
              <span>强</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" v-model="registerForm.rePassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="openLoading" @click="submitForm('registerForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <footer></footer>
  </div>
</template>
<script>
import axios from "axios";
import url from "../../serviceAPIConfig";
export default {
  data() {
    var validateUser = (rule, value, callback) => {
        console.log(value)
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (value.length < 4 || value.length > 16) {
        callback(new Error("用户名必须为4-16位的字母数字下划线组成"));
      }else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.rePassword !== '') {
            this.$refs.registerForm.validateField('rePassword');
        }
          callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        userName: "",
        password: "",
        rePassword: ""
      },
      strengthClass: "",
      rules: {
        userName: [{ validator: validateUser, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        rePassword: [{ validator: validatePass2, trigger: "blur" }]
      },
      openLoading: false
    };
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.registerForm.userName,this.registerForm.password)
            this.openLoading = true
             axios({
               url:url.registerUser,
               method:"post",
               data:{
                  userName:this.registerForm.userName,
                  password:this.registerForm.password,

               }
           }).then((res)=>{
                console.log(res);
                if(res.data.code==200){
                    this.openLoading = false;
                    localStorage.removeItem("userInfo");
                    this.$router.push({name: 'login'});
                }else{
                    console.log(res.data.message);
                    this.openLoading = false;
                    alert("注册失败");
                }
           }).catch((error)=>{
               console.log(error);
               this.openLoading = false;
                alert("注册失败");
           })
          } else {
            alert('验证失败，请确认是否填写正确！！');
            return false;
          }
        });
    },
    input() {
        var regStr = /(\w)+/g;
        var regNum = /(\d)+/g;
        var reg = /_/g;
        var strongth = this.registerForm.password.match(reg) &&  this.registerForm.password.match(regStr) && this.registerForm.password.match(regNum);
        if (this.registerForm.password.length > 20 || (this.registerForm.password.length > 6 && strongth)) {
            this.strengthClass = 'strong';
        }else if (this.registerForm.password.length < 6) {
            this.strengthClass = 'week';
        } else if (!this.registerForm.password) {
            this.strengthClass = '';
        } else{
            this.strengthClass = 'normal';
        }

    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/register/index.scss";
.my-register{
  display: inline-block;
        width: 60px;
        height: 60px;  
}
</style>