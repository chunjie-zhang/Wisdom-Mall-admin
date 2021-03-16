<template>
  <div>
    <div v-if="!isError">
      <el-row class="page-collect">
        <el-col :span="20">
          <div class="my-collect-cart">
            <div class="my-collect-shoppingCart">购物车</div>
            <div class="my-collect-cartBtn">
              <el-button type="warning" @click="handleMoreRemove()">全部删除</el-button>
            </div>
          </div>
          <div
            class="page-product collect-collcet"
            v-for="(item, index) in serviceData"
            :key="index"
          >
            <cart-item :meta="item" :index ='index' @removeShoppingCart ='removeShoppingCart(arguments)' v-model="total"></cart-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" class="page-collect-payment">
          <div class="page-payment-total-text">总共: ￥
            <span class="page-payment-total">{{ total }}</span> 
            元</div>
          <el-button type="success" @click="handlePayMent()">去支付</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <my-error></my-error>
    </div>
  </div>
</template>

<script>
import cartItem from "./cartItem";
import axios from "axios";
import url from "../../serviceAPIConfig";
import myError from "../error";
export default {
  components: {
    cartItem,
    myError,
  },
  data() {
    return {
      userName: '',
      serviceData: [],
      isError: true
    };
  },
  computed:{
    total: function(newVal) {
      let allMoney = 0;
         this.serviceData.forEach((item,index)=>{
            allMoney+=item.PRESENT_PRICE*item.SALES_COUNT;
         })
         return allMoney;
     }
  },
  created() {
    if(localStorage.getItem('userInfo')) {
      this.userName = JSON.parse(localStorage.getItem('userInfo')).userName
    }
    this.httpRequest();
  },
  methods: {
    httpRequest() {
      axios
        .post(url.getShoppingCartData, {
          userName: this.userName
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.serviceData = res.data.message;
            this.isError = false;
            this.serviceData.length === 0 ? this.isError = true : ''
          } else {
            this.serviceData = [];
            this.isError = true;
          }
        })
        .catch(() => {
          this.isError = true;
          this.serviceData = [];
        });
    },
    removeShoppingCart(data) {
      let goodsId = data[0]
      let index = data[1]
      axios.post(url.removeShoppingCartData, {
        userName: this.userName,
        goodsIdData: typeof goodsId === Array ? goodsId : [ goodsId ]
      }).then((res)=>{
        if(res.data.code === 200){
          this.$message({
          message: res.data.message,
          type: 'success'
        });
        this.serviceData.splice(index, 1)
        this.serviceData.length === 0 ? this.isError = true : ''
      
        } else {
          this.$message({
          message: res.data.message,
          type: 'error'
        });
        }
      }).catch((err)=>{
        this.$message({
          message: '请求失败',
          type: 'error'
        });
      })
    },
    handlePayMent(){
      console.log(this.serviceData)
      axios.post(url.waitOrderPaymentData,{
        shoppingCartData: this.serviceData,
        userName: this.userName
      }).then((res)=>{
        if(res.data.code === 200){
          this.$message({
          message: res.data.message,
          type: 'success'
        });
        this.$router.push({name: 'pc_orderDetail'})
        } else {
          this.$message({
          message: res.data.message,
          type: 'error'
        });
        }
      }).catch((err)=>{
        this.$message({
          message: '去支付失败',
          type: 'error'
        });
      })
    },
    handleMoreRemove(){
      axios.post(url.removeAllShoppingData,{
        userName: this.userName
      }).then((res)=>{
        if(res.data.code === 200){
          this.$message({
          message: res.data.message,
          type: 'success'
        });
        this.serviceData = []
        this.isError = true
        } else {
          this.$message({
          message: res.data.message,
          type: 'error'
        });
        }
      }).catch(()=>{
        this.$message({
          message: '请求失败',
          type: 'error'
        });
      })
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/css/products/index.scss";
.collect-collcet {
  background-color: #fff;
}
.collect-pagination {
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
}
.my-collect-cart{
  background-color: #fff;
  display: flex;
}
.my-collect-shoppingCart{
  margin-top: 12px;
  font-size: 19px;
  font-weight: 1000;
}
.my-collect-cartBtn{
  justify-content: flex-end;
  margin-left: 835px;
}
.page-collect-payment{
  margin-top: 10px;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}
.page-payment-total{
  color: red;
}
.page-payment-total-text{
  margin-top: 10px;
  margin-right: 20px
}
</style>
