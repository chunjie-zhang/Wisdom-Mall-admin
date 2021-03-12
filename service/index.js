const Koa = require('koa')
const app = new Koa()
const mongoose = require('mongoose')
const {connect , initSchemas} = require('./database/init.js')
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");//解决跨域
const Router = require("koa-router");
let user = require("./appApi/user");
let goods = require("./appApi/goods");

app.use(bodyParser());
app.use(cors());

//装载所以user子路由
let router = new Router();
router.use("/user",user.routes())
router.use("/goods",goods.routes());

//加载路由中间件
app.use(router.routes());
app.use(router.allowedMethods());


//立即执行函数
(async () =>{
    await connect();
    initSchemas();
})()


app.use(async(ctx)=>{
    ctx.body = '<h1>没有匹配的api</h1>'
})

app.listen(3000,()=>{
    console.log('[Server] starting at port 3000')
})