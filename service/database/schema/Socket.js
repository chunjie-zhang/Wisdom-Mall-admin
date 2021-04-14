const mongoose = require('mongoose')    //引入Mongoose
const Schema = mongoose.Schema          //声明Schema
let ObjectId = Schema.Types.ObjectId    //声明Object类型

//创建我们的词条Schema
const socketSchema = new Schema({
    socketId:ObjectId,
    keyword:{
        type: String, 
        trim: true, // 去除空格
        required: true, // 必填
        default: ''
    },
    repaly:{
        type: String, 
        trim: true, // 去除空格
        required: true, // 必填
        default: ''
    },
    createAt:{
        type: Date,
        default: Date.now()},
    lastLoginAt:{
        type: Date,
        default: Date.now()}

})

//发布模型
mongoose.model('Socket', socketSchema)