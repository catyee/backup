<template>
  <!-- 验证码组件 -->
  <div class="verification-code-container">
    <div class="input-box">
      <input @input="handleInput" v-model="verificationCode" type="text" placeholder="请输入验证码">
      <div class="color-danger tip">{{codeTip}}</div>
    </div>
    <div class="btn-box">
      <button @click="getVerificationCode" :disabled="disableCodeBtn">{{codeBtnText}}</button>
    </div>
  </div>
</template>
<script>
import "./verification-code.scss";
import { Toast } from "mint-ui";
export default {
  /**
   * verification-code -> 向父组件传递输入的验证码数据
   * telNumber -> 从父组件获取到的手机号码
   * type 1: 新用户注册手机号 2: 用户修改密码
   * codeTip 验证码提示
   */
  data() {
    return {
      verificationCode: "", // 验证码
      disableCodeBtn: false,
      codeBtnText: "获取验证码" // 验证码倒计时
    };
  },
  props: ["telNumber", "type", "codeTip"],
  methods: {
    // 点击获取验证码

    // 如果手机号错误，通知父组件提示
    // 如果手机号正确，计时器倒计时
    // 监听验证码输入，如果不为空发生通知给父组件，父组件验证手机号和验证码都不为空，确定按钮可以点击
    // 父组件点击确定按钮，子组件传递验证码给父组件
    async getVerificationCode() {
      // 如果手机号为空，发送通知给父组件，父组件提示
      if (!this.telNumber) {
        this.$emit("tel-tip", "请输入手机号");
        return;
      } else {
        this.$emit("tel-tip", "");
      }
      let url = "";
      if (this.type == 1) {
          // 新用户获取验证码
        url = "/admin/rest/user/get/message";
      } else {
        url = '/admin/rest/user/get/sms';
      }
      let data = {
        userName: this.telNumber
      };
      const success = await $api
        .post(url, data)
        .then(res => {
          if (res.code == 200) {
            return true;
          }
          if (res.code == 1001) {
            this.$emit("tel-tip", "手机号不合法");
            return false;
          }
          if (res.code == 404) {
            this.$emit("tel-tip", "手机号未注册");
            return false;
          }
          Toast("服务器错误" + res.code);
          return false;
        })
        .catch(e => {
          Toast("服务器错误" + JSON.stringify(e));
          return false;
        });
      if (success) {
        this.countDown();
      }
    },
    // 点击验证码倒计时
    countDown() {
      let _this = this;
      let time = 60;
      changeTime();
      function changeTime() {
           _this.disableCodeBtn = true;
        if (time <= 1) {
          clearInterval(timer);
          _this.$nextTick(() => {
            _this.codeBtnText = "获取验证码";
            _this.disableCodeBtn = false;
          });
          return;
        }
        _this.$nextTick(() => {
          _this.codeBtnText = time + "s";
        });
        time--;
      }
      var timer = window.setInterval(function() {
        changeTime();
      }, 1000);
    },
    // 监听输入
    handleInput() {
      this.$emit("verification-code", this.verificationCode);
    }
  }
};
</script>