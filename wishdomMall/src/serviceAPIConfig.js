//项目请求路径的配置
const BASEURL = "http://localhost:8080";
const LOCALURL = "http://localhost:3000/"
const pc_changeCity_url = 'http://open.duyiedu.com'
const URL ={
    updateGoodsComment: LOCALURL+'goods/updateCommodityReview', // 添加商品评论
    updateCollectData: LOCALURL+ 'goods/updateCollectData', // 商品收藏
    cancelCollectData: LOCALURL+ 'goods/cancelCollectData', // 取消收藏
    goodsCollectData: LOCALURL+ 'goods/goodsCollectData', // 收藏数据
    getGoodsListByPrice: LOCALURL+ 'goods/getGoodsListByPrice', //详情页价格排序
    getGoodsListBySaleCount: LOCALURL+ 'goods/getGoodsListBySaleCount', // 详情页人气排序


    insertShoppingCartData: LOCALURL+'user/insertShoppingCartData', //添加购物车数据
    getShoppingCartData: LOCALURL+'user/getShoppingCartData', // 得到购物车数据
    removeShoppingCartData: LOCALURL+'user/removeShoppingCartData', // 删除购物车数据
    removeAllShoppingData: LOCALURL+'user/removeAllShoppingData', // 删除所有购物车数据
    shoppingCartPayment: LOCALURL+'user/shoppingCartPayment', // 支付接口
    waitOrderPaymentData: LOCALURL+ 'user/waitOrderPaymentData', // 保存待支付订单接口
    getOrderPaymentData:  LOCALURL+ 'user/getOrderPaymentData', // 获取待支付订单
    cancelPaymentOrder: LOCALURL+ 'user/cancelPaymentOrder', // 取消待支付订单



    //移动端api接口
    getShopingMallInfo : BASEURL+'/api/data',    //商城首页所有信息
    registerUser : LOCALURL+'user/register',  //用户注册接口
    login : LOCALURL+'user/login',  //用户登录接口
    getDetailGoodsInfo : LOCALURL+'goods/getDetailGoodsInfo',  //获取商品详情
    getCateGoryList : LOCALURL+'goods/getCateGoryList',  //得到大类信息
    getCateGorySubList : LOCALURL+'goods/getCategorySubList',  //得到小类信息
    getGoodsListByCategorySubID:LOCALURL+'goods/getGoodsListByCategorySubID',   //得到小类商品信息

    //pc端api接口
    pc_getChangeCity:pc_changeCity_url+"/api/meituan/city/hot.json",//获取热门城市
    pc_search_city:pc_changeCity_url+"/api/meituan/city/recents.json",//最近搜索城市
    pc_province:pc_changeCity_url+"/api/meituan/city/province.json",// 获取省份列表
    pc_current_position : pc_changeCity_url+'/api/meituan/city/getPosition.json',//获取当前位置信息
    pc_city_list:pc_changeCity_url+"/api/meituan/city/cityList.json",//获取城市列表接口
}

module.exports = URL