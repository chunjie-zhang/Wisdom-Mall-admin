<!--pc端组件切换城市组件-->
<template>
  <div class="page-changeCity">
    <el-row>
        <!--省份选择组件-->
        <province/>
    </el-row>
    <el-row>
        <hot title="热门城市" :list ="hotList"/>
    </el-row>
    <el-row>
        <hot title="最近访问" :list ="rencentList"/>
    </el-row>
    <el-row>
        <category/>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/serviceAPIConfig.js";
import hot from '@/components/pc_changeCity/hot.vue';
import province from'@/components/pc_changeCity/province.vue';
import category from '@/components/pc_changeCity/category.vue';
export default {
  data(){
    return {
      hotList:["青岛", "淄博", "济南", "烟台", "枣庄"],
      rencentList:["青岛", "淄博", "济南", "烟台", "枣庄"],
    }
  },
  created(){
      axios({
        method:"get",
        url:url.pc_getChangeCity,
        params:{
          appkey:"_zcj9803_1558881875529"
        }
      }).then((res)=>{
          this.hotList = res.data.data.map(item=>item.name);
      });
       axios({
        method:"get",
        url:url.pc_search_city,
        params:{
          appkey:"_zcj9803_1558881875529"
        }
      }).then((res)=>{
          this.rencentList = res.data.data.map(item=>item.name);
      })
  },
  components:{
      province,
      hot,
      category,
  }
}
</script>

<style>

</style>