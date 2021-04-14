 <!-- pc端的头部导航组件的右半部分-->
<template>
    <div class="m-nav">
    <ul class="nav">
      <li class="list">
         <router-link to="/">我的智慧商城</router-link>
         <dl>
             <dd>
               <router-link :to='{name: "shoppingCart"}'>我的购物车</router-link> 
             </dd>
             <dd>
                 <router-link :to='{name: "pc_orderDetail"}'>我的订单</router-link>
             </dd>
             <dd>
                 <router-link :to='{name: "pc_collect"}'>我的收藏</router-link>
             </dd>
             <dd>
                 <router-link :to='{name: "pc_location"}'>收货地址</router-link>
             </dd>
         </dl>
      </li>
      <li>
         <router-link to="/">手机APP</router-link>
      </li>
      <li class="list bd">
         <router-link to="/">商家中心</router-link>
         <dl>
             <dd>
               <router-link to="/">登录商家中心</router-link> 
             </dd>
             <dd>
                 <router-link to="/">我想合作</router-link>
             </dd>
             <dd>
                 <router-link to="/">手机免费开店</router-link>
             </dd>
         </dl>
      </li>
      <li class="list site">
         <router-link to="/">网站导航</router-link>
         <div class="subContainer">
             <dl class="hotel">
             <dt>新鲜水果</dt>
             <dd>
               <router-link to="/">热带水果</router-link> 
             </dd>
             <dd>
                 <router-link to="/">时令水果</router-link>
             </dd>
             <dd>
                 <router-link to="/">苹果/梨</router-link>
             </dd>
             <dd>
               <router-link to="/">热带水果</router-link> 
             </dd>
             <dd>
                 <router-link to="/">时令水果</router-link>
             </dd>
             <dd>
                 <router-link to="/">苹果/梨</router-link>
             </dd>
              <dd>
                 <router-link to="/">柑橘</router-link>
             </dd>
         </dl>
          <dl class="food">
             <dt>中外名酒</dt>
             <dd>
               <router-link to="/">白酒</router-link> 
             </dd>
             <dd>
                 <router-link to="/">洋酒</router-link>
             </dd>
             <dd>
                 <router-link to="/">海外</router-link>
             </dd>
             <dd>
               <router-link to="/">葡萄酒</router-link> 
             </dd>
             <dd>
                 <router-link to="/">啤酒</router-link>
             </dd>
         </dl>
         <dl class="food">
             <dt>食品饮料</dt>
             <dd>
               <router-link to="/">乳制</router-link> 
             </dd>
             <dd>
                 <router-link to="/">咖啡</router-link>
             </dd>
             <dd>
                 <router-link to="/">功能饮料</router-link>
             </dd>
             <dd>
               <router-link to="/">饼干</router-link> 
             </dd>
             <dd>
                 <router-link to="/">冲调饮料</router-link>
             </dd>
                <dd>
                 <router-link to="/">进口饮料</router-link>
             </dd>
                <dd>
                 <router-link to="/">坚果</router-link>
             </dd>
                <dd>
                 <router-link to="/">糖果</router-link>
             </dd>
         </dl>
         <dl class="food">
             <dt>营养奶品</dt>
             <dd>
               <router-link to="/">奶油</router-link> 
             </dd>
             <dd>
                 <router-link to="/">鲜奶</router-link>
             </dd>
                <dd>
                 <router-link to="/">酸奶</router-link>
             </dd>
                <dd>
                 <router-link to="/">乳酸菌</router-link>
             </dd>
         </dl>
         <dl class="food">
             <dt>个人护理</dt>
             <dd>
                 <router-link to="/">进口护理</router-link>
             </dd>
                <dd>
                 <router-link to="/">口腔护理</router-link>
             </dd>
                <dd>
                 <router-link to="/"></router-link>
             </dd>
         </dl>
         </div>
      </li>
    </ul>
   </div>
</template>

<script>
export default {

}
</script>

<style>

</style>