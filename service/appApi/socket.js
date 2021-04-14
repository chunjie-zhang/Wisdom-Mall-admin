const Router = require("koa-router");
let router = new Router();
const mongoose = require("mongoose");

// 获取所有词条
router.post('/getScoketData', async (ctx) => {
    try {
        let page = ctx.request.body.page //当前页数
        let num = 10 //每页显示数量
        let start = (page - 1) * num //开始位置

        const User = mongoose.model('Socket')
        let myUser = await User.find().exec()
        let socket = await User.find().skip(start).limit(num).exec()
        let socketNum = myUser.length
        ctx.body = {
            code: 200,
            message: {
                socketNum,
                socket
            }
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: '查询管理员用户失败'
        }
    }
})

//搜索词条
router.post('/getSearchSocketUser', async (ctx) => {
    try {
        let userName = ctx.request.body.keyword
        let page = ctx.request.body.page //当前页数
        let num = 10 //每页显示数量
        let start = (page - 1) * num //开始位置
        const reg = new RegExp(userName)

        const Socket = mongoose.model('Socket')
        let myUser = await Socket.find({
            keyword: reg
        })

        let socket = await Socket.find({
            keyword: reg
        }).skip(start).limit(num).exec()

        let socketNum = myUser.length
    
        ctx.body = {
            code: 200,
            message: {
                socketNum,
                socket
            }
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: '查询用户失败'
        }
    }
})

// 添加词条
router.post("/addSocketData", async (ctx) => {

    const Socket = mongoose.model("Socket");

    let newUser = new Socket(ctx.request.body);

    await newUser.save().then(() => {
        ctx.body = {
            code: 200,
            message: "添加成功",
        }
    }).catch(error => {
        ctx.body = {
            code: 500,
            message: error,
        }
    })
})

// 编辑商品数据
router.post('/editorSocketData', async (ctx) => {
    try {
        let repaly = ctx.request.body.repaly
        let keyword = ctx.request.body.keyword

        const Socket = mongoose.model("Socket");
        await Socket.updateOne({
            keyword
        }, {
            repaly,
            lastLoginAt: Date.now()
        })
        ctx.body = {
            code: 200,
            message: '词条编辑成功',
            lastLoginAt: Date.now()
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: "词条编辑失败"
        }
    }
})


// 删除词条
router.post("/deleteSocketData", async (ctx) => {
    try {
        let keyword = ctx.request.body.keyword

        const Socket = mongoose.model("Socket");
        await Socket.deleteOne({
            keyword
        })

        ctx.body = {
            code: 200,
            message: "删除用户成功",
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: '删除用户失败',
        }
    }
})

// 获取聊天数据
router.post('/getScokeReturntData', async (ctx) => {
    try {
        let userName = ctx.request.body.keyword

        const Socket = mongoose.model('Socket')

        let result = await Socket.findOne({
            keyword: userName
        })

        ctx.body = {
            code: 200,
            message: result
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: '请求失败'
        }
    }
})
module.exports = router