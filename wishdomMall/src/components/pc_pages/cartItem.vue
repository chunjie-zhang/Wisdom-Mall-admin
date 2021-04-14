<!--pc端详情页-左侧商品介绍组件-商品介绍-->
<template>
  <dl class="s-item">
    <dt class="my-item-image">
      <img
        :src="meta.IMAGE1"
        :alt="meta.NAME"
        :title="meta.NAME"
        :onerror="errorImg"
        @click="jumpToDetail(meta.ID)"
      />
    </dt>
    <dd class="my-item-dd">
      <div @click="jumpToDetail(meta.ID)" class="my-item-name">
        {{ meta.NAME }}
      </div>
      <p>
        <span>
          原价￥
          <del>{{ meta.ORI_PRICE | moneyFormat }}</del>
        </span>
        <span class="s-item-price"> 现价￥
          <span class="s-item-myprice">{{ meta.PRESENT_PRICE | moneyFormat }}</span>
          </span>
      </p>
    </dd>
    <dd>
        <div>
            <el-input-number size="mini" v-model="meta.SALES_COUNT" :min ='1'></el-input-number>
        </div>
        <div class="my-cartItem-num">
            {{'x' + meta.SALES_COUNT}}
        </div>
        <div class="my-cartItem-style">
          <div class="my-cartItem-totalPrice">
          总价：{{ totalPrice | moneyFormat }}
        </div>
        <div class="my-cartItem-discount">
          优惠: {{ discount | moneyFormat }}
        </div>
        <div class="my-cartItem-discountPrice">
          折扣价：{{ discountPrice | moneyFormat }}
        </div>
        </div>
        <div class="my-cartItem-btn">
           <el-button type="danger" @click="handleDeleteEvent(meta.ID,index)">删除</el-button>
        </div>
    </dd>
  </dl>
</template>

<script>
import { dateFilter } from "../../filter/dateFilter";
import { toMoney } from "../../filter/moneyFilter";
export default {
  props: ["meta", 'index'],
  data() {
    return {
      userName: '',
      errorImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"',
    };
  },
  computed:{
      discountPrice: function() {
          return (this.meta.SALES_COUNT * this.meta.PRESENT_PRICE).toFixed(1)
      },
      totalPrice: function() {
          return (this.meta.SALES_COUNT* this.meta.ORI_PRICE).toFixed(1)
      },
      discount: function() {
        return (this.totalPrice - this.discountPrice).toFixed(1)
      }

  },
  filters: {
    //过滤器
    dateFormat(date) {
      return dateFilter(date);
    },
    moneyFormat(money) {
      return toMoney(money)
    }
  },
  created() {
    const that = this
    setTimeout(()=>{
      this.meta.SALES_COUNT = 1
    },300)
  },
  methods: {
    // 删除购物车商品
    handleDeleteEvent(goodsId, index) {
      this.$emit('removeShoppingCart', goodsId, index)
    },

    // 跳转详情页
    jumpToDetail(id) {
      this.$router.push({ path: "/detail", query: { goodsId: id } });
    },
  },
};
</script>

<style scoped>
.my-date-filter {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
}
.my-sale-payment {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
}
.my-item-image {
  cursor: pointer;
}
.my-item-name {
  cursor: pointer;
  display: inline;
  font-size: 18px;
  font-weight: 900;
}
.my-item-name:hover {
  color: #008c8c;
}
.item-nocollection {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.item-collection {
  position: absolute;
  right: 50px;
  top: 0px;
}
.item-span-collection{
  position: absolute;
  top: 5px;
  right: 20px;
  font-size: 12px;
  line-height: 16px;
  height: 16px;
  color: #999;
  cursor: pointer;
}
.s-item-myprice{
  font-size: 16px !important;
  font-weight: 600;
}
.my-item-dd{
  position: relative;
}
.my-cartItem-num{
  font-size: 16px;
  padding: 10px 4px;
  color: #999;
}
.my-cartItem-style{
  display: flex;
  margin-left: -384px;
}
.my-cartItem-totalPrice{
  padding: 8px 8px;
  color: black;
  font-size: 16px;
}
.my-cartItem-discount{
  padding: 8px 8px;
  color: #008c8c;
  font-size: 16px;
}
.my-cartItem-discountPrice{
  padding: 8px 8px;
  color: red;
  font-size: 16px;
}
.my-cartItem-btn{
  margin-top: -40px;
}
</style>