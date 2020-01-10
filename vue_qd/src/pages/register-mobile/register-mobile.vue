<template>
  <div class="register-mobile-container">
    <div class="common-header-container">
      <mt-header fixed title="注册手机号">
          <router-link to="/login" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <div class="common-header-height"></div>
    </div>
    <div class="content">
      <!-- 手机号码输入框 -->
      <div class="tellphone">
        <input type="number" placeholder="请输入手机号码" @input="handlePhone" v-model="tellphoneNum">
        <div class="color-danger tip">{{phoneTip}}</div>
      </div>
      <!-- 验证码输入框 -->
      <div>
        <verification-code
          :tel-number="tellphoneNum"
          :type="1"
          :code-tip="codeTip"
          @verification-code="verificationCodeChange"
          @tel-tip="showTelTip"
        />
      </div>
      <!-- 密码输入框 -->
      <div class="password">
        <input type="password" placeholder="密码" @input="handlePwd" v-model="password">
        <div class="color-danger tip">{{pwdTip}}</div>
      </div>
      <div class="password">
        <input type="password" placeholder="确认密码" @input="handleRePwd" v-model="rePassword">
        <div class="color-danger tip">{{rePwdTip}}</div>
      </div>
      <!-- 确定按钮 -->
      <div class="btn">
        <div
          @click="handleSubmit"
          class="btn-submit"
          :class="{'btn-submit-forbid': verificationCode.length == 0 || tellphoneNum.length == 0 || password.length == 0 || rePassword.length == 0}"
        >确定</div>
      </div>
      <!-- 信息提示框 -->
      <message-box v-show="isMessageBoxShow" :messageBoxProps="messageBoxProps"></message-box>
    </div>
  </div>
</template>
<script>
import "./register-mobile.scss";
import VerificationCode from "@/components/common/verification-code";
import { Toast } from "mint-ui";
import CommonModule from "@/common/common.js";
export default {
  created() {
    $api.clearStorage();
  },
  components: {
    "verification-code": VerificationCode
  },
  data() {
    return {
      tellphoneNum: "",
      phoneTip: "", //手机号相关的提示
      codeTip: "", // 验证码提示
      pwdTip: "", // 密码提示
      rePwdTip: "", // 确认密码提示

      verificationCode: "", // 验证码
      password: "", // 密码
      rePassword: "", // 确认密码
      messageBoxProps: {
        message: "注册成功",
        img: "success",
        handleBtnName: "抢单需要完善信息>>",
        handleBtnCallBack: this.handleBtnCallBack,
        closeCallBack: this.handleBtnCallBack
      },
      isMessageBoxShow: false
    };
  },
  methods: {
    // 点击验证码时，判断是否已输入手机号
    showTelTip($event) {
      this.phoneTip = $event;
    },
    // 获取验证码

    verificationCodeChange($event) {
      this.verificationCode = $event;
      // 获取验证码的同时，验证验证码
      this.handleCode();
    },

    // 验证手机号
    handlePhone() {
      // 如果没有输入手机号，提示
      if (!this.tellphoneNum) {
        this.phoneTip = "请输入手机号";
        return false;
      }
      this.phoneTip = "";
      return true;
    },
    // 验证验证码
    handleCode() {
      // 如果没有输入验证码，提示
      if (!this.verificationCode) {
        this.codeTip = "请输入验证码";
        return false;
      }
      this.codeTip = "";
      return true;
    },

    // 验证密码
    handlePwd() {
      // 如果没有输入密码，提示
      if (!this.password) {
        this.pwdTip = "请输入密码";
        return false;
      }
      this.pwdTip = "";
      return true;
    },
    // 验证确认密码
    handleRePwd() {
      // 如果没有确认密码，提示
      if (!this.rePassword) {
        this.rePwdTip = "请确认密码";
        return false;
      }
      this.rePwdTip = "";
      // 验证两次密码输入一致性
      if (this.password != this.rePassword) {
        this.rePwdTip = "两次密码输入不一致";
        return false;
      }
      this.rePwdTip = "";
      return true;
    },

    // 点击‘确定’按钮
    handleSubmit() {
      // 手机号提示
      if (!this.handlePhone()) return;
      // 如果没有输入验证码，提示
      if (!this.handleCode()) return;

      // 验证密码
      if (!this.handlePwd()) return;

      // 验证确认密码
      if (!this.handleRePwd()) return;
      this.verifyPhoneCode();
    },
    // 关闭信息提示框的回调函数
    handleBtnCallBack() {
      this.$router.push({ path: "/register" });
    },
    // 验证验证码是否和手机号匹配
    async verifyPhoneCode() {
      let url = "/admin/rest/user/message/validate";
      let data = {
        userName: this.tellphoneNum,
        code: this.verificationCode
      };
      const success = await $api
        .post(url, data)
        .then(res => {
          if (res.code == 200) {
            return true;
          }
          if (res.code == 1015) {
            this.codeTip = "验证码失效";
            return false;
          }
           if (res.code == 1016) {
            this.codeTip = "验证码错误";
            return false;
          }
          Toast("服务器错误" + res.code);
          return false;
        })
        .catch(e => {
          Toast(JSON.stringify(e));
          return false;
        });
        if(success) {
          this.register();
        }
    },

    // 注册信息
    register() {
      // 发送请求
      let url = "/admin/rest/user/qRegister";
      let data = {
        userName: this.tellphoneNum,
        password: this.password
      };

      $api
        .post(url, data)
        .then(res => {
          if (res.code == 200) {
            this.login();
            return;
          }
          if (res.code == 1003) {
            this.phoneTip = "手机号已被注册";
            return;
          }
          Toast("服务器错误" + res.code);
        })
        .catch(e => {
          Toast(JSON.stringify(e));
        });
    },
    // 登录
    login() {
      let url = "/qd/rest/user/login";
      let data = {
        userName: this.tellphoneNum,
        password: this.password
      };
      window.$api.post(url, data).then(res => {
        if (!res || !res.body || res.code != 200) {
          this.messageBoxProps["handleBtnName"] = "注册成功，请先登录";
          this.messageBoxProps["handleBtnCallBack"] = function() {
            this.$router.push({ path: "/login" });
          };
          return false;
        }
        if (res.code == 200) {
          this.setData(res.body);
          this.isMessageBoxShow = true;
          return true;
        } 
      }).catch(e => {
        
      })
    },
    // 登录之后的写数据操作
    setData(content) {
      $api.setStorage("partTimerStatus", content.partTimerStatus); // 注册状态
      $api.setStorage("partTimerId", content.partTimerId); // 注册状态
      $api.setStorage("userId", content.userId); // 注册状态
      $api.setStorage("userType", content.userType); // 用户类型 4兼职 2 巡检全职
      $api.setStorage("token", content.token); // token
      $api.setStorage("username", this.tellphoneNum); // username
    },
  },

  mounted() {
    CommonModule.topAdaption('.mint-header');
    $api.dom('.common-header-height').style.height = $api.offset($api.dom('.mint-header')).h + 'px';
  },
};
</script>