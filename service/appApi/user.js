const Router = require("koa-router");
let router = new Router();
const mongoose = require("mongoose");


// 用户注册api
router.post("/register", async (ctx) => {
   const User = mongoose.model("User");
   let newUser = new User(ctx.request.body);
   await newUser.save().then(() => {
      ctx.body = {
         code: 200,
         message: "注册成功",
      }
   }).catch(error => {
      ctx.body = {
         code: 500,
         message: error,
      }
   })
})

// 用户登录api
router.post('/login', async (ctx) => {
   let loginUser = ctx.request.body
   let userName = loginUser.userName
   let password = loginUser.password

   //引入User的model
   const User = mongoose.model('User')

   await User.findOne({
      userName: userName
   }).exec().then(async (result) => {
      if (result) {
         let newUser = new User()
         await newUser.comparePassword(password, result.password)
            .then(async isMatch => {
               await User.updateOne({
                  userName
               }, {
                  lastLoginAt: Date.now()
               })
               ctx.body = {
                  code: 200,
                  message: isMatch
               }
            })
            .catch(error => {
               ctx.body = {
                  code: 500,
                  message: error
               }
            })
      } else {
         ctx.body = {
            code: 500,
            message: '用户名不存在'
         }
      }
   }).catch(error => {
      ctx.body = {
         code: 500,
         message: error
      }
   })

})

/**
 * 购物车数据存储
 */
router.post('/insertShoppingCartData', async (ctx) => {
   try {
      let goodsId = ctx.request.body.goodsId
      let userName = ctx.request.body.userName
      const User = mongoose.model('User')
      let userInfo = await User.find({
         userName
      })
      let myShoppingCart = userInfo[0].shoppingCart
      let shoppingCartNum = myShoppingCart.length
      if (shoppingCartNum >= 50) {
         ctx.body = {
            code: 201,
            message: '购物车商品数量最多50个'
         }
      } else if (myShoppingCart.includes(goodsId)) {
         ctx.body = {
            code: 202,
            message: '请勿添加重复的商品'
         }
      } else {
         myShoppingCart.unshift(goodsId)
         await User.updateOne({
            userName
         }, {
            shoppingCart: myShoppingCart
         })
         ctx.body = {
            code: 200,
            message: '加入购物车成功'
         }
      }

   } catch (err) {
      ctx.body = {
         code: 500,
         message: '加入购物车失败'
      }
   }
})

/**
 * 得到购物车数据
 */
router.post('/getShoppingCartData', async (ctx) => {
   try {
      let userName = ctx.request.body.userName
      const User = mongoose.model('User')
      let userInfo = await User.find({
         userName
      })
      let myShoppingCart = userInfo[0].shoppingCart
      const Goods = mongoose.model('newGoods')
      let result = await Goods.find({
         ID: {
            $in: myShoppingCart
         }
      })
      ctx.body = {
         code: 200,
         message: result
      }
   } catch (err) {
      ctx.body = {
         code: 500,
         message: '查询购物车数据失败'
      }
   }
})

/**
 * 删除购物车数据
 */
router.post('/removeShoppingCartData', async (ctx) => {
   try {
      let goodsIdData = ctx.request.body.goodsIdData
      let userName = ctx.request.body.userName

      const User = mongoose.model('User')
      let userInfo = await User.find({
         userName
      })
      let shoppingCartData = userInfo[0].shoppingCart

      let resultArr = shoppingCartData.filter((item, index) => {
         return goodsIdData.indexOf(item) === -1
      })
      await User.update({
         userName
      }, {
         shoppingCart: resultArr
      })
      ctx.body = {
         code: 200,
         message: '删除购物车数据成功'
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '删除购物车数据失败'
      }
   }
})

/**
 * 全部删除购物车数据
 */

router.post('/removeAllShoppingData', async (ctx) => {
   try {
      let userName = ctx.request.body.userName

      let User = mongoose.model('User')
      await User.update({
         userName
      }, {
         shoppingCart: []
      })
      ctx.body = {
         code: 200,
         message: '全部删除成功'
      }

   } catch (error) {
      ctx.body = {
         code: 500,
         message: '全部删除失败'
      }
   }
})

/**
 * 支付成功，保存商品数据，用户totalPayMoney 更新
 */

router.post('/shoppingCartPayment', async (ctx) => {
   try {
      let shoppingCartData = ctx.request.body.shoppingCartData
      let userName = ctx.request.body.userName
      let total = ctx.request.body.total

      let User = mongoose.model('User')
      let Goods = mongoose.model('newGoods')

      shoppingCartData.map(async (item) => {
         await Goods.update({
            ID: item.ID
         }, {
            $inc: {
               SALES_COUNT: item.SALES_COUNT
            }
         })
      })

      await User.update({
         userName
      }, {
         waitPaymentOrder: [],
         $inc: {
            totalPayMoney: total
         }
      })

      ctx.body = {
         code: 200,
         message: '支付成功'
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '支付失败'
      }
   }
})

/***
 * 保存等待支付订单数据,清空购物车数据,
 */
router.post('/waitOrderPaymentData', async (ctx) => {
   try {
      let waitOrder = ctx.request.body.shoppingCartData
      let userName = ctx.request.body.userName
      let doPay = ctx.request.body.doPay

      const User = mongoose.model('User')

      let data = await User.find({
         userName
      })
      let payData = data[0].waitPaymentOrder
      let waitOrderData = payData.concat(waitOrder)

      if (doPay) {
         await User.updateOne({
            userName
         }, {
            waitPaymentOrder: waitOrderData,
         })
      } else {
         await User.updateOne({
            userName
         }, {
            waitPaymentOrder: waitOrderData,
            shoppingCart: []
         })
      }
      ctx.body = {
         code: 200,
         message: '订单保存成功'
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '订单保存失败'
      }
   }
})

/**
 * 获取等待订单数据
 */

router.post('/getOrderPaymentData', async (ctx) => {
   try {
      let userName = ctx.request.body.userName

      const User = mongoose.model('User')
      let result = await User.findOne({
         userName
      })
      ctx.body = {
         code: 200,
         message: result.waitPaymentOrder,
         location: result.location
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '获取订单数据失败'
      }
   }
})

/**
 * 取消待支付订单
 */

router.post('/cancelPaymentOrder', async (ctx) => {
   try {
      let userName = ctx.request.body.userName

      const User = mongoose.model('User')
      await User.update({
         userName
      }, {
         waitPaymentOrder: []
      })
      ctx.body = {
         code: 200,
         message: '取消订单成功'
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '取消订单失败'
      }
   }
})

/**
 * 保存用户地址
 */
router.post('/userLocationData', async (ctx) => {
   try {
      let location = ctx.request.body.location
      let userName = ctx.request.body.userName

      const User = mongoose.model('User')
      await User.update({
         userName
      }, {
         location
      })

      ctx.body = {
         code: 200,
         message: '保存地址成功'
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '保存地址失败'
      }
   }
})

// 给用户贴标签

router.post('/updateUserLoveDate', async (ctx) => {
   try {
      let SUB_ID = ctx.request.body.SUB_ID
      let Level = ctx.request.body.Level
      let userName = ctx.request.body.userName
      let myresult = []
      const User = mongoose.model('User')

      let result = await User.findOne({
         userName
      })
      let len = result.love.SUB_ID.length

      if (len > 50) {
         if (Array.isArray(SUB_ID)) {
            result.love.SUB_ID.splice(0, SUB_ID.length)
            myresult = result.love.SUB_ID.concat(SUB_ID)
            console.log(myresult, levelResult)
         } else {
            result.love.SUB_ID.splice(0, 1)
            myresult = result.love.SUB_ID.push(SUB_ID)
            console.log(myresult, levelResult)
         }
      } else {
         if (Array.isArray(SUB_ID)) {
            myresult = result.love.SUB_ID.concat(SUB_ID)
         } else {
            myresult = result.love.SUB_ID.push(SUB_ID)
         }
      }

      let levenLen = result.love.Level.length
      let levelResult = []
      if (levenLen > 30) {
         if (Array.isArray(Level)) {
            result.love.Level.splice(0, Level.length)
            levelResult = result.love.Level.concat(Level)
         } else {
            result.love.Level.splice(0, 1)
            levelResult = result.love.Level.push(Level)
         }
      } else {
         if (Array.isArray(Level)) {
            levelResult = result.love.Level.concat(Level)
         } else {
            levelResult = result.love.Level.push(Level)
         }
      }
      await User.updateOne({
         userName
      }, {
         love: {
            SUB_ID: myresult,
            Level: levelResult
         }
      })

      ctx.body = {
         code: 200,
         message: '保存标签成功'
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '保存标签失败'
      }
   }
})

// 获取智能推荐数据
/* 单位：元
 * Level: 1: 0-50
 *        2: 50-150
 *        3: 150-300
 *        4: 300-500
 *        5: >500
 * total: 1: 0-100
 *        2: 100-300
 *        3: 300-500
 *        4: 500-1000
 *        5: >1000
 */
router.post('/getUserRecommendData', async (ctx) => {
   try {
      let userName = ctx.request.body.userName

      const User = mongoose.model('User')
      let result = await User.findOne({
         userName
      })
      let SUB_ID = result.love.SUB_ID
      let Level = result.love.Level
      let SUB_ID_obj = {}
      let Level_obj = {}


      for (let i = 0; i < SUB_ID.length; i++) {
         if (SUB_ID_obj[SUB_ID[i]]) {
            SUB_ID_obj[SUB_ID[i]] += 1
         } else {
            SUB_ID_obj[SUB_ID[i]] = 1
         }
      }
      for (let j = 0; j < Level.length; j++) {
         if (Level_obj[Level[j]]) {
            Level_obj[Level[j]] += 1
         } else {
            Level_obj[Level[j]] = 1
         }
      }
      let SUB_ID_arr = []
      for (let item in SUB_ID_obj) {
         SUB_ID_arr.push({
            SUB_ID: item,
            times: SUB_ID_obj[item]
         })
      }
      SUB_ID_arr.sort(function (a, b) {
         return b.times - a.times
      })
      let Level_arr = []
      for (let item in Level_obj) {
         Level_arr.push({
            Level: item,
            times: Level_obj[item]
         })
      }
      Level_arr.sort(function (a, b) {
         return b.times - a.times
      })

      let SUB_ID_result = SUB_ID_arr.slice(0, 5)
      let Level_arr_result = Level_arr.slice(0, 1)
      let recommentID = []
      SUB_ID_result.map((item) => {
         recommentID.push(item.SUB_ID)
      })
      let gt = 0
      let lt = 0
      //       Level: 1: 0-50
      //              2: 50-150
      //              3: 150-300
      //              4: 300-500
      //              5: >500
      switch (Number(Level_arr_result[0]['Level'])) {
         case 1:
            gt = 0
            lt = 50
            break;
         case 2:
            gt = 50
            lt = 150
            break;
         case 3:
            gt = 150
            lt = 300
            break;
         case 4:
            gt = 300
            lt = 500
            break;
         case 5:
            gt = 500
            lt = 10000
            break
      }
      const Goods = mongoose.model('newGoods')
      let recommentData = await Goods.find({
         SUB_ID: {
            $in: recommentID,
         },
         PRESENT_PRICE:{
            $gt: gt,
            $lt: lt
         }
      }).limit(16).exec()
      ctx.body = {
         code: 200,
         message: recommentData
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '推荐数据获取失败'
      }
   }
})

module.exports = router