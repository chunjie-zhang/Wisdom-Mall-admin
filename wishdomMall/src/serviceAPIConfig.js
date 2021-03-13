//项目请求路径的配置
const BASEURL = "http://localhost:8080";
const LOCALURL = "http://localhost:3000/"
const pc_changeCity_url = 'http://open.duyiedu.com'
const URL ={
    updateGoodsComment: LOCALURL+'goods/updateCommodityReview',

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