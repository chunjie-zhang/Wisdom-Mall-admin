const mongoose = require('mongoose')    //引入Mongoose
const Schema = mongoose.Schema          //声明Schema
let ObjectId = Schema.Types.ObjectId    //声明Object类型

const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

//创建我们的用户Schema
const userSchema = new Schema({
    UserId:ObjectId,
    userName:{
        unique: true, // 唯一
        type: String, 
        trim: true, // 去除空格
        required: true // 必填
    },
    password:{
        type: String,
        trim: true,
        required: true
    },
    love:{
        type: Array,
        default: []
    },
    shoppingCart:{
        type: Array,
        default: []
    },
    waitPaymentOrder:{
        type: Array,
        default: []
    },
    totalPayMoney: {
        type: Number,
        default: 0
    },
    createAt:{
        type: Date,
        default: Date.now()},
    lastLoginAt:{
        type: Date,
        default: Date.now()}

})
//用bcrypt进行加盐加密处理
  userSchema.pre("save",function(next){
      bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
          if(err) return next(err);
          bcrypt.hash(this.password,salt,(err,hash)=>{
              if(err)return next(err);
              this.password = hash;
              next();
          });
      })
  })
   
//userSchema的实例方法要new才能使用_password是数据库的密码，password是前端写的密码
userSchema.methods={
    comparePassword:(_password,password)=>{
        return new Promise((resolve,reject)=>{
            //bcrypt提供的比对方法，有一个回调函数返回比对信息
            bcrypt.compare(_password,password,(err,isMatch)=>{
                 if(!err) {
                    resolve(isMatch);
                    }
                    else{
                        reject(err);
                    }
            })
        })
    }
}  
//发布模型
mongoose.model('User',userSchema)