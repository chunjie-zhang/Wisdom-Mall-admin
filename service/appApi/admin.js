const Router = require("koa-router");
let router = new Router();
const mongoose = require("mongoose");

// 管理员注册api
router.post("/register", async (ctx) => {
   const User = mongoose.model("admin");
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

// 管理员登录api
router.post('/login', async (ctx) => {
   let loginUser = ctx.request.body
   let userName = loginUser.userName
   let password = loginUser.password

   //引入User的model
   const User = mongoose.model('admin')

   await User.findOne({
      userName: userName
   }).exec().then(async (result) => {
      if (result) {
         let newUser = new User()
         await newUser.comparePassword(password, result.password)
            .then(async isMatch => {
              await User.updateOne({
                  userName
               },{
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

// 获取商品数量，用户量，销售额
router.get('/getHomeData', async (ctx) => {
   try {
      const User = mongoose.model("User");
      const Goods = mongoose.model("newGoods");
      let user = await User.find().exec()
      let goods = await Goods.find().exec()
      let totalMoney = 0
      user.map((item) => {
         totalMoney += item.totalPayMoney
      })
      let userNum = user.length
      let goodsNum = goods.length
      ctx.body = {
         code: 200,
         message: {
            userNum,
            goodsNum,
            totalMoney
         },
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: error,
      }
   }
})

// 获取热门商品
router.get('/getHotData', async (ctx) => {
   try {
      const Goods = mongoose.model("newGoods");
      let page = 1 //当前页数
      let sort = -1 // 排序 1
      let num = 10 //每页显示数量
      let start = (page - 1) * num //开始位置
      let goods = await Goods.find()
         .skip(start).limit(num).sort([
            ['SALES_COUNT', sort]
         ]).exec()

      ctx.body = {
         code: 200,
         message: goods
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: error,
      }
   }
})

// 获取商品及数量
router.post('/getGoodsData', async (ctx) => {
   try {
      let page = ctx.request.body.page //当前页数
      let num = 10 //每页显示数量
      let start = (page - 1) * num //开始位置
      const Goods = mongoose.model("newGoods");
      let mygoods = await Goods.find().exec()
      let goods = await Goods.find().skip(start).limit(num).exec()
      let goodsNum = mygoods.length
      ctx.body = {
         code: 200,
         message: {
            goods,
            goodsNum,
         },
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: error,
      }
   }
})

// 添加商品数据
router.post('/addGoodsData', async (ctx) => {
   let form = ctx.request.body.form //当前页数
   const Goods = mongoose.model("newGoods");
   let newGoods = new Goods(form);
  let result =  Goods.findOne({
      ID: ctx.request.body.form.ID
   })
   if(result){
      ctx.body = {
         code: 201,
         message: "商品ID重复",
      }
   } else {
      await newGoods.save().then(() => {
         ctx.body = {
            code: 200,
            message: "商品添加成功",
         }
      }).catch(error => {
         ctx.body = {
            code: 500,
            message: "商品添加失败"
         }
      })
   }
})

// 编辑商品数据
router.post('/editorGoodsData', async (ctx) => {
   try {
      let ID = ctx.request.body.form.ID
      let NAME = ctx.request.body.form.NAME
      let IMAGE1 = ctx.request.body.form.IMAGE1
      let ORI_PRICE = ctx.request.body.form.ORI_PRICE
      let IPRESENT_PRICE = ctx.request.body.form.PRESENT_PRICE
      let AMOUNT = ctx.request.body.form.AMOUNT
      const Goods = mongoose.model("newGoods");
      await Goods.updateOne({
         ID
      },{
         NAME,
         IMAGE1,
         ORI_PRICE,
         IPRESENT_PRICE,
         AMOUNT
      })
      ctx.body = {
         code: 200,
         message: '商品编辑成功'
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: "商品编辑失败"
      }
   }
})

// 删除商品数据
router.post('/deleteGoodsData', async (ctx) => {
   try {
      let ID = ctx.request.body.ID
      const Goods = mongoose.model('newGoods')
       await Goods.deleteOne({
          ID
         })
         ctx.body = {
            code: 200,
            message: '商品删除成功'
         }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '商品删除失败'
      }
   }
})

// 获取所有用户
router.post('/getUserData', async (ctx) => {
   try {
      let page = ctx.request.body.page //当前页数
      let num = 10 //每页显示数量
      let start = (page - 1) * num //开始位置
      
      const User = mongoose.model('User')
      let myUser = await User.find().exec()
      let user = await User.find().skip(start).limit(num).exec()
      let userNum = myUser.length
      ctx.body = {
         code: 200,
         message: {
            userNum,
            user
         }
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '查询用户失败'
      }
   }
})

//搜索用户
router.post('/getSearchUser', async (ctx) => {
   try {
      let userName =  ctx.request.body.userName
      let page = ctx.request.body.page //当前页数
      let num = 10 //每页显示数量
      let start = (page - 1) * num //开始位置
      const reg = new RegExp(userName)

      const User = mongoose.model('User')
      let myUser = await User.find({
         userName: reg
      })

      let user = await User.find({
         userName: reg
      }).skip(start).limit(num).exec()

      let userNum = myUser.length
      ctx.body = {
         code: 200,
         message: {
            userNum,
            user
         }
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '查询用户失败'
      }
   }
})

// 添加用户api
router.post("/addUser", async (ctx) => {
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

// 编辑用户api
router.post("/editorUser", async (ctx) => {
   try{
      let location = ctx.request.body.location
      let userName = ctx.request.body.userName

      const User = mongoose.model("User");
      await User.updateOne({
         userName
      }, {
         location,
      })

      ctx.body = {
         code: 200,
         message: "编辑用户成功",
      }
   } catch( error) {
      ctx.body = {
         code: 500,
         message: '编辑用户失败',
      }
   }
})

// 删除用户api
router.post("/deleteUser", async (ctx) => {
   try{
      let userName = ctx.request.body.userName

      const User = mongoose.model("User");
      await User.deleteOne({
         userName
      })

      ctx.body = {
         code: 200,
         message: "删除用户成功",
      }
   } catch( error) {
      ctx.body = {
         code: 500,
         message: '删除用户失败',
      }
   }
})

// 获取所有管理员用户
router.post('/getAdminUserData', async (ctx) => {
   try {
      let page = ctx.request.body.page //当前页数
      let num = 10 //每页显示数量
      let start = (page - 1) * num //开始位置
      
      const User = mongoose.model('admin')
      let myUser = await User.find().exec()
      let adminUser = await User.find().skip(start).limit(num).exec()
      let adminUserNum = myUser.length
      ctx.body = {
         code: 200,
         message: {
            adminUserNum,
            adminUser
         }
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '查询管理员用户失败'
      }
   }
})

//搜索管理员用户
router.post('/getSearchAdminUser', async (ctx) => {
   try {
      let userName =  ctx.request.body.userName
      let page = ctx.request.body.page //当前页数
      let num = 10 //每页显示数量
      let start = (page - 1) * num //开始位置
      const reg = new RegExp(userName)

      const User = mongoose.model('admin')
      let myUser = await User.find({
         userName: reg
      })

      let user = await User.find({
         userName: reg
      }).skip(start).limit(num).exec()

      let userNum = myUser.length
      ctx.body = {
         code: 200,
         message: {
            userNum,
            user
         }
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '查询用户失败'
      }
   }
})

// 添加用户api
router.post("/addAdminUser", async (ctx) => {
   const User = mongoose.model("admin");
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


// 删除管理员用户api
router.post("/deleteAdminUser", async (ctx) => {
   try{
      let userName = ctx.request.body.userName

      const User = mongoose.model("User");
      await User.deleteOne({
         userName
      })

      ctx.body = {
         code: 200,
         message: "删除用户成功",
      }
   } catch( error) {
      ctx.body = {
         code: 500,
         message: '删除用户失败',
      }
   }
})

//

router.post('/getAdminRecommendData', async (ctx) => {
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
      const Goods = mongoose.model('CategorySub')
      let CategorySub = await Goods.find({
         ID: {
            $in: recommentID,
         },
      })
      ctx.body = {
         code: 200,
         message: {
            CategorySub,
            price:{
               gt,
               lt
            } 
         }
      }
   } catch (error) {
      ctx.body = {
         code: 500,
         message: '推荐数据获取失败'
      }
   }
})
module.exports = router