<template>
  <div class="income-tab-container">
    <mescroll-vue
      ref="mescroll0"
      :up="getMescrollUp()"
      :down="getMescrollDown()"
      @init="mescrollInit"
    >
      <div id="actual-list">
        <!-- 头部数据统计面版 -->
        <div class="wrapper">
          <div class="count">
            <div>
              <div>实际收入 (元)</div>
              <p>{{actualIncome}}</p>
            </div>
            <div>
              <div>订单数量 (单)</div>
              <p>{{orderNum}}</p>
            </div>
            <div>
              <div>工时 (小时)</div>
              <p>{{workingHours}}</p>
            </div>
          </div>
        </div>
        <!-- 列表 -->
        <div class="orders">
          <ul>
            <li v-for="(item, index) in orderList" :key="index">
              <div class="order-title">
                <div>{{item.stationName}}</div>
                <div class="order-status income-status">已完成</div>
              </div>
              <div class="work-time">
               <span>工作时间:</span>
                <div>{{item.startTimeStr?item.startTimeStr.slice(0,5):''}}-{{item.endTimeStr?item.endTimeStr.slice(0,5):""}}</div>
                <span>({{item.taskDateStr}})</span>
              </div>
              <div class="order-content">
                <div class="order-time">
                  <div>
                    订单创建时间:
                    <i>{{item.createTimeStr?item.createTimeStr.slice(0,16):''}}</i>
                  </div>
                  <div>
                    订单完成时间:
                    <i>{{item.offWorkTimeStr?item.offWorkTimeStr.slice(0,16):''}}</i>
                  </div>
                </div>
                <div class="money order-money">
                  +{{item.price}}
                  <span>元</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
import "../actual-tab.scss";
import { Toast } from "mint-ui";
import MescrollVue from "mescroll.js/mescroll.vue";
import CommonModule from "@/common/common.js";
export default {
  components: {
    MescrollVue
  },
  data() {
    return {
      mescroll: null,
      orderList: [],
      actualIncome: 0,
      orderNum: 0,
      workingHours: 0,
      partTimerId: $api.getStorage("partTimerId"),
    };
  },
  mounted() {
    CommonModule.scrollTopAdaption('.mescroll', '.mint-tab-container-item');
  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },

    getMescrollDown(tabType) {
      return {
        auto: true,
        callback: this.downCallback
      };
    },
    getMescrollUp(tabType) {
      return {
        auto: false,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
        noMoreSize: 4, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          warpId: "actual-list", // 父布局的id;
          icon: require('@/assets/empty.png'), // 图标,默认null
          tip: "暂无相关数据~" // 提示
        }
      };
    },
    /* 下拉刷新的回调 */
    downCallback(mescroll) {
      let url = "/qd/rest/income/count/finish";
      let data = {
        partTimerId: this.partTimerId
      };
      $api
        .get(url, data)
        .then(res => {
          if (res.code == 200) {
            this.orderNum = res["body"]["orderCount"]
              ? res["body"]["orderCount"]
              : 0;
            this.workingHours = res["body"]["workHours"]
              ? res["body"]["workHours"]
              : 0;
            this.actualIncome = res["body"]["totalIncome"]
              ? res["body"]["totalIncome"]
              : 0;
          } else {
            Toast("服务器错误" + res.code);
          }
        })
        .catch(e => {
          Toast("服务器错误" + JSON.stringify(e));
        });
      mescroll.resetUpScroll(); // 触发下拉刷新的回调,加载第一页的数据
    },

    // 上拉加载的回调
    upCallback(page, mescroll) {
      this.getCompleteList(mescroll, page.num, page.size);
    },
    // 获取实际收入列表
    getCompleteList(mescroll, currentPage, pageSize) {
      let url = "/qd/rest/income/list/finish";
      let data = {
        currentPage: currentPage,
        pageSize: pageSize,
        partTimerId: this.partTimerId
      };
      $api
        .get(url, data)
        .then(res => {
          if (currentPage === 1) this.orderList = [];
          if (!res || !res.body || !res.code) {
            mescroll.endErr();
            Toast("服务器错误");
            return;
          }
          if (res.code == 200) {
            // 数据渲染成功后,隐藏下拉刷新的状态
            mescroll.endSuccess(res.body.records.length);

            this.orderList = this.orderList.concat(res.body.records);
          } else {
            mescroll.endErr();
          }
        })
        .catch(e => {
          mescroll.endErr();
          Toast("服务器错误" + JSON.stringify(e));
          return;
        });
    }
  }
};
</script>