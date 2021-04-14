<template>
  <!--pc端的主体部分右侧组件轮播图组件-->
  <div class="slide">
    <el-carousel height="240px">
      <el-carousel-item v-for="(item, index) in imgList" :key="index">
        <img
          class="carousel-img"
          :src="item.img"
          alt="轮播图图片"
          @click="jumpToDetail(item.goodsId)"
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgList: [
        {
          url: "#",
          img:
            "http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175142_6947.jpg",
          goodsId: "ad176e397858448a854dc50371334faf",
        },
        {
          url: "#",
          img:
            "http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175040_1780.jpg",
          goodsId: "b1195296679f482aa7d54d95ac2b4a94",
        },
        {
          url: "#",
          img:
            "http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175111_9509.jpg",
          goodsId: "da34d6f381464a219b37a9ac0ad579e8",
        },
      ],
    };
  },
  methods: {
    // 跳转详情页
    jumpToDetail(id) {
      this.$router.push({ path: "/detail", query: { goodsId: id } });
    },
  },
};
</script>

<style scoped>
.carousel-img{
  cursor: pointer;
}
</style>