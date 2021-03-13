<template>
   <!-- pc端的主体部分左侧组件-->
   <div class="m-menu">
     <dl class="nav" @mouseleave="menuLeave">
         <dt>全部分类 </dt>
         <dd v-for="(item,index) in menuList" :key="index" @mouseenter="menuEnter(item)">
            <i :class="item.icon"></i>
             {{item.title}}
             <span class="arrow"></span>
         </dd>
     </dl>
     <div v-if="curDetail" class="detail" @mouseenter="detailEnter" @mouseleave="detailLeave">

         <!--template不能加key,所以我们只能在子元素身上加-->
       <template v-for="(item,index) in curDetail.children">
           <h4 :key="index">{{item.title}}</h4>
           <span v-for="(v,i) in item.children" :key="v+'_'+i" @click="jumpToSearch(v)">{{ v.MALL_SUB_NAME }}</span>
       </template>
     </div>
   </div>
</template>

<script>
import axios from "axios"
import url from "../../serviceAPIConfig"
export default {
 data(){
     return {
         curDetail:null,//控制左侧二级导航的展示和数据
         menuList:[],//左侧标题导航数据
     }
 },
 created(){
   let menuList = [];
   axios.get(url.getCateGoryList).then((res)=>{
       console.log(res.data.message)
       res.data.message.map(item=>{
           console.log(item.MALL_CATEGORY_NAME)
           axios.post(url.getCateGorySubList, {
               categoryId: item.ID
            }).then(data => {
                console.log(data)
               menuList.push(
                   {
                       title: item.MALL_CATEGORY_NAME,
                       icon: "food",
                       children: [
                           {
                               title: item.MALL_CATEGORY_NAME,
                               children: data.data.message

                           }
                       ]
                   }
                )
            })
       })
   },(err)=>{
       console.log(err)
   })
   this.menuList = menuList
 },
 methods:{
     //curDetail数据的改变
     menuEnter(item) {
        this.curDetail = item;
     },
     menuLeave(){
         /**
          * 如果不加定时器当我们离开一级标题时，会触发menuLeave事件，
          * 二级页面会立即消失，如果加一个定时器，延迟消失再加一个二级标题
          * 的mouseEnter事件让定时器消失，则我们离开一级标题，进入二级标题
          * 页面会显示。
          */
        this.timer = setTimeout(()=>{
            this.curDetail = null;
        },200)
     },
     detailEnter () {
       clearTimeout(this.timer);
     },
     detailLeave () {
       this.curDetail = null;
     },
     jumpToSearch (item) {
         console.log(item)
         this.$router.push({path:`/s/${item.MALL_SUB_NAME}`, query:{ categorySubId: item.ID }})
     } 
 }
}
</script>

<style>

</style>