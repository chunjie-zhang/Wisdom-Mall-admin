<template>
  <div class="page-mycomment">
    <div class="page-comment">
      <div class="comment-input">
        <el-input
          type="text"
          class="comment-input-input"
          placeholder="写出你的精彩评论吧"
          v-model="text"
          maxlength="60"
          show-word-limit
        >
        </el-input>
        <span
          ><el-button
            type="primary"
            @click="handleInputCommit"
            class="commit-submit"
            >提交</el-button
          ></span
        >
      </div>
      <div v-if="hasData">
      <div class="comment" v-for="(item, index) in newCommentData" :key="index">
        <div class="comment-avatar">
          <el-avatar size="medium" :src="circleUrl"></el-avatar>
          <div class="comment-main-name">
            {{ item.username }}
          </div>
        </div>
        <div class="comment-main">
          <div class="comment-main-comment">
            <div>
              {{ item.evalaute }}
            </div>
          </div>
          <div class="comment-main-apply">
            <div
              class="comment-main-huifu"
              @click="handleApply(index, item.username)"
            >
              回复
            </div>
            <div class="comment-main-jubao">举报</div>
          </div>
          <div class="comment-myinput" v-if="index === userId">
            <el-input
              type="text"
              :placeholder="placeholder"
              v-model="text1"
              maxlength="60"
              show-word-limit
            >
            </el-input>
            <span
              ><el-button
                type="primary"
                @click="handleMyinputCommit(index)"
                class="commit-submit"
                >提交</el-button
              ></span
            >
          </div>
        </div>
        <div
          v-if="item.sub_comment && item.sub_comment.length !== 0"
          class="comment-sub_comment"
        >
          <div v-for="(v, i) in item.sub_comment" :key="i">
            <div class="sub_comment-comment">
              <div class="sub_comment-username">{{ v.username }}</div>
              <div class="sub_comment-huifu">回复</div>
              <div class="sub_comment-replay">{{ v.replay }}</div>
            </div>
            <div class="sub_comment-main">
              {{ v.evalaute }}
            </div>
            <div class="sub_comment-main-apply">
              <div
                class="sub_comment-main-huifu"
                @click="handleCommentApply(index, i, v.username)"
              >
                回复
              </div>
              <div class="sub_comment-main-jubao">举报</div>
            </div>
            <div
              class="comment-myinput"
              v-if="i === replayId && index === myUserId"
            >
              <el-input
                type="text"
                :placeholder="myplaceholder"
                v-model="text2"
                maxlength="60"
                show-word-limit
              >
              </el-input>
              <span
                ><el-button
                  type="primary"
                  @click="handleMyReplayCommit(index,i)"
                  class="commit-submit"
                  >提交</el-button
                ></span
              >
            </div>
          </div>
        </div>
      </div>
      </div>
      <div class="comment-pagination" v-if="commentTotal > 0">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="commentTotal"
          :page-size="5"
          class="comment-pagination"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <my-error v-else></my-error>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../serviceAPIConfig";
import myError from "../error";
export default {
  props: ["commentData", 'goodsId'],
  components: { myError },
  data() {
    return {
      myUserName:'',// 评论者
      userId: "",
      myUserId: "",
      replayId: "",
      hasData: true,
      newCommentData: [],
      commentTotal: 0,
      text: "",
      text1: "",
      text2: "",
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      placeholder: "",
      myplaceholder: "",
    };
  },
  created() {
    const that = this;
    setTimeout(function () {
      console.log(that.commentData);
      if (that.commentData && that.commentData.length !== 0) {
        that.hasData = true
        that.newCommentData = that.commentData.slice(0, 5);
        that.commentTotal = that.commentData.length;
      } else {
        that.hasData = false;
      }
      that.myUserName = JSON.parse(localStorage.getItem('userInfo')).userName
    }, 200);
  },
  methods: {
    // 显示二级输入框
    handleApply(index, username) {
      this.userId = index;
      this.placeholder = `回复:${username}`;
    },
    // 显示三级输入框
    handleCommentApply(index, i, replayname) {
      this.replayId = i;
      this.myUserId = index;
      this.myplaceholder = `回复:${replayname}`;
    },
    // 一级回复
    handleInputCommit(){
      this.newCommentData.unshift({
        username: this.myUserName,
        evalaute: this.text,
        sub_comment:[]
      })
      this.commentTotal +=1
      this.hasData = true
      this.updateGoodsComment()
    },
    // 二级回复
    handleMyinputCommit(index) {
      this.newCommentData[index].sub_comment.push({
        username: this.myUserName,
        replay: this.newCommentData[index].username,
        evalaute: this.text1,
      })
      this.hasData = true
      this.updateGoodsComment()
    },
    // 三级回复
    handleMyReplayCommit(index, i) {
      this.newCommentData[index].sub_comment.push({
        username: this.myUserName,
        replay: this.newCommentData[index].sub_comment[i].username,
        evalaute: this.text2,
      })
      this.hasData = true
      this.updateGoodsComment()
    },
    // 更新评论
    updateGoodsComment() {
      axios.post(url.updateGoodsComment,{
        newCommentData: this.newCommentData,
        commentTotal: this.commentTotal,
        goodsId: this.goodsId
      }).then((res)=>{
        console.log(res)
      }).catch((err)=>{
        console.log(err)
      })
    },
    handleCurrentChange(val){
      console.log(val)
      this.newCommentData = this.commentData.slice((val-1)*5, val*5);
    }
  },
};
</script>

<style scoped>
.page-mycomment {
  min-height: 1100px;
}
.comment {
  padding: 10px 0px;
}
.comment-input-input {
  width: 700px;
}
.comment-myinput {
  display: flex;
  margin: 10px 20px;
  width: 800px;
}
.commit-submit {
  margin-left: 15px;
}
.comment-avatar {
  display: flex;
  margin-left: 15px;
  cursor: pointer;
}
.comment-main {
  margin-left: 15px;
}
.comment-main-name {
  color: #409eff;
  margin-left: 10px;
  margin-top: 6px;
  cursor: pointer;
}
.comment-main-comment {
  margin-top: 5px;
  margin-left: 25px;
  font-size: 16px;
  flex-wrap: wrap;
}
.comment-main-apply {
  display: flex;
  font-size: 14px;
  justify-content: flex-end;
  margin-right: 15px;
  padding-bottom: 10px;
  cursor: pointer;
}
.comment-main-jubao:hover {
  color: #409eff;
}
.comment-main-huifu {
  margin-right: 10px;
}
.comment-main-huifu:hover {
  color: #409eff;
}
.comment-input {
  padding: 15px 40px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}
.comment-pagination {
  display: flex;
  justify-content: flex-end;
  margin-right: 2px;
  margin-bottom: 8px;
}
.comment-sub_comment {
  margin-left: 40px;
  background-color: rgba(0, 0, 0, 0.1);
}
.sub_comment-comment {
  display: flex;
  padding: 5px 20px 2px;
}
.sub_comment-huifu {
  margin-left: 4px;
  margin-right: 4px;
  cursor: pointer;
}
.sub_comment-main {
  margin-left: 35px;
}
.sub_comment-main-apply {
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
  font-size: 14px;
  padding: 3px 0px;
  cursor: pointer;
}
.sub_comment-username {
  color: #409eff;
  cursor: pointer;
}
.sub_comment-main-huifu {
  margin-right: 5px;
  cursor: pointer;
}
.sub_comment-main-huifu:hover {
  color: #409eff;
}
.sub_comment-main-jubao:hover {
  color: #409eff;
}
</style>