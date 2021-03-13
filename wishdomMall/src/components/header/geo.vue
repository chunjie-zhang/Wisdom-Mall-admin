 <!-- pc端的头部导航组件的左半部分-->
<template>
  <div class="m-geo">
    <div class="position">
      <i class="el-icon-location" />
      {{ $store.state.position.name }}
      <router-link class="changeCity" :to="{ name: 'changeCity' }">
        切换城市
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/serviceAPIConfig.js";
export default {
  data() {
    return {
      nearCity: [],
    };
  },
  watch: {
    "$store.state.position": function () {
      this.nearCity = this.$store.state.position.nearCity;
    },
  },
};
</script>

<style scoped>
.my-user-btn{
    margin-left: 20px;
}
.my-user-name{
    font-size: 16px;
    color: #409EFF;
    margin-left: 70px;
    cursor: pointer;
}
</style>