const mongoose = require('mongoose')
const Schema = mongoose.Schema

const goodsSchema = new Schema({
    ID: {
        unique: true,
        type: String
    },
    GOODS_SERIAL_NUMBER: String,
    SHOP_ID: String,
    SUB_ID: String,
    GOOD_TYPE: Number,
    STATE: Number,
    NAME: String,
    ORI_PRICE: Number,
    PRESENT_PRICE: Number,
    AMOUNT: Number,
    DETAIL: String,
    BRIEF: String,
    SALES_COUNT: {
        type: Number,
        default: 0
    },
    IMAGE1: String,
    IMAGE2: String,
    IMAGE3: String,
    IMAGE4: String,
    IMAGE5: String,
    ORIGIN_PLACE: String,
    GOOD_SCENT: String,
    CREATE_TIME: String,
    UPDATE_TIME: String,
    IS_RECOMMEND: Number,
    SCORE: {
        type: Number,
        default: 5.0
    },
    COMMENT_NUM: {
        type: Number,
        default: 0
    },
    COMMENT: {
        default: [],
        type: Array
    },
    PICTURE_COMPERSS_PATH: String
}, {
    collections: 'Goods' //不加这个mongoose会自动去掉大写字母，再加s，加上这个，写的是什么，就会显示什么表
})


mongoose.model('newGoods', goodsSchema)