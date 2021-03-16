const Router = require('koa-router')
let router = new Router()

const mongoose = require('mongoose')
const fs = require('fs')

router.get('/insertAllGoodsInfo', async (ctx) => {
    fs.readFile('./newGoods.json', 'utf8', (err, data) => {
        data = JSON.parse(data)
        let saveCount = 0
        const Goods = mongoose.model('newGoods')
        data.map((value, index) => {
            console.log(value)
            let newGoods = new Goods(value)
            newGoods.save().then(() => {
                saveCount++
                console.log('成功' + saveCount)
            }).catch(error => {
                console.log(MediaStreamErrorEvent)
            })
        })
    })
    ctx.body = "开始导入数据"
})

router.get('/insertAllCategory', async (ctx) => {
    fs.readFile('./data_json/newGoods.json', 'utf8', (err, data) => {
        data = JSON.parse(data)
        let saveCount = 0
        const Goods = mongoose.model('newGoods')
        data.map((value, index) => {
            console.log(value)
            let newGoods = new Goods(value)
            newGoods.save().then(() => {
                saveCount++
                console.log('成功' + saveCount)
            }).catch(error => {
                console.log(error)
            })
        })

    })
    ctx.body = "开始导入数据....."
})

router.get('/insertAllCategorySub', async (ctx) => {
    fs.readFile('./data_json/category_sub.json', 'utf8', (err, data) => {
        data = JSON.parse(data)
        let saveCount = 0
        const CategorySub = mongoose.model('CategorySub')
        data.RECORDS.map((value, index) => {
            console.log(value)
            let newCategorySub = new CategorySub(value)
            newCategorySub.save().then(() => {
                saveCount++
                console.log('插入成功:' + saveCount)
            }).catch(error => {
                console.log('插入失败:' + error)
            })
        })

    })
    ctx.body = "开始导入数据....."
})

//**获取商品详情信息的接口
router.post('/getDetailGoodsInfo', async (ctx) => {
    try {
        let goodsId = ctx.request.body.goodsId
        const Goods = mongoose.model('newGoods')
        let result = await Goods.findOne({
            ID: goodsId
        }).exec()
        ctx.body = {
            code: 200,
            message: result
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: error
        }
    }
})

//**读取大类数据的接口 */

router.get('/getCategoryList', async (ctx) => {
    try {
        const Category = mongoose.model('Category')
        let result = await Category.find().exec()
        ctx.body = {
            code: 200,
            message: result
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: error
        }
    }

})

/**读取小类的数据 */

router.post('/getCategorySubList', async (ctx) => {
    try {
        let cateoryId = ctx.request.body.categoryId
        //let cateoryId=1
        const CategorySub = mongoose.model('CategorySub')
        let result = await CategorySub.find({
            MALL_CATEGORY_ID: cateoryId
        }).exec()
        ctx.body = {
            code: 200,
            message: result
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: error
        }
    }

})

/**根据类别获取商品列表 */

router.post('/getGoodsListByCategorySubID', async (ctx) => {
    try {
        let categorySubId = ctx.request.body.categorySubId //子类别ID
        let page = ctx.request.body.page //当前页数
        let num = 10 //每页显示数量
        let start = (page - 1) * num //开始位置

        const Goods = mongoose.model('newGoods')
        let data = await Goods.find({
            SUB_ID: categorySubId
        })
        let total = data.length
        let result = await Goods.find({
                SUB_ID: categorySubId
            })
            .skip(start).limit(num).exec()
        ctx.body = {
            code: 200,
            message: result,
            total
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: error
        }
    }
})

/**根据类别获取商品列表 --- 价格以低到高排序*/

router.post('/getGoodsListByPrice', async (ctx) => {
    try {
        let categorySubId = ctx.request.body.categorySubId //子类别ID
        let page = ctx.request.body.page //当前页数
        let sort = ctx.request.body.sort // 排序 1
        let num = 10 //每页显示数量
        let start = (page - 1) * num //开始位置

        const Goods = mongoose.model('newGoods')
        let data = await Goods.find({
            SUB_ID: categorySubId
        })
        let total = data.length

        let result = await Goods.find({
                SUB_ID: categorySubId
            })
            .skip(start).limit(num).sort([['PRESENT_PRICE', sort]]).exec()
        ctx.body = {
            code: 200,
            message: result,
            total
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: error
        }
    }

})


/**根据类别获取商品列表 --- 人气以低到高排序*/

router.post('/getGoodsListBySaleCount', async (ctx) => {
    try {
        let categorySubId = ctx.request.body.categorySubId //子类别ID
        let page = ctx.request.body.page //当前页数
        let sort = ctx.request.body.sort // 排序 1 
        let num = 10 //每页显示数量
        let start = (page - 1) * num //开始位置

        const Goods = mongoose.model('newGoods')
        let data = await Goods.find({
            SUB_ID: categorySubId
        })
        let total = data.length

        let result = await Goods.find({
                SUB_ID: categorySubId
            })
            .skip(start).limit(num).sort([['SALES_COUNT', sort]]).exec()
        ctx.body = {
            code: 200,
            message: result,
            total
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: error
        }
    }

})



/**
 * 保存商品评论信息
 */
router.post('/updateCommodityReview', async (ctx) => {
    try {
        let COMMENT = ctx.request.body.newCommentData
        let COMMENT_NUM = ctx.request.body.commentTotal
        let goodsId = ctx.request.body.goodsId
        console.log(COMMENT, COMMENT_NUM, goodsId, ctx.request.body)
        const Goods = mongoose.model('newGoods')
        await Goods.update({
            ID: goodsId
        }, {
            COMMENT,
            COMMENT_NUM
        })
        ctx.body = {
            code: 200,
            message: '评论保存成功'
        }

    } catch (err) {
        ctx.body = {
            code: 500,
            message: error
        }
    }
})


/**
 * 保存收藏
 */
router.post('/updateCollectData', async (ctx) => {
    try {
        let goodsId = ctx.request.body.goodsId
        console.log(goodsId)
        const Goods = mongoose.model('newGoods')
        await Goods.update({
            ID: goodsId
        }, {
            IS_RECOMMEND: 1
        })
        ctx.body = {
            code: 200,
            message: '保存收藏成功'
        }

    } catch (err) {
        ctx.body = {
            code: 500,
            message: error
        }
    }
})

/**
 * 取消收藏
 */
router.post('/cancelCollectData', async (ctx) => {
    try {
        let goodsId = ctx.request.body.goodsId
        console.log(goodsId)
        const Goods = mongoose.model('newGoods')
        await Goods.update({
            ID: goodsId
        }, {
            IS_RECOMMEND: 0
        })
        ctx.body = {
            code: 200,
            message: '取消收藏成功'
        }

    } catch (err) {
        ctx.body = {
            code: 500,
            message: error
        }
    }
})

/**
 * 查询收藏数据
 */

router.get('/goodsCollectData', async (ctx) => {
    try {
        let page = ctx.request.query.page //当前页数
        let num = 10 //每页显示数量
        let start = (page - 1) * num //开始位置
        const Goods = mongoose.model('newGoods')
        let data = await Goods.find({
            IS_RECOMMEND: 1
        })
        let collectNum = data.length
        let result = await Goods.find({
            IS_RECOMMEND: 1
        }).skip(start).limit(num).exec()
        ctx.body = {
            code: 200,
            message: result,
            collectNum
        }

    } catch (err) {
        ctx.body = {
            code: 500,
            message: error
        }
    }
})

module.exports = router