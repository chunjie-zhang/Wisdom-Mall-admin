<!--pc端的默认页面 -->
<template>
  <div class="layout-default">
    <el-container>
      <el-header height="">
        <!-- pc端的头部组件-->
        <my-header/>
      </el-header>
       <!-- pc端的主体组件-->
      <el-main>
        <router-view/>
      </el-main>
       <!-- pc端的底部组件-->
      <el-footer height="">
        <my-footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import myFooter from "@/components/footer/index.vue";
import myHeader from "@/components/header/index.vue";
export default {
    components:{
        myHeader,
        myFooter,
    }
};
</script>

<style lang="scss">
  
 @import "@/assets/css/public/layout.scss";

</style>