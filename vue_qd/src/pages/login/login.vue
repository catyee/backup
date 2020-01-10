<template>
  <div class="page-login-container">
    <!-- <div class="phone-statusbar-height"></div> -->
    <div class="height165"></div>
    <img src="@/assets/logo.png" class="logo">
    <div class="height78"></div>
    <div class="login-panel">
      <mt-field label="账号" placeholder="请输入手机号" v-model="username">
        <div class="color-danger">{{usernameTip}}</div>
      </mt-field>
      <div class="height70"></div>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password" id="password">
        <div class="color-danger">{{passwordTip}}</div>
      </mt-field>
      <div class="height38"></div>
      <div class="tip-panel">
        <div class="left">
          <div class="radio-box pr-10">
            <input
              type="radio"
              id="radio"
              :checked="checkProtocol"
              @click="checkProtocol = !checkProtocol"
            >
            <label for="radio"></label>
          </div>
          <div @click="checkProtocol = !checkProtocol">
            同意抢单协议
            <span class="color-yellow">
              <router-link :to="{path: '/agreement',query: {
                name: '/login'
              }}">《抢单协议》</router-link>
            </span>
          </div>
        </div>
        <router-link to="/login/find-back-password">忘记密码？</router-link>
      </div>
      <div class="height100"></div>
      <div class="height120"></div>
      <div class="btn-submit" @click="login">登录</div>

      <div class="height40"></div>
      <div class="btn-submit-normal" @click="toRegister">立即注册</div>
    </div>
  </div>
</template>
<script>
import "./login.scss";
import { Toast } from "mint-ui";
import CommonModule from "@/common/common.js";
export default {
  data() {
    return {
      username: "", // 账号
      password: "", // 密码
      // username: '',
      // password: '',
      usernameTip: "", // 用户名为空或错误提示
      passwordTip: "", // 密码为空或错误提示
      checkProtocol: false
    };
  },
  created() {
    // alert($api.getStorage('token'))
  },
  mounted() {
    CommonModule.topAdaption(".page-login-container");
  },
  methods: {
    login() {
      let checked = this.checkData();
      if (checked) {
        let url = "/qd/rest/user/login";
        let data = {
          userName: this.username,
          password: this.password
        };
        window.$api.post(url, data).then(res => {
          if (!res || !res.body) {
            Toast("服务器发生错误");
            return;
          }
          switch (res.code) {
            case 200:
              Toast("登录成功");
              this.setData(res.body);
              break;
            case 1201:
              this.usernameTip = "用户不存在";
              this.passwordTip = "";
              break;
            case 1202:
              this.usernameTip = "";
              this.passwordTip = "密码错误";
              break;
            default:
              Toast("服务器错误" + res.code);
          }
        });
      }
    },
    // 验证输入是否为空及是否点击同意抢单协议
    checkData() {
      if (!this.username) {
        this.usernameTip = "请先输入账号";
        return false;
      } else {
        this.usernameTip = "";
      }
      if (!this.password) {
        this.passwordTip = "请先输入密码";
        return false;
      } else {
        this.passwordTip = "";
      }
      if (!this.checkProtocol) {
        Toast("请先阅读协议");
        return false;
      }
      return true;
    },

    // 登录之后的写数据操作
    setData(content) {
      $api.clearStorage();
      $api.setStorage("partTimerStatus", content.partTimerStatus); // 注册状态
      $api.setStorage("partTimerId", content.partTimerId); // 注册状态
      $api.setStorage("userId", content.userId); // 注册状态
      $api.setStorage("userType", content.userType); // 用户类型 4兼职 2 巡检全职
      $api.setStorage("token", content.token); // token
      $api.setStorage("username", this.username); // username
      this.$router.push("/user-center");
    },

    // 去注册手机号
    toRegister() {
      this.$router.push("/register-mobile");
    }
  }
};
</script>
