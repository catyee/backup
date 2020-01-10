import Vue from 'vue'
import FastClick from "fastclick";
import VueRouter from "vue-router";
import App from './App.vue'
import router from "./router";
import Mint from "mint-ui";
import "@/styles/_reset.scss";
import "@/styles/common.scss";
import "mint-ui/lib/style.css";
import Moment from "moment";
import MessageBox from '@/components/common/message-box';
import EmptyTips from '@/components/common/empty-tips';
import ajpushModule from '@/common/ajpush.js';
import '@/common/api.js'

Vue.use(VueRouter);
Vue.use(Mint);
FastClick.attach(document.body);
Vue.config.productionTip = false;
// 全局注册组件
// alert弹框组件
Vue.component('message-box', MessageBox);
// 无数据，提示组件
Vue.component('empty-tips', EmptyTips);

// 全局注册格式化日期过滤器
Vue.filter('dateFormat', function (dateStr, parttern = "YYYY-MM-DD hh:mm:ss") {
  return Moment(dateStr).format(parttern);
})


window.apiready = function () {
  // app消息推送
  ajpushModule.init();

  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app');
}

