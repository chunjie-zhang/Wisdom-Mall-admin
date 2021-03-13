<!-- pc端的主体部分组件-->
<template>
  <div class="page-index">
    <el-row>
      <!-- pc端的主体部分左侧组件-->
      <el-col :span="5">
        <my-menu />
      </el-col>
      <!-- pc端的主体部分右侧组件-->
      <el-col :span="19">
        <my-life />
      </el-col>
    </el-row>
    <el-row>
      <!-- pc端的主体部分下面内容区组件-->
      <el-col :span="24">
        <!--用props向container组件中传入数据-->
        <Container :nav="iStyle" />
      </el-col>
      <el-col :span="24">
        <Container :nav="recomment" />
      </el-col>
      <el-col :span="24">
        <Container />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import myMenu from "@/components/pc_index/menu.vue";
import myLife from "@/components/pc_index/life.vue";
import Container from "@/components/pc_index/container.vue";
export default {
  data() {
    return {
      iStyle: {
        class:"istyle",
        title: "有格调",
        list: [
          {
            text: "全部",
            tab: "all",
          },
          {
            text: "约会聚餐",
            tab: "food",
          },
          {
            text: "丽人SPA",
            tab: "spa",
          },
          {
            text: "电影演出",
            tab: "movie",
          },
          {
            text: "品质出游",
            tab: "travel",
          },
        ],
      },
      recomment: {
        class:"youhui",
        title: "很优惠",
        list: [
          {
            text: "全部",
            tab: "all",
          },
          {
            text: "美食",
            tab: "food",
          },
          {
            text: "悠闲",
            tab: "xiuxian",
          },
          ]
      }
    };
  },
  components: {
    myMenu,
    myLife,
    Container,
  },
};
</script>

<style lang="scss">
@import "@/assets/css/index/index.scss";
</style>