<template>
  <div class="user-center-container pb-184">
    <!-- <div class="common-header-container">
      <div class="phone-statusbar-height"></div>
    </div>-->
    <!-- 顶部 -->
    <div class="top pl-40 pr-40 mb-200">
      <!-- 未登录 -->
      <router-link to="/login" v-if="toLogin">
        <div class="user-base-inf pt-36 mb-50">
          <!-- 头像 -->
          <div class="head-photo mr-30">
            <img src="@/assets/head-pic.png" alt />
          </div>
          <!-- 姓名，身份证号 -->
          <div class="base-inf pt-25">
            <div class="status">
              <p class="name">未登录</p>
            </div>
          </div>
        </div>
      </router-link>

      <!-- 已登录且可以查看完善的信息  -->
      <router-link :to="'/register/'+flag" v-if="link && !toLogin">
        <div class="user-base-inf pt-36 mb-50">
          <!-- 头像 -->
          <div class="head-photo mr-30" @click="showVersion=true">
            <img src="@/assets/head-pic.png" alt />
          </div>
          <!-- 姓名，身份证号 -->
          <div class="base-inf pt-25">
            <div class="status">
              <p class="name">{{(!partTimerName || partTimerName == 'undefined')? '':partTimerName}}</p>
              <p class="name">{{userStatus? `(${userStatus})`:''}}</p>
              <!-- <p class="name f34" v-if="!link && !toLogin">({{userStatus}})</p> -->
            </div>
            <div class="user-id f28">
              <span>{{username}} &nbsp;</span>
              <div class="r-arrow f24">
                <img src="@/assets/r-arrow.png" alt />
              </div>
            </div>
          </div>
        </div>
      </router-link>

      <!-- 已登录且不能查看完善的信息  -->
      <div class="user-base-inf pt-36 mb-50" v-if="!link && !toLogin">
        <!-- 头像 -->
        <div class="head-photo mr-30">
          <img src="@/assets/head-pic.png" alt />
        </div>
        <!-- 姓名，身份证号 -->
        <div class="base-inf pt-25">
          <div class="status">
            <p class="name">{{(!partTimerName || partTimerName == 'undefined')? '':partTimerName}}</p>
            <p class="name">({{userStatus}})</p>
          </div>
          <div class="user-id f28">
            <span>{{username}} &nbsp;</span>
            <div class="r-arrow f24">
              <img src="@/assets/r-arrow.png" alt />
            </div>
          </div>
        </div>
      </div>

      <!-- 中间收入和订单数量匡 -->
      <div class="count pt-58 pb-58">
        <div class="item">
          <p class="f60">{{deductInCome + actualInCome}}</p>
          <p class="f24">总收入(元)</p>
        </div>
        <div class="line"></div>
        <div class="item">
          <p class="f60">{{currentMonthDeductInCome+currentMonthActualInCome}}</p>
          <p class="f24">本月应结金额(元)</p>
        </div>
        <div class="line"></div>
        <div class="item">
          <p class="f60">{{currentMonthDeductOrderCount+currentMonthActualOrderCount}}</p>
          <p class="f24">本月订单数量(单)</p>
        </div>
      </div>
    </div>
    <!-- 中部选项 -->
    <div class="center pt-60 pr-40 pl-40">
      <ul>
        <router-link tag="li" to="/user-center/income-detail">
          <div class="user-center-options f30">
            <img class="mr-16" src="@/assets/shourumingxi.png" alt />
            <span>收入明细</span>
          </div>
          <div class="r-arrow f24">
            <img class="mr-16 ml-36" src="@/assets/r-arrow.png" alt />
          </div>
        </router-link>
        <!-- <router-link tag="li" to="/login/find-back-password"> -->
        <li>
          <div class="user-center-options f30">
            <img class="mr-16" src="@/assets/wode-pignfen.png" alt />
            <span>我的评分</span>
          </div>
          <div class="r-arrow f24">
            <span>{{rate}}</span>
            <!-- <img class="mr-16 ml-36" src="@/assets/r-arrow.png" alt> -->
          </div>
        </li>
        <!-- </router-link> -->
        <router-link tag="li" to="/user-center/my-evaluate">
          <div class="user-center-options f30">
            <img class="mr-16" src="@/assets/wodepingjia.png" alt />
            <span>我的评价</span>
          </div>
          <div class="r-arrow f24">
            <img class="mr-16 ml-36" src="@/assets/r-arrow.png" alt />
          </div>
        </router-link>
        <router-link tag="li" to="/user-center/modify-password">
          <div class="user-center-options f30">
            <img class="mr-16" src="@/assets/xiugaimima.png" alt />
            <span>修改密码</span>
          </div>
          <div class="r-arrow f24">
            <img class="mr-16 ml-36" src="@/assets/r-arrow.png" alt />
          </div>
        </router-link>
      </ul>
    </div>
    <!-- 底部按钮 -->
    <div class="bottom-btn">
      <div class="btn-submit" @click="logout()" v-if="!toLogin">安全退出</div>
      <div class="btn-submit" @click="login()" v-if="toLogin">去登录</div>
    </div>

    <!-- 版本号显示 -->
    <mt-popup v-model="showVersion" position="right" :modal="false">
      <div class="version-panel pt-300">
        <div class="f24">当前版本:</div>
        <div class="bold f48">{{appVersion}}</div>
        <div class="btn-submit" @click="closeVersion()">关闭</div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import "./user-center.scss";
import { partTimerStatus } from "@/common/enum.js";
import { MessageBox, Toast, Popup } from "mint-ui";
import CommonModule from "@/common/common.js";
export default {
  data() {
    return {
      toLogin: false, // 是否未登录需要跳转到登录页
      flag: "", // 传递到注册页register，如果flag为‘1’表示查看注册页信息，如果为‘’表示注册信息
      partTimerStatus: "", //用户状态值
      userStatus: "", //用户状态文字
      username: "", // 用户名
      link: true, //是否链接到完善信息
      sumInCome: 0, // 总收入
      orderCount: 0, // 订单数量
      userId: $api.getStorage("userId"),
      partTimerId: $api.getStorage("partTimerId"),
      partTimerName: $api.getStorage("partTimerName"),
      rate: "", //好评率
      deductInCome: 0, // 扣费的金额
      actualInCome: 0, // 实际收入的金额
      deductOrderCount: 0, // 违约的订单数量
      actualOrderCount: 0, // 实际收入的订单数量
      currentMonthDeductInCome: 0, // 当前月扣费的金额
      currentMonthActualInCome: 0, // 当前月实际收入的金额
      currentMonthDeductOrderCount: 0, // 当前月违约的订单数量
      currentMonthActualOrderCount: 0, // 当前月实际收入的订单数量
      showVersion: false, // 是否显示版本号
      appVersion: "" // 当前app版本号
    };
  },
  created() {
    this.checkToken(); // 验证token是否失效
    this.checkHasUpdated(); // 检查是否更新
    this.checkToUpdate();
  },
  mounted() {
    CommonModule.topAdaption(".top");
    // 长按页面显示版本号
    let _this = this;
    api.addEventListener(
      {
        name: "longpress"
      },
      function(ret, err) {
        _this.appVersion = _this.getVersion();
        _this.showVersion = true;
      }
    );
  },
  methods: {
    // 关闭查看版本号页面
    closeVersion() {
      this.showVersion = false;
    },
    // 验证token是否失效
    async checkToken() {
      let success;
      // 验证有没有token
      success = CommonModule.hasToken();
      if (!success) {
        // 提示未登录
        this.toLogin = true;
        return;
      }

      success = await CommonModule.getTokenTime();
      if (success) {
        // 如果未失效，验证审核状态
        this.getUserStatus();
      } else {
        // 如果失效，提示是否重新登录
        this.showLogoutBox("登录已过期，是否需要重新登录？");
        this.toLogin = true;
      }
    },

    // 提示退出登录
    showLogoutBox(tip) {
      MessageBox({
        title: "提示",
        message: tip,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonClass: "color-yellow",
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        cancelButtonClass: "color-grey"
      }).then(action => {
        if (action == "cancel") {
        }
        if (action == "confirm") {
          // 执行退出的逻辑
          // 清空所有存储信息
          $api.clearStorage();
          this.$router.push("/login");
        }
      });
    },
    // 退出登录
    logout() {
      this.showLogoutBox("您将退出此次登录，是否确定?");
    },

    // 去登陆
    login() {
      this.$router.push("/login");
    },

    // 审核不通过的提示
    noPassTip(tip) {
      MessageBox({
        title: "审核不通过",
        message: tip + ",是否重新提交信息审核",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonClass: "color-yellow",
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        cancelButtonClass: "color-grey"
      }).then(action => {
        if (action == "cancel") {
        }
        if (action == "confirm") {
          this.$router.push("/register/2");
        }
      });
    },
    // 初始化用户状态
    initUserStatus() {
      // 获取状态
      let username = $api.getStorage("username");
      let remark = $api.getStorage("remark");
      this.username = username; // 用户名
      this.partTimerStatus = $api.getStorage("partTimerStatus");
      let status = this.partTimerStatus; // 用户审核状态
      this.flag = ""; // 重置传递到register的flag为空
      if (status == partTimerStatus[0]) {
        this.userStatus = "已认证";
        // 获取用户审核状态会返回partTimerId
        this.partTimerId = $api.getStorage("partTimerId"); //
        this.flag = "1"; // 表示可以到注册页查看信息
        this.link = true; // 表示可以跳转到注册页
        this.getActualInCome(); // 获取实际收入及订单数量
        this.getDeductInCome(); // 获取扣费金额及订单数量
        this.getCurrentMonthActualInCome(); // 获取当前月实际收入及订单数量
        this.getCurrentMonthDeductInCome(); // 获取当前月扣费金额及订单数量
        this.getEvaluateRate(); // 获取好评率
        return;
      }
      //面试未通过
      if (status == partTimerStatus[1]) {
        this.userStatus = "面试未通过";
        this.flag = "2"; // 表示到注册页进行注册信息
        this.link = true; // 表示可以跳转到注册页
        this.noPassTip(remark);
        return;
      }
      //审核未通过
      if (status == partTimerStatus[2]) {
        this.userStatus = "审核未通过";
        this.flag = "2"; // 表示到注册页进行注册信息
        this.link = true; // 表示可以跳转到注册页
        this.noPassTip(remark);
        return;
      }
      //审核中
      if (status == partTimerStatus[3] || status == partTimerStatus[4]) {
        this.userStatus = "审核中";
        this.flag = "1"; // 表示可以到注册页查看信息
        this.link = true; // 表示可以跳转到注册页
        return;
      }
      //未完善信息
      if (status == partTimerStatus[5]) {
        this.userStatus = "未完善信息";
        this.flag = ""; // 表示到注册页进行注册信息
        this.link = true; // 表示可以跳转到注册页
        return;
      }

      //已经被拉黑，无法重新注册，无法重新提交信息审核
      if (status == partTimerStatus[7]) {
        this.userStatus = "审核不通过";
        this.link = false; // 表示不可以跳转到注册页
        return;
      }
    },
    // 获取审核状态
    async getUserStatus() {
      let success = await CommonModule.getUserStatus(); // 成功获取到审核状态
      if (success) {
        // 根据审核状态给用户提示状态
        this.initUserStatus();
      }
    },

    // 获取实际收入及订单数量
    getActualInCome() {
      let url = "/qd/rest/income/count/finish";
      let data = {
        partTimerId: this.partTimerId
      };
      $api
        .get(url, data)
        .then(res => {
          if (!res || !res.code) {
            Toast("服务器内部错误");
            return;
          }
          if (res.code === 200) {
            this.actualInCome = res.body["totalIncome"]
              ? res.body["totalIncome"] - 0
              : 0;
            this.actualOrderCount = res.body["orderCount"]
              ? res.body["orderCount"] - 0
              : 0;
          } else {
            Toast("服务器内部错误" + res.code);
            return;
          }
        })
        .catch(e => {
          Toast("服务器错误" + JSON.stringify(e));
        });
    },
    // 获取扣费金额
    getDeductInCome() {
      let url = "/qd/rest/income/count/illegalCancel";
      let data = {
        partTimerId: this.partTimerId
      };
      $api
        .get(url, data)
        .then(res => {
          if (res.code == 200) {
            this.deductOrderCount = res["body"]["orderCount"]
              ? res["body"]["orderCount"] - 0
              : 0;
            // this.workingHours = res["body"]["workHours"]
            //   ? res["body"]["workHours"]
            //   : 0;
            this.deductInCome = res["body"]["totalIncome"]
              ? res["body"]["totalIncome"] - 0
              : 0;
          } else {
            Toast("服务器错误" + res.code);
          }
        })
        .catch(e => {
          Toast("服务器错误" + JSON.stringify(e));
        });
    },
    // 获取当前月实际收入和订单数量
    getCurrentMonthActualInCome() {
      let url = "/qd/rest/income/count/finish";
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();

      let data = {
        partTimerId: this.partTimerId,
        startDate: year + "-" + month + "-" + "1",
        endDate: year + "-" + month + "-" + date
      };
      $api
        .get(url, data)
        .then(res => {
          if (!res || !res.code) {
            Toast("服务器内部错误");
            return;
          }
          if (res.code === 200) {
            this.currentMonthActualInCome = res.body["totalIncome"]
              ? res.body["totalIncome"] - 0
              : 0;
            this.currentMonthActualOrderCount = res.body["orderCount"]
              ? res.body["orderCount"] - 0
              : 0;
          } else {
            Toast("服务器内部错误" + res.code);
            return;
          }
        })
        .catch(e => {
          Toast("服务器错误" + JSON.stringify(e));
        });
    },
    // 获取当前月扣费金额和订单数量
    getCurrentMonthDeductInCome() {
      let url = "/qd/rest/income/count/illegalCancel";
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();

      let data = {
        partTimerId: this.partTimerId,
        startDate: year + "-" + month + "-" + "1",
        endDate: year + "-" + month + "-" + date
      };
      $api
        .get(url, data)
        .then(res => {
          if (res.code == 200) {
            this.currentMonthDeductOrderCount = res["body"]["orderCount"]
              ? res["body"]["orderCount"] - 0
              : 0;
            // this.workingHours = res["body"]["workHours"]
            //   ? res["body"]["workHours"]
            //   : 0;
            this.currentMonthDeductInCome = res["body"]["totalIncome"]
              ? res["body"]["totalIncome"] - 0
              : 0;
          } else {
            Toast("服务器错误" + res.code);
          }
        })
        .catch(e => {
          Toast("服务器错误" + JSON.stringify(e));
        });
    },
    // 获取好评率
    getEvaluateRate() {
      let url = "/qd/rest/evaluate/rate";
      let data = {
        userId: this.userId
      };
      $api.get(url, data).then(res => {
        if (!res || !res.code) {
          Toast("服务器内部错误");
          return;
        }
        if (res.code === 200) {
          if (res["body"]) {
            this.rate = (res["body"] * 100).toFixed(1) + "% 好评，继续加油";
          } else {
            this.rate = "";
          }
        } else {
          Toast("服务器内部错误" + res.code);
          return;
        }
      });
    },
    // 获取当前版本号
    getVersion() {
      let thisVersion = api.readFile({
        sync: true,
        path: "widget://resource/version.txt"
      });
      return thisVersion;
    },

    // // 系统版本更新
    checkToUpdate() {
      // 已经提示过，但是取消了，将不再提示
      if (/has_remind_update/.test(document.cookie)) {
        return;
      }
      let _this = this;
      let thisVersion = _this.getVersion();
      window.$api.getVersion().then(res => {
        if (res) {
          // 如果当前版本低于服务器的最低版本 强制更新
          if (CommonModule.cmpVersion(thisVersion, res.minSupport) < 0) {
            MessageBox({
              title: "版本更新",
              message: "版本太低，强烈建议更新",
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonClass: "color-yellow",
              confirmButtonText: "确认",
              closeOnClickModal: false
            }).then(action => {
              if (action == "confirm") {
                update(function() {
                  _this.$router.push("/login");
                });
              }
            });
          } else if (
            CommonModule.cmpVersion(thisVersion, res.latestVersion) < 0
          ) {
            // 如果当前版本低于服务器的最新版本 建议更新
            MessageBox({
              title: "版本更新",
              message: "发现新的版本，请更新",
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonClass: "color-yellow",
              cancelButtonText: "取消",
              confirmButtonText: "确认",
              cancelButtonClass: "color-grey"
            }).then(action => {
              if (action == "confirm") {
                // 执行退出的逻辑
                // 清空所有存储信息
                update();
                _this.$router.push("/login");
              }
            });
          }
          // 如果版本号不一样 标识已经提示过
          // 一天之内不再提示
          if (CommonModule.cmpVersion(thisVersion, res.latestVersion) != 0) {
            let exDate = new Date();
            exDate.setHours(exDate.getHours() + 24);
            document.cookie =
              "has_remind_update=1;expires=" + exDate.toGMTString();
          }
        }
      });
      function update(callback) {
        let platform = api.systemType;
        if (platform == "ios") {
          api.openApp(
            {
              iosUrl:
                "https://itunes.apple.com/us/app/电务通抢单/id1457655603?l=zh&ls=1&mt=8"
            },
            function(ret, err) {
              //coding...
            }
          );
          callback && callback();
        } else if (platform == "android") {
          api.showProgress({
            title: "下载中",
            text: "请稍等...",
            modal: false
          });
          api.download(
            {
              url:
                "http://cdn.dianwutong.com/app/dianwutong_qd/dianwutong_qd.apk",
              cache: false,
              allowResume: true
            },
            function(ret, err) {
              api.hideProgress();
              if (ret.state == 1) {
                //下载成功
                api.installApp({
                  appUri: ret.savePath
                });
                callback && callback();
              } else {
                MessageBox({
                  title: "版本更新",
                  message: "下载失败",
                  showCancelButton: false,
                  showConfirmButton: true,
                  confirmButtonClass: "color-yellow",
                  confirmButtonText: "确认"
                }).then(action => {
                  if (action == "confirm") {
                    callback && callback();
                  }
                });
              }
            }
          );
        }
      }
    },
    // 检查是否更新
    checkHasUpdated() {
      let lastVersion = $api.getStorage("lastVersion");
      let currentVersion = api.readFile({
        sync: true,
        path: "widget://resource/version.txt"
      });
      if (
        lastVersion &&
        CommonModule.cmpVersion(lastVersion, currentVersion) < 0
      ) {
        MessageBox({
          title: "提示",
          message: "版本更新成功，请重新登录",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonClass: "color-yellow",
          confirmButtonText: "确认"
        }).then(action => {
          if (action == "confirm") {
            // 执行退出的逻辑
            // 清空所有存储信息
            $api.clearStorage();
            this.$router.push("/login");
          }
        });
      } else {
        $api.setStorage("lastVersion", currentVersion);
      }
    }
  }
};
</script>
