<template>
    <div class="goods-info" @click="goGoodsPage()">
        <div class="goods-image">
            <img v-lazy="goodsImage" width="90%" />
        </div>
        <div class="goods-name">{{goodsName}}</div>
        <div class="goods-price">￥{{goodsPrice | moneyFilter }}</div>
    </div>
</template>

<script>
    import {toMoney} from '@/filter/moneyFilter.js'
    export default {
        props:['goodsImage','goodsName','goodsPrice',"goodsId"],
        filters:{//过滤器
            moneyFilter(money){
                return toMoney(money)
            }  
        },
        methods:{
            goGoodsPage(){
                this.$router.push({name:"Goods",query:{goodsId:this.goodsId}})
            }
        }
    }
</script>

<style>
.goods-info{
     text-align: center;
    border-bottom:1px solid #ddd;
}
.goods-name {
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.goods-price{
    color:red;
    /* text-align: center; */
}
</style>