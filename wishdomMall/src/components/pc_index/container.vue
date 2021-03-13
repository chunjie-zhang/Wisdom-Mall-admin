 <!-- pc端的主体部分下面内容区组件-->
<template>
  <div class="m-istyle">
    <dl @mouseover="over" :class="nav.class">
      <dt>{{nav.title}}</dt>
      <dd v-for="(item,index) in nav.list" :key="index" :class="{active:kind==item.tab}" :data-type="item.tab">{{item.text}}</dd>
    </dl>
    <ul class="ibody">
      <li v-for="(item,index) in list" :key="index+'1'">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img
            :src="item.image"
            class="image"
          />
          <div class="cbody">
            <div class="title" :title="item.title">
              {{item.title}}
            </div>
            <div class="sub-title" :title="item.sub_title">
              {{item.sub_title}}
            </div>
            <div class="price-info" v-if="item.rentNum&&item.price_info.current_price">
                <span class="current-price-wrapper">
                    <span class="price-symbol numfont">￥</span>
                    <span class="current-price numfont">{{item.price_info.current_price}}</span>
                </span>
                <span class="old-price">门市价￥{{item.price_info.old_price}}</span>
                <span class="sold bottom-right-info"></span>
            </div>
            <div class="price-info" v-else-if="!item.rentNum&&item.price_info.current_price">
                <span class="current-price-wrapper">
                    <span class="price-symbol numfont">￥</span>
                    <span class="current-price numfont">抢光了</span>
                </span>
            </div>
             <div class="price-info" v-else>
                <span class="current-price-wrapper">
                    <span class="price-symbol numfont">￥</span>
                    <span class="current-price numfont">{{item.price_info.avg_price}} </span>
                   <span class="units">/{{item.price_info.units}}均</span>
                </span>
            </div> 
          </div>
        </el-card>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    props:["nav"],
    data(){
        return {
            kind:"all",//决定了我们是指在那个标题上的三角
            list:[{
                image:"https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
                title:"COSTA COFFEE(新国道店)",
                sub_title:" 巧克力酥卷小美式，建议单人使用",
                price_info:{
                    current_price:18,
                    old_price:36,
                    avg_price:null,
                    units:null
                },
                rentNum:0,
                address:"崇文门",
            },
            {
                image:"https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
                title:"COSTA COFFEE(新国道店)",
                sub_title:" 巧克力酥卷小美式，建议单人使用",
                price_info:{
                    current_price:null,
                    old_price:null,
                    avg_price:18,
                    units:"人"
                },
                 rentNum:10,
                address:"崇文门",
            },
            {
                image:"https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
                title:"COSTA COFFEE(新国道店)",
                sub_title:" 巧克力酥卷小美式，建议单人使用",
                price_info:{
                    current_price:18,
                    old_price:36
                },
                rentNum:10,
                address:"崇文门",
            },
            {
                image:"//p1.meituan.net/apiback/103e9de8195e544b84941c9d1036c18383388.jpg@267w_150h_1e_1c",
                title:"COSTA COFFEE(新国道店)",
                sub_title:" 巧克力酥卷小美式，建议单人使用",
                price_info:{
                    current_price:18,
                    old_price:36
                },
                rentNum:10,
                address:"崇文门",
            },
            {
                image:"//p1.meituan.net/apiback/103e9de8195e544b84941c9d1036c18383388.jpg@267w_150h_1e_1c",
                title:"COSTA COFFEE(新国道店)",
                sub_title:" 巧克力酥卷小美式，建议单人使用",
                price_info:{
                    current_price:18,
                    old_price:36
                },
                rentNum:10,
                address:"崇文门",
            },
            {
                image:"//p1.meituan.net/apiback/103e9de8195e544b84941c9d1036c18383388.jpg@267w_150h_1e_1c",
                title:"COSTA COFFEE(新国道店)",
                sub_title:" 巧克力酥卷小美式，建议单人使用",
                price_info:{
                    current_price:18,
                    old_price:36
                },
                rentNum:11,
                address:"崇文门",
            },]//主体部分数据
        }
    },
    methods:{
        over(e){
             let dom = e.target;
             let tagName = dom.tagName.toLowerCase();
             if(tagName!="dd"){
                 return;
             }
             this.kind = dom.getAttribute("data-type");
             //动态获取数据ajax请求
        }
    }
    
};
</script>

<style lang="scss">
@import "@/assets/css/index/artistic.scss";
</style>