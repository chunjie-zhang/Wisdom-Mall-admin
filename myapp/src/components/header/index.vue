 <!-- pc端的头部组件-->
<template>
  <div class="m-header">
      <el-row>
         <!-- pc端的头部导航组件-->
          <top-bar/>
      </el-row>
      <el-row>
         <!-- pc端的头部搜索组件-->
          <search-bar/>
      </el-row>
  </div>
</template>

<script>
import topBar from './top1Bar.vue';
import searchBar from "./searchBar.vue";
export default {
  components:{topBar,searchBar}
}
</script>

<style lang="scss"> @import "@/assets/css/public/header/index.scss";</style>