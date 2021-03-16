<template>
  <div>
    <div v-if="!isError">
      <el-row class="page-collect">
        <el-col :span="20">
          <div
            class="page-product collect-collcet"
            v-for="(item, index) in serviceData"
            :key="index"
          >
            <item :meta="item"></item>
          </div>
          <div class="collect-pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="collectNum"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <my-error></my-error>
    </div>
  </div>
</template>

<script>
import item from "../pc_products/item";
import axios from "axios";
import url from "../../serviceAPIConfig";
import myError from "../error";
export default {
  components: {
    item,
    myError,
  },
  data() {
    return {
      serviceData: [],
      isError: true,
      collectNum: 0,
      pageSize: 1,
    };
  },
  created() {
    this.httpRequest();
  },
  methods: {
    handleCurrentChange(val) {
      this.pageSize = val;
      this.httpRequest();
    },
    httpRequest() {
      axios
        .get(url.goodsCollectData, {
          params: {
            page: this.pageSize,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.serviceData = res.data.message;
            this.isError = false;
            this.collectNum = res.data.collectNum;
          } else {
            this.serviceData = [];
            this.isError = true;
            this.collectNum = 0;
          }
        })
        .catch(() => {
          this.isError = true;
          this.serviceData = [];
          this.collectNum = 0;
        });
    },
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
.page-collect{
    display: flex;
    justify-content: center;
}
</style>
