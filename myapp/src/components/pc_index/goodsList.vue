<!--pc端商品详情页-->
<template>
     <div class="page-product">
         <el-row>
             <el-col :span="19">
                 <el-row> 
                     <list/>
                 </el-row>
             </el-col>
             <el-col :span="5">
                 <recommend/>
             </el-col>
         </el-row>
     </div>
</template>

<script>
import recommend from "../../components/pc_products/recommend";
import list from "@/components/pc_products/list.vue";
export default {
 components:{
     list,
     recommend
 }
}
</script>

<style lang="scss">
@import "@/assets/css/products/index.scss";
</style>