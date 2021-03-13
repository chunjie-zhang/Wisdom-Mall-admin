<template>
<!--pc端的主体部分右侧组件轮播图组件-->
  <div class="slide">
    <el-carousel height="240px">
      <el-carousel-item v-for="(item,index) in imgList" :key="index">
        <img :src="item.img" alt="" title="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
   data(){
       return{
           imgList:[{
               url:"#",
               img:"http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175142_6947.jpg",

           },
           {
               url:"#",
               img:"http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175040_1780.jpg",

           },
           {
               url:"#",
               img:"http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175111_9509.jpg",

           },
          ]
       }
   }
}
</script>

<style>

</style>