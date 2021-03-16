const Router = require("koa-router");
let router = new Router();
const mongoose = require("mongoose");


router.get("/", async (ctx) => {
   ctx.body = "用户首页";
})

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
            .then(isMatch => {
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
            message: '购物车数量达到极限'
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

router.post('/shoppingCartPayment', async (ctx)=>{
   try {
     let shoppingCartData = ctx.request.body.shoppingCartData
     let userName = ctx.request.body.userName
     let total = ctx.request.body.total

   let User = mongoose.model('User')
   let Goods = mongoose.model('newGoods')

   shoppingCartData.map(async (item)=>{
      await Goods.update({ID : item.ID},{
         SALES_COUNT: item.SALES_COUNT,
      })
   })

   await User.update({userName},{
      waitPaymentOrder: [],
      $inc: { totalPayMoney: total }
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
      let waitOrderData = ctx.request.body.shoppingCartData
      let userName = ctx.request.body.userName

      const User = mongoose.model('User')

      await User.update({
         userName
      }, {
         waitPaymentOrder: waitOrderData,
         shoppingCart: []
      })
      ctx.body = {
         code: 200,
         message: '订单保存成功'
      }
   } catch (error) {
      ctx.body = {
         code: 200,
         message: '订单保存失败'
      }
   }
})

/**
 * 获取等待订单数据
 */

router.post('/getOrderPaymentData',async (ctx)=>{
   try {
      let userName = ctx.request.body.userName

      const User = mongoose.model('User')
      let result = await User.findOne({ userName })
      ctx.body = {
         code: 200,
         message: result.waitPaymentOrder
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

router.post('/cancelPaymentOrder',async (ctx)=>{
   try {
      let userName = ctx.request.body.userName

      const User = mongoose.model('User')
      await User.update({userName},{
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
module.exports = router