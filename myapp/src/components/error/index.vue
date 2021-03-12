<template>
  <div class="my-error">
      <div>
          <img src="../../assets/images/noData.png" alt="没有数据">
      </div>
      <div class="error-font">
          抱歉，没有更多数据了...
      </div>
  </div>
</template>

<script>
export default {
  name: 'error'
}
</script>

<style scoped>
.my-error{
    margin-top: 20px;
    text-align: center;
}
.error-font{
    font-size: 18px;
    color: #999;
}
</style>