 <!-- pc端的头部搜索组件-->
<template>
  <div class="search-panel">
      <el-row class="m-header-searchbar">
        <el-col :span="3" class="left">
          <a href="/index"><img src="@/assets/images/title.jpg" alt="智慧商城" title="智慧商城"/></a>
        </el-col>
        <el-col :span="15" class="center">
           <div class="wrapper">
             <el-input v-model="searchword" placeholder="请输入内容" @focus="focus" @blur="blur"></el-input>
             <el-button type="primary" icon="el-icon-search">搜索</el-button>
             <dl class="hotPlace" v-if="isHotPlace">
               <dt>热门搜索</dt>
               <dd v-for="(item,index) in hotPlaceList" :key="index">
                 <router-link :to="{name:'goods',params:{name:item}}">{{item}}</router-link>
               </dd>
             </dl>
             <dl class="searchList" v-if="isSearchList">
               <dd v-for="(item,index) in searchList" :key="index">
                  <router-link :to="{name:'goods',params:{name:item}}">{{item}}</router-link>
               </dd>
             </dl>
           </div>
           <p class="suggest">
              <router-link v-for="(item,index) in suggestList" :key="index" :to="{name:'goods',params:{name:item}}">{{item}}</router-link>
           </p>
        </el-col>
      </el-row>
    </div>
</template>

<script>
export default {
  data(){
    return {
      searchword:"",//输入的value值
      isfocus:false,//是否是聚焦
      hotPlaceList:["新鲜水果","中外名酒","营养奶品","个人护理","食品饮料"],//热卖搜索数据
      searchList:["火锅","火锅自助餐","火锅 重庆"],//搜索列表数据
      suggestList:["新鲜水果","中外名酒","营养奶品","个人护理","食品饮料"],//建议列表数据
    }
  },
  computed:{
    //是聚焦且没有value值则isHotPlace为true,显示热门搜索
     isHotPlace:function(){
       return this.isfocus && !this.searchword;
     },
     // //是聚焦且有value值则isSearchList为true，显示serach列表
     isSearchList:function(){
         return this.isfocus && this.searchword;
     }
  },
  created(){
    
  },
  methods:{
     focus(){
       this.isfocus = true;
     },
     blur(){
       /**
        * 如果不加定时器我们点击搜索列表会先执行blur事件,从而搜索列表会消失
        */
       setTimeout(()=>{
        this.isfocus = false; 
       },200)
     }

  }
}
</script>

<style lang="scss">
  @import "@/assets/css/public/header/search.scss";
</style>