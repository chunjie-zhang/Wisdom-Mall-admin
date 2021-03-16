<!--省份选择组件-->
<template>
  <div>
    <span class="name">按省份选择:</span>
    <my-select
      :list="provinceList"
      title="省份"
      :value="province"
      :showWrapperActive="provinceActive"
      @change_active="changeProvinceActive"
      @change="changeprovince"
      className="province"
    />
    <my-select
      :list="cityList"
      title="城市"
      :value="city"
      :showWrapperActive="cityActive"
      @change_active="changeCityActive"
      @change="changeCity"
      :disabled ="cityDisabled"
      className="city"
    />
    <span>直接搜索:</span>
    <el-select
      v-model="searchWord"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option
        v-for="(item,index) in searchList"
        :key="index"
        :label="item"
        :value="item"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/serviceAPIConfig.js";
import mySelect from "@/components/pc_changeCity/select.vue";
export default {
  data() {
    return {
      cityDisabled:true,
      provinceList: [
        "山东",
        "甘肃",
        "江苏",
        "北京",
        "云南",
        "海南",
        "浙江",
        "上海",
      ],
      cityList: ["青岛", "淄博", "济南", "烟台", "枣庄"],
      province: "省份",
      city: "城市",
      cityActive: false, //省份下拉列表的出现
      provinceActive: false, //城市下拉列表的出现
      searchList:["青岛", "淄博", "济南", "烟台", "枣庄"],//搜索框数据
      searchWord:"",//关键字搜索
      loading:false,//搜索加载
    };
  },
  created(){
       axios({
        method:"get",
        url:url.pc_province,
        params:{
          appkey:"_zcj9803_1558881875529"
        }
      }).then((res)=>{
          this.provinceList = res.data.data.map((item)=>{
            item.name = item.provinceName; 
             return item;
             });
      });
  },
  methods: {
    //控制省份和城市下拉列表的出现
    changeProvinceActive(flag) {
      this.provinceActive = flag;
      if (flag) {
        this.cityActive = false;
      }
    },
    changeCityActive(flag) {
      this.cityActive = flag;
      if (flag) {
        this.provinceActive = false;
      }
    },
    changeprovince(item){
        this.province = item.name;
         this.cityDisabled = false;
         this.cityList = item.cityInfoList;
    },
    changeCity(item){
        this.city = item.name;
        this.$store.dispatch("setPosition", this.province+this.city)
        this.$router.push({name:'pc_index'});
    },
    remoteMethod(val){
      //请求后端接口，val为我们输入的值 
    }
  },
  components: {
    mySelect,
  },
};
</script>

<style lang="scss">
@import "@/assets/css/changecity/iselect.scss";
</style>