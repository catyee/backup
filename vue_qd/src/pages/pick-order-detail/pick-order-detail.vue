<template>
  <div class="pick-order-detail-container">
    <div class="common-header-container">
      <mt-header fixed title="订单详情">
        <router-link to="/pick-order" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <div class="common-header-height"></div>
      <!-- <div class="phone-statusbar-height"></div> -->
    </div>
    <div class="height12 bg-grey"></div>
    <!-- content -->
    <div v-if="!showSuccess">
      <div class="detail-content">
        <div class="f34 pb-20">{{orderDetail.groupName?orderDetail.groupName:""}}</div>
        <ul>
          <li>
            <span>订单日期：</span>
            <!-- <span>{{orderDetail.taskDate?orderDetail.taskDate:''}}</span> -->
            <span>{{formatDate(orderDetail, 'taskDate', 'YYYY-MM-DD')}}</span>
          </li>
          <li>
            <span>订单价格：</span>
            <span class="color-danger f34">{{orderDetail.price ? orderDetail.price:''}}元</span>
          </li>
          <li>
            <span>工作时间：</span>
            <span>{{orderDetail.startTimeStr?orderDetail.startTimeStr.slice(0,5):""}}-{{orderDetail.endTimeStr?orderDetail.endTimeStr.slice(0,5):""}}</span>
          </li>
          <li>
            <span>工作类型：</span>
            <span>{{orderDetail.taskTypeId == 1 || orderDetail.taskTypeId == 4?'巡检':"监控"}}</span>
          </li>
          <li>
            <span>工作站名称：</span>
            <span>{{orderDetail.stationName?orderDetail.stationName:""}}</span>
          </li>
          <li>
            <span>工作站地址：</span>
            <span>{{orderDetail.workStationAddress?orderDetail.workStationAddress:""}}</span>
          </li>
          <li>
            <span>工作站电话：</span>
            <a
              :href="'tel:' + orderDetail.workStationTel"
              v-if="orderDetail.workStationTel"
            >{{orderDetail.workStationTel}}</a>
            <span v-if="!orderDetail.workStationTel">无</span>
          </li>
          <li>
            <span>组长：</span>
            <span>{{orderDetail.groupHeadName?orderDetail.groupHeadName.slice(0,1) + '师傅':""}}</span>
          </li>
        </ul>
      </div>
      <div class="height12 bg-grey"></div>
      <div class="tip-content">
        <div class="tip-title">违约提示:</div>
         <div><i>{{orderDetail.startTimeStr? tipDateFormat(orderDetail.taskDateStr + ' ' + orderDetail.startTimeStr, 24) : ""}} </i> 之前取消订单不扣除任何费用。</div>

        <div><i>{{orderDetail.startTimeStr? tipDateFormat(orderDetail.taskDateStr + ' ' + orderDetail.startTimeStr, 24) : ""}} 到 {{orderDetail.startTimeStr? tipDateFormat(orderDetail.taskDateStr + ' ' + orderDetail.startTimeStr, 12) : ""}}</i> 期间取消订单将扣取订单价格的<i>50%</i>，即扣除<i>{{orderDetail.price ? orderDetail.price/2:''}}元</i>;</div>
        <div><i>{{orderDetail.startTimeStr? tipDateFormat(orderDetail.taskDateStr + ' ' + orderDetail.startTimeStr, 12) : ""}} 到 {{orderDetail.startTimeStr? tipDateFormat((orderDetail.taskDateStr + ' ' + orderDetail.startTimeStr.slice(0,5)),0): ""}}</i> 期间取消订单将扣取订单价格的<i>100%</i>，即扣除<i>{{orderDetail.price ? orderDetail.price:''}}元</i>。</div>
        <div>抢单成功后，请按时到指定工作站进行工作。</div>
      </div>
      <div class="height140"></div>
      <div class="pr-40 pl-40">
        <div class="btn-submit bg-linear-red" @click="pickOrder">我要抢单</div>
      </div>
      <div class="height100"></div>
    </div>
    <!-- success content -->
    <div class="wrapper" v-if="showSuccess">
      <div class="height100"></div>
      <div class="height110"></div>
      <div class="icon">
        <img src="@/assets/success.png">
      </div>
      <div class="f34">恭喜您，抢单成功</div>
      <div class="height80"></div>
      <div class="f28">请您到
        <router-link to="/order-manage" class="color-yellow">“订单管理-未完成”</router-link>中查看您的订单
      </div>
    </div>
    <!-- 信息提示框 -->
    <message-box v-show="isMessageBoxShow" :messageBoxProps="messageBoxProps"></message-box>
  </div>
</template>
<script>
import "./pick-order-detail.scss";
import { Toast } from "mint-ui";
import { MessageBox } from "mint-ui";
import CommonModule from "@/common/common.js";
import moment from "moment";
export default {
  data() {
    return {
      taskId: "", // 单子id
      showSuccess: false, // 是否显示成功页面
      orderDetail: {}, // 抢单详情
      messageBoxProps: {
        message: "单子已被抢",
        img: "failure",
        handleBtnName: "确定",
        handleBtnCallBack: this.handleBtnCallBack
      },
      isMessageBoxShow: false
    };
  },
  created() {
    this.taskId = this.$route.params.orderId;
    this.getDetail();
  },
  methods: {
    // 获取抢单任务详情
    getDetail() {
      let url = "/qd/rest/task/detail";
      let data = {
        taskId: this.taskId
      };
      $api
        .get(url, data)
        .then(res => {
          if (!res || !res.body) {
            Toast("服务器错误");
            return;
          }
          if (res.code == 200) {
            this.orderDetail = res.body;
            return;
          }else {
            Toast("服务器错误" + res.code);
          }
        })
        .catch(e => {
          Toast("服务器错误" + JSON.stringify(e));
        });
    },
    // 抢单
    pickOrder() {
      MessageBox({
        title: "提示",
        message:
          "请确保您已认真阅读违约提示，是否确认抢单？",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonClass: "color-yellow",
        cancelButtonText: "再考虑一下",
        confirmButtonText: "确认",
        cancelButtonClass: "color-grey"
      }).then(action => {
        if (action == "cancel") {
        }
        if (action == "confirm") {
          let url = "/qd/rest/task/pick";
          let data = {
            taskId: this.taskId
          };
          $api
            .get(url, data)
            .then(res => {
              if (res.code == 200) {
                this.showSuccess = true;
                return;
              }
              if (res.code == 1001) {
                Toast("抢单失败，" + res.body);
                return;
              }
              Toast("抢单失败，" + res.body);
            })
            .catch(e => {
              Toast(JSON.stringify(e));
            });
        }
      });
    },
    handleBtnCallBack() {
      this.isMessageBoxShow = false;
    },
    // 格式化日期
    formatDate(orderDetail, pro, parttern) {
      if (orderDetail && orderDetail[pro]) {
        return moment(orderDetail[pro]).format(parttern);
      } else {
        return "无";
      }
    },
    // 违约提示时间处理
    tipDateFormat(date, hours) {
      // 返回传入date之前hours小时的时间点
      return moment(+moment(date).subtract(hours, 'hours')).format('MM月DD日 HH:mm');
    },
  },
  mounted() {
    CommonModule.topAdaption(".mint-header");
    $api.dom(".common-header-height").style.height =
      $api.offset($api.dom(".mint-header")).h + "px";
    // 提示框按钮点击事件
    // let btnDoms = document.getElementsByTagName('button');
    // for (let i = 0; i < btnDoms.length; i++) {
    //   if ((' ' + btnDoms[i].className + ' ').indexOf(' mint-msgbox-btn ') > -1) {
    //     let btnColor = window.getComputedStyle(btnDoms[i]).color;
    //     btnDoms[i].onclick = function () {
    //       let _this = this;
    //       this.style.backgroundColor = '#e3e3e3';
    //       this.style.color = btnColor;
    //       setTimeout(function () {
    //         _this.style.backgroundColor = '#fff';
    //       }, 100)
    //    }
    //   }
    // }
  }
};
</script>
