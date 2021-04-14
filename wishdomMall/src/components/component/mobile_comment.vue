<template>
  <div>
    <div class="m-comment-input">
      <el-input
        v-model="text"
        class="comment-el-input"
        maxlength="60"
        show-word-limit
        size="medium"
        :placeholder="myplaceholder"
      ></el-input>
      <el-button
        type="primary"
        class="comment-el-btn"
        @click="handleInputCommit"
        >提交</el-button
      >
    </div>
    <div v-if="hasData">
      <div class="comment-page">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="(item, index) in newCommentData" :key="index">
            <div @click="handleApply(index, item.username)">
              <div class="comment-item-top">
                <img class="comment-item-vanter" :src="circleUrl" alt="头像" />
                <div class="comment-item-username">
                  {{ item.username }}
                </div>
              </div>
              <div class="comment-main">
                <div class="comment-main-comment">
                  {{ item.evalaute }}
                </div>
                <div class="comment-replay">
                  <div class="comment-replay-my">回复</div>
                  <div>举报</div>
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
            </div>
            <div v-if="item.sub_comment && item.sub_comment.length !== 0">
              <div
                v-for="(v, i) in item.sub_comment"
                :key="i"
                @click="handleCommentApply(index, i, v.username)"
              >
                <div class="comment-comment">
                  <div class="comment-v-top">
                    <div class="comment-v-username">
                      <span class="comment-v-myusername"
                        >{{ v.username }}
                      </span>
                      <span class="comment-v-myreplay">回复</span>
                      <span class="comment-v-replay">{{ v.replay }}</span>
                    </div>
                  </div>
                  <div class="comment-v">
                    <div class="comment-v-comment">
                      {{ v.evalaute }}
                    </div>
                    <div class="comment-v-replayItem">
                      <div class="comment-v-my">回复</div>
                      <div>举报</div>
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
                          @click="handleMyReplayCommit(index, i)"
                          class="commit-submit"
                          >提交</el-button
                        ></span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
    <my-error v-else></my-error>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../serviceAPIConfig";
import { Toast } from "vant";
import myError from "../error";
export default {
  props: ["commentData", "goodsId"],
  components: { myError },
  data() {
    return {
      index: 0,
      loading: false,
      finished: false,
      myUserName: "", // 评论者
      userId: "",
      myUserId: "",
      replayId: "",
      hasData: false,
      newCommentData: [],
      commentTotal: 0,
      text: "",
      text1: "",
      text2: "",
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      placeholder: "",
      myplaceholder: "请留下你的精彩评论吧",
    };
  },
  created() {
    const that = this;
    setTimeout(function () {
      if (that.commentData && that.commentData.length !== 0) {
        that.hasData = true;
        that.newCommentData = that.commentData.slice(this.index, 5);
        that.commentTotal = that.commentData.length;
      } else {
        that.hasData = false;
      }
      that.myUserName = JSON.parse(localStorage.getItem("userInfo")).userName;
    }, 200);
  },
  methods: {
    onLoad() {
      console.log(this.newCommentData);
      if (this.newCommentData.length === this.commentTotal) {
        this.finished = true;
        return;
      }
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.index++;
      this.newCommentData.push(
        this.commentData.slice(this.index * 5, (this.index + 1) * 5)
      );
      // 加载状态结束
      this.loading = false;

      // 数据全部加载完成
    },
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
    handleInputCommit() {
      this.newCommentData.unshift({
        username: this.myUserName,
        evalaute: this.text,
        sub_comment: [],
      });
      this.commentTotal += 1;
      this.hasData = true;
      this.updateGoodsComment();
    },
    // 二级回复
    handleMyinputCommit(index) {
      this.newCommentData[index].sub_comment.push({
        username: this.myUserName,
        replay: this.newCommentData[index].username,
        evalaute: this.text1,
      });
      this.hasData = true;
      this.updateGoodsComment();
    },
    // 三级回复
    handleMyReplayCommit(index, i) {
      this.newCommentData[index].sub_comment.push({
        username: this.myUserName,
        replay: this.newCommentData[index].sub_comment[i].username,
        evalaute: this.text2,
      });
      this.hasData = true;
      this.updateGoodsComment();
    },
    // 更新评论
    updateGoodsComment() {
      axios
        .post(url.updateGoodsComment, {
          newCommentData: this.newCommentData,
          commentTotal: this.commentTotal,
          goodsId: this.goodsId,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.comment-page {
  overflow: hidden;
  text-align: left;
}
.m-comment-input {
  display: flex;
  padding: 8px 8px;
}
.comment-el-btn {
  margin-left: 8px;
}
.comment-item-top {
  display: flex;
}
.comment-item-vanter {
  margin: 5px 8px;
  width: 35px;
  height: 35px;
}
.comment-item-username {
  margin: 8px 0px;
  font-size: 16px;
  color: #409eff;
}
.comment-main-comment {
  margin-left: 38px;
}
.comment-replay {
  display: flex;
  justify-content: flex-end;
  margin-right: 15px;
}
.comment-replay-my {
  margin-right: 10px;
}
.comment-v-username {
  margin-left: 5px;
}
.comment-v-myusername {
  color: #409eff;
  margin-left: 5px;
}
.comment-v-replay {
  margin-left: 5px;
}
.comment-comment {
  padding: 3px 0px;
  margin-top: 5px;
  margin-left: 38px;
  background-color: rgba(0, 0, 0, 0.04);
}
.comment-v-comment {
  margin-left: 18px;
}
.comment-v-replayItem {
  display: flex;
  justify-content: flex-end;
}
.comment-v-my {
  margin-right: 8px;
}
.comment-myinput{
  display: flex;
  padding: 3px 5px;
}
.commit-submit{
  margin-left: 5px;
}
</style>