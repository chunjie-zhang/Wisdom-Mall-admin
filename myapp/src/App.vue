<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
    };
  },
  mounted(){
  if(this.isMobile()) {
    this.$router.replace('/mobile').catch(err=>err);
  }else{
    this.$router.replace('/').catch(err=>err);
  }
},
methods: {
  // 添加判断方法
  isMobile() {
    let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    return flag;
   }
 }
}
</script>

<style>
  
</style>
