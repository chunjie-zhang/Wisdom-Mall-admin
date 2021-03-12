<template>
  <div class="category">
      <dl class="m-categroy">
          <dt>按拼音首字母选择:</dt>
          <dd v-for="(item,index) in list" :key="index">
            <a :href="'#city-'+item">{{item}}</a>
          </dd>
      </dl>
      <dl class="m-categroy-section" v-for="(item,index) in cityGroup" :key="index" :id="'city-'+index">
        <dt>{{index}}</dt>
        <dd>
          <span v-for="(city) in item" :key="city.id" @click="changeCity(city)">{{city.name}}</span>
        </dd>
      </dl>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/serviceAPIConfig.js";
export default {
   data(){
     return {
       list:"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
       cityList:[],
       cityGroup:{},
     }
   },
   created(){
      // var data = [{id: 60, name: "青岛", pinyin: "qingdao", acronym: "qd", rank: "B", firstChar: "Q"},
      //            {id: 1, name: "北京", pinyin: "beijin", acronym: "bj", rank: "S", firstChar: "B"}];
      axios({
        method:"get",
        url:url.pc_city_list,
        params:{
          appkey:"_zcj9803_1558881875529"
        }
      }).then((res)=>{
           var obj = {};
            res.data.data.forEach((item,index)=>{
             if(!obj[item.firstChar.toUpperCase()]){
                obj[item.firstChar.toUpperCase()]=[];
             }
             obj[item.firstChar.toUpperCase()].push(item);
         })
         this.cityGroup = obj;
      });
   },
   methods:{
     changeCity(city){
        this.$store.dispatch("setPosition",city);
        this.$router.push({name:'pc_index'});
     }
   }
}
</script>

<style lang="scss">
 @import "@/assets/css/changecity/categroy.scss";
</style>