<template>
  <div class="modify-password-container">
    <div class="common-header-container">
      <mt-header fixed title="修改密码">
        <router-link to="/user-center" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <div class="common-header-height"></div>
    </div>
    <div class="gray-line"></div>
    <div class="content">
      <div class="old">
        <input type="text" placeholder="原密码" v-model="oldPassword">
        <div class="color-danger tip">{{oldPasswordTip}}</div>
      </div>
      <div class="new">
        <input type="text" placeholder="新密码" v-model="newPassword">
      </div>
      <div class="affirm">
        <input type="text" placeholder="确认密码" v-model="affirmPassword">
      </div>
      <div class="btn-box">
        <div class="btn-submit" @click="handleSubmit">确定</div>
      </div>
    </div>

    <!-- 信息提示弹框 -->
    <message-box
      @close-message-box="closeMessageBox"
      v-show="isMessageBoxShow"
      :messageBoxProps="messageBoxProps"
    ></message-box>
  </div>
</template>
<script>
import "./modify-password.scss";
import { Toast } from "mint-ui";
import CommonModule from "@/common/common.js";
export default {
  data() {
    return {
      messageBoxProps: {
        message: "",
        img: "",
        closeCallBack: null
      },
      isMessageBoxShow: false, // 是否显示信息提示弹框
      oldPassword: "", // 原密码
      newPassword: "", // 新密码
      affirmPassword: "", // 确认密码
      userName: "", // 用户名
      oldPasswordTip: "" // 原密码提示
    };
  },
  created() {
    this.userName = $api.getStorage("username");
  },
  methods: {
    // 点击‘确定’
    handleSubmit() {
      if (!this.handleSame()) return;
      this.modifySubmit();
    },
    // 关闭信息弹框
    closeMessageBox() {
      this.isMessageBoxShow = false;
    },
    // 关闭信息弹框的回调函数
    closeCallBack() {
      this.$router.push({ path: "/login" });
    },
    // 验证新密码和确认新密码输入是否一致
    handleSame() {
      if (this.newPassword !== this.affirmPassword) {
        Toast("两次输入的密码不一致");
        return false;
      } else if (!this.newPassword) {
        Toast("请输入新密码");
        return false;
      } else if (!this.affirmPassword) {
        Toast("请输入新密码");
        return false;
      } else {
        return true;
      }
    },
    async modifySubmit() {
      let url = "/admin/rest/user/edit/password";
      let data = {
        userName: this.userName,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      };

      const success = await $api
        .post(url, data)
        .then(res => {
          if (res.code === 200) {
            return true;
          }
          if (res.code === 404) {
            this.oldPasswordTip = "原密码输入错误";
            return false;
          }
          if (res.code === 1007) {
            Toast("用户名为空");
            return false;
          }
        })
        .catch(e => {
          Toast(JSON.stringify(e));
          return false;
        });

      if (success) {
        this.messageBoxProps = {
          message: "修改密码成功",
          img: "success",
          closeCallBack: this.closeCallBack
        };
        this.isMessageBoxShow = true;
      } else {
        this.messageBoxProps = {
          message: "修改密码失败",
          img: "failure"
        };
        this.isMessageBoxShow = true;
      }
    }
  },
  mounted() {
    CommonModule.topAdaption(".mint-header");
    $api.dom(".common-header-height").style.height =
      $api.offset($api.dom(".mint-header")).h + "px";
  }
};
</script>