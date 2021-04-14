const mongoose = require('mongoose')
const Schema = mongoose.Schema

const floorSchema = new Schema({
    ID: {
        unique: true,
        type: String
    },
    advertesPicture: {
        type: Object
    },
    floor3: {
        type: Array,
        default: []
    },
    floor2: {
        type: Array,
        default: []
    },
    floor1: {
        type: Array,
        default: []
    },
    floorName: {
        type: Object
    },
    category: {
        type: Array,
        default: []
    },
    slides: {
        type: Array,
        default: []
    },
    hotGoods:{
        type: Array,
        default: []
    },
    recommend: {
        type: Array,
        default: []
    },
})

mongoose.model('floor', floorSchema)