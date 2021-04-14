<template>
  <div>
    <!--search bar-->
    <div class="search-bar">
      <van-row>
        <van-col span="3">
          <img class="location-icon" :src="locationIcon" alt="定位" />
        </van-col>
        <van-col span="16">
          <input type="search" placeholder="快点搜索你心爱的商品吧" class="search-input" @click="jumpToSearch"/>
        </van-col>
      </van-row>
    </div>
    <!-- swiper area-->
    <div class="swiper-area">
      <van-swipe :autoplay="2000">
        <van-swipe-item v-for="(banner,index) in bannerPicArray" :key="index">
           <!--v-lazy是按需加载,懒加载vant提供的-->
          <img class="swiper-img" v-lazy="banner.image" alt="轮播图" width="100%" @click="handleBannerJump(banner.goodsId)"/>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- type bar-->
    <div class="type-bar">
      <div v-for="(cate,index) in category" :key="index" >
          <img v-lazy = "cate.image" width="100%">
          <span>{{ cate.mallCategoryName}}</span>
      </div>
    </div>
    <!--adbnner area-->
    <div>
       <img v-lazy="adBanner" alt="advance" width="100%">
    </div>
    <!--Recommend goods area-->
    <div class="recommend-area">
        <div class="recommend-title">
          商品推荐
        </div>
        <div class="recommeng-body">
            <swiper :options ="swiperOption">
              <swiper-slide v-for="(item,index) in recommendGoods" :key="index">
                 <div class="recommend-item" @click="handleBannerJump(item.goodsId)">
                   <img :src="item.image" alt="" width="80%">
                   <div>{{item.goodsName}}</div>
                   <div class="recommend-money">￥{{item.price | moneyFilter}}(￥{{item.mallPrice | moneyFilter}})</div>
                 </div>
              </swiper-slide>
            </swiper>
        </div>
    </div>
    <!--Recommend goods floor area-->
    <!-- <div v-for="(value,key,index) in floorName" :key="index">
      <floor-component :floorData="key" :floorTitle="value"></floor-component>
      <div>{{key}}+{{value}}</div>
    </div> -->
    <floor-component :floorData="floor1" :floorTitle="floorName.floor1"></floor-component>
    <floor-component :floorData="floor2" :floorTitle="floorName.floor2"></floor-component>
    <floor-component :floorData="floor3" :floorTitle="floorName.floor3"></floor-component>
    <!--Hot Area-->
    <div class="hot-area">
         <div class="hot-title">热卖商品</div>
         <div class="hot-goods">
              <van-list>
                <!--gutter 为间距20-->
                <van-row gutter="20">
                    <van-col span="12" v-for="(item,index) in hotGoods" :key="index">
                        <goods-info :goodsId ="item.goodsId" :goodsImage ="item.image" :goodsName ="item.name" :name ="item.goodsName" :goodsPrice ="item.price"></goods-info>
                    </van-col>
                </van-row>
              </van-list>
         </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import {toMoney} from "@/filter/moneyFilter.js"
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import floorComponent from "../component/floorComponent"
import goodsInfo from "../component/goodsinfoComponent"
import url from "@/serviceAPIConfig.js"
export default {
  data() {
    return {
      swiperOption:{
          slidesPerView:3
      },
      msg: "shoppingMall",
      locationIcon: require("../../assets/images/定位.png"), //在打包时图片路径不会出错
      bannerPicArray: [],
      category:[],
      adBanner:"",
      recommendGoods:[],
      floor1:[],
      floor2:[],
      floor3:[],
      floorName:{},
      hotGoods:[],//热卖商品

    };
  },
  filters:{
    moneyFilter(money){
      return toMoney(money);
    }
  },
  components:{Swiper, SwiperSlide,floorComponent,goodsInfo},
  mounted(){
    axios({
      url: url.getShopingMallInfo,
      method:"get",
    }).then((res)=>{
        if(res.data.code === 200){
          console.log(res.data.data);
             this.category = res.data.message[0].category
             this.adBanner = res.data.message[0].advertesPicture.PICTURE_ADDRESS;
             this.bannerPicArray = res.data.message[0].slides;
             this.recommendGoods = res.data.message[0].recommend;
             this.floor1 = res.data.message[0].floor1;
             this.floor2 = res.data.message[0].floor2;
             this.floor3 = res.data.message[0].floor3;
             this.floorName = res.data.message[0].floorName;
             this.hotGoods = res.data.message[0].hotGoods;
        }
    }).catch(err=>{
      Toast.error("获取数据失败");
    })
  },
  methods:{
    handleBannerJump(goodsId){
      this.$router.push({ name: "Goods", query : { goodsId: goodsId }})
    },
    jumpToSearch() {
      this.$router.push({ name: "search"})
    }
  }
};
</script>

<style scoped>
.search-bar {
  height: 2.2rem;
  background-color: #008c8c;
  line-height: 2.2rem;
  overflow: hidden;
}
.location-icon {
  margin-left: 0.8rem;
  margin-top: 0.5rem;
  width: 1.3rem;
  height: 1.3rem;
}
.search-input {
  width: 125%;
  height: 1.3rem;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  background-color: #fff;
  color: #000;
  outline: none;
  border: none;
  border-radius: 3px;
}
.search-input::placeholder{
   color:#e5017d
}
.search-input:focus{
   color:#e5017d
}
.search-button {
  padding-top: 0.2rem;
  margin-left: 0.6rem;
  color: #e5017d;
  font-size: 0.8rem;
  line-height: 0.8rem;
  width:3rem;
  height: 1.4rem;
}
.swiper-area{
  clear: both;
  max-height: 12rem;
  overflow: hidden;
}
.swiper-img{
  height:9rem;
}
.type-bar{
  background-color:#fff;
  margin:0 0.3rem 0.3rem 0.3rem;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  display:flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.type-bar div{
  padding:0.3rem;
  font-size: 0.8rem;
  text-align:center;
}
.type-bar div img{
  width:3rem;
}
.recommend-area{
  background-color: #fff;
  margin-top: .3rem;
}
.recommend-title{
    border-bottom:1px solid #eee;
    font-size:1rem;
    padding:.2rem;
    color:#e5017d;
}
.recommend-body{
  border-bottom:1px solid #eee;
}
.recommend-item{
  width:99%;
  border-right:1px solid #eee;
  font-size: 0.66rem;
  text-align:center;
}
.recommend-money{
  color:red;
}
.hot-area{
   margin-top:0.2rem;
   background-color: #fff;
}
.hot-title{
    border-bottom:1px solid #eee;
    font-size:1rem;
    height: 1.8rem;
    line-height: 1.8rem;
    padding:.2rem;
    color:#e5017d;
    text-align: center;
}
.hot-goods{
  height:100rem;
  overflow: auto;
  padding-bottom: 70px;
}
</style>