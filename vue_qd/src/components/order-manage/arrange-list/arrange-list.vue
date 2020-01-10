<template>
  <div class="arrange-list-container">
    <div class="common-selectors-wrap">
      <div class="common-selectors">
        <div
          @click="changeTab(4)"
          :class="{'common-btn-selected' : tabType2 == 4}"
          class="common-btn-primary"
        >全部({{tCount}})</div>
        <div
          @click="changeTab(5)"
          :class="{'common-btn-selected' : tabType2 == 5}"
          class="common-btn-primary"
        >未抢单({{weiQiangDan}})</div>
        <div
          @click="changeTab(7)"
          :class="{'common-btn-selected' : tabType2 == 7}"
          class="common-btn-primary"
        >待确认({{daiQueRen}})</div>
        <div
          @click="changeTab(6)"
          :class="{'common-btn-selected' : tabType2 == 6}"
          class="common-btn-primary"
        >待评价({{daiPingJia}})</div>
      </div>
    </div>
    <!-- 全部 -->
    <mescroll-vue
      ref="mescroll4"
      v-show="tabType2==4"
      :down="getMescrollDown(4)"
      :up="getMescrollUp(4)"
      @init="mescrollInit4"
    >
      <div id="dataList4" class="pr-20 pl-20">
        <router-link
          tag="div"
          :to="{path: '/arrange-detail', query:{taskId: item.task && item.task.taskId, tabType2: tabType2, type: 'arrange'}}"
          class="common-order-item"
          v-for="(item, index) in tab4.list"
          :key="index"
        >
          <div class="station">
            <p>{{item.task && item.task.stationName}}</p>
            <!-- <p class="normal-desc location">
                3km
                <img src="@/assets/location.png">
            </p>-->
          </div>
          <div class="time">
            <div class="left">
              <span class="normal-desc">工作时间:</span>
              <span class="time-content">{{item.workTime}}</span>
              <span
                class="normal-desc"
              >({{item.task && item.task.taskDate | dateFormat('YYYY-MM-DD')}})</span>
            </div>
            <div
              :class="item.task && (item.task.taskStatus == 0 || item.task.taskStatus == 2) ? 'color-danger' : 'cancel-order-color'"
              class="normal-desc"
            >{{item.task && getTaskStatusDes(item.task.taskStatus)}}</div>
          </div>
          <div class="price mt-14">
            <div class="left">
              <span class="normal-desc">订单价格:</span>
              <span
                :class="(item.task && item.task.taskStatus == 1) ? 'completed-order-color' : 'color-danger'"
                class="f48 bold"
              >{{item.task && item.task.price}}</span>
              <span class="normal-desc">元</span>
            </div>
          </div>
          <div class="partner mt-14">
            <div class="left">
              <span class="normal-desc">B岗:</span>
              <span class="f24 color-black">{{item.partTimerName ? item.partTimerName : '无'}}</span>
            </div>
            <div
              class="right"
              v-if="item.task && item.task.taskStatus == 1 && (item.task.isEvaluate == null || item.task.isEvaluate === 1)"
            >
              <router-link
                tag="div"
                :to="{path: '/evaluate/' + (item.task && item.task.taskId), query: {name: item.partTimerName, workTime: item.workTime, tabType2: tabType2, type: 'arrange'}}"
                class="btn-operate bg-linear-yellow"
              >评价</router-link>
            </div>
          </div>
        </router-link>
      </div>
    </mescroll-vue>
    <!-- 未抢单 -->
    <mescroll-vue
      ref="mescroll5"
      v-show="tabType2==5"
      :down="getMescrollDown(5)"
      :up="getMescrollUp(5)"
      @init="mescrollInit5"
    >
      <div id="dataList5" class="pr-20 pl-20">
        <router-link
          tag="div"
          :to="{path: '/arrange-detail', query:{taskId: item.task && item.task.taskId, tabType2: tabType2, type: 'arrange'}}"
          class="common-order-item"
          v-for="(item, index) in tab5.list"
          :key="index"
        >
          <div class="station">
            <p>{{item.task && item.task.stationName}}</p>
            <!-- <p class="normal-desc location">
                3km
                <img src="@/assets/location.png">
            </p>-->
          </div>
          <div class="time">
            <div class="left">
              <span class="normal-desc">工作时间:</span>
              <span class="time-content">{{item.workTime}}</span>
              <span
                class="normal-desc"
              >({{item.task && item.task.taskDate | dateFormat('YYYY-MM-DD')}})</span>
            </div>
            <div
              :class="item.task && (item.task.taskStatus == 0 || item.task.taskStatus == 2) ? 'color-danger' : 'cancel-order-color'"
              class="normal-desc"
            >{{item.task && getTaskStatusDes(item.task.taskStatus)}}</div>
          </div>
          <div class="price mt-14">
            <div class="left">
              <span class="normal-desc">订单价格:</span>
              <span
                :class="(item.task && item.task.taskStatus == 1) ? 'completed-order-color' : 'color-danger'"
                class="f48 bold"
              >{{item.task && item.task.price}}</span>
              <span class="normal-desc">元</span>
            </div>
          </div>
          <div class="partner mt-14">
            <div class="left">
              <span class="normal-desc">B岗:</span>
              <span class="f24 color-black">{{item.partTimerName ? item.partTimerName : '无'}}</span>
            </div>
            <!-- <div class="right" v-if="item.task && item.task.taskStatus == 1 && (item.task.isEvaluate == null || item.task.isEvaluate === 1)">
                <router-link tag="div" :to="{path: '/evaluate/' + (item.task && item.task.taskId), query: {name: item.partTimerName, workTime: item.workTime, tabType2: tabType2, type: 'arrange'}}" class="btn-operate bg-linear-yellow">评价</router-link>
            </div>-->
          </div>
        </router-link>
      </div>
    </mescroll-vue>
    <!-- 待评价 -->
    <mescroll-vue
      ref="mescroll6"
      v-show="tabType2==6"
      :down="getMescrollDown(6)"
      :up="getMescrollUp(6)"
      @init="mescrollInit6"
    >
      <div id="dataList6" class="pr-20 pl-20">
        <router-link
          tag="div"
          :to="{path: '/arrange-detail', query:{taskId: item.task && item.task.taskId, tabType2: tabType2, type: 'arrange'}}"
          class="common-order-item"
          v-for="(item, index) in tab6.list"
          :key="index"
        >
          <div class="station">
            <p>{{item.task && item.task.stationName}}</p>
            <!-- <p class="normal-desc location">
                3km
                <img src="@/assets/location.png">
            </p>-->
          </div>
          <div class="time">
            <div class="left">
              <span class="normal-desc">工作时间:</span>
              <span class="time-content">{{item.workTime}}</span>
              <span
                class="normal-desc"
              >({{item.task && item.task.taskDate | dateFormat('YYYY-MM-DD')}})</span>
            </div>
            <div
              :class="item.task && (item.task.taskStatus == 0 || item.task.taskStatus == 2) ? 'color-danger' : 'cancel-order-color'"
              class="normal-desc"
            >{{item.task && getTaskStatusDes(item.task.taskStatus)}}</div>
          </div>
          <div class="price mt-14">
            <div class="left">
              <span class="normal-desc">订单价格:</span>
              <span
                :class="(item.task && item.task.taskStatus == 1) ? 'completed-order-color' : 'color-danger'"
                class="f48 bold"
              >{{item.task && item.task.price}}</span>
              <span class="normal-desc">元</span>
            </div>
          </div>
          <div class="partner mt-14">
            <div class="left">
              <span class="normal-desc">B岗:</span>
              <span class="f24 color-black">{{item.partTimerName ? item.partTimerName : '无'}}</span>
            </div>
            <div
              class="right"
              v-if="item.task && item.task.taskStatus == 1 && (item.task.isEvaluate == null || item.task.isEvaluate === 1)"
            >
              <router-link
                tag="div"
                :to="{path: '/evaluate/' + (item.task && item.task.taskId), query: {name: item.partTimerName, workTime: item.workTime, tabType2: tabType2, type: 'arrange'}}"
                class="btn-operate bg-linear-yellow"
              >评价</router-link>
            </div>
          </div>
        </router-link>
      </div>
    </mescroll-vue>
    <!-- 待确认 -->
    <mescroll-vue
      ref="mescroll7"
      v-show="tabType2==7"
      :down="getMescrollDown(7)"
      :up="getMescrollUp(7)"
      @init="mescrollInit7"
    >
      <div id="dataList7" class="pr-20 pl-20">
        <router-link
          tag="div"
          :to="{path: '/arrange-detail', query:{taskId: item.task && item.task.taskId, tabType2: tabType2, type: 'arrange'}}"
          class="common-order-item"
          v-for="(item, index) in tab7.list"
          :key="index"
        >
          <div class="station">
            <p>{{item.task && item.task.stationName}}</p>
            <!-- <p class="normal-desc location">
                3km
                <img src="@/assets/location.png">
            </p>-->
          </div>
          <div class="time">
            <div class="left">
              <span class="normal-desc">工作时间:</span>
              <span class="time-content">{{item.workTime}}</span>
              <span
                class="normal-desc"
              >({{item.task && item.task.taskDate | dateFormat('YYYY-MM-DD')}})</span>
            </div>
            <div
              :class="item.task && (item.task.taskStatus == 0 || item.task.taskStatus == 2) ? 'color-danger' : 'cancel-order-color'"
              class="normal-desc"
            >{{item.task && getTaskStatusDes(item.task.taskStatus)}}</div>
          </div>
          <div class="price mt-14">
            <div class="left">
              <span class="normal-desc">订单价格:</span>
              <span
                :class="(item.task && item.task.taskStatus == 1) ? 'completed-order-color' : 'color-danger'"
                class="f48 bold"
              >{{item.task && item.task.price}}</span>
              <span class="normal-desc">元</span>
            </div>
          </div>
          <div class="partner mt-14">
            <div class="left">
              <span class="normal-desc">B岗:</span>
              <span class="f24 color-black">{{item.partTimerName ? item.partTimerName : '无'}}</span>
            </div>
            <!-- <div class="right" v-if="item.task && item.task.taskStatus == 1 && (item.task.isEvaluate == null || item.task.isEvaluate === 1)">
                <router-link tag="div" :to="{path: '/evaluate/' + (item.task && item.task.taskId), query: {name: item.partTimerName, workTime: item.workTime, tabType2: tabType2, type: 'arrange'}}" class="btn-operate bg-linear-yellow">评价</router-link>
            </div>-->
          </div>
        </router-link>
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
import "./arrange-list.scss";
import { Toast } from "mint-ui";
// 引入mescroll的vue组件
import MescrollVue from "mescroll.js/mescroll.vue";
import CommonModule from "@/common/common.js";
export default {
  components: {
    MescrollVue
  },
  data() {
    return {
      tCount: 0, // '全部'数量
      daiPingJia: 0, // '待评价'数量
      daiQueRen: 0, // '待确认'数量
      weiQiangDan: 0, // '未抢单'数量
      tab4: { mescroll: null, list: [], isListInit: false }, // 全部
      tab5: { mescroll: null, list: [], isListInit: false }, // 未抢单
      tab6: { mescroll: null, list: [], isListInit: false }, // 待评价
      tab7: { mescroll: null, list: [], isListInit: false }, // 待确认
      // tabtype2需要与‘我的订单’中的tabtype名字区分
      tabType2: 4 // 当前选中的类型
    };
  },
  created() {
    if (this.$route.query.tabType2) {
      this.tabType2 = this.$route.query.tabType2;
    }
    this.init();
  },
  mounted() {
    // CommonModule.scrollTopAdaption('.mescroll', '.mint-tab-container-item', '.common-selectors-wrap');
    CommonModule.scrollBottomAdaption(".mescroll", "footer");
  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit4(mescroll) {
      mescroll.tabType2 = 4; // 加入标记,便于在回调中取到对应的list
      this.tab4.mescroll = mescroll;
    },
    mescrollInit5(mescroll) {
      mescroll.tabType2 = 5;
      this.tab5.mescroll = mescroll;
    },
    mescrollInit6(mescroll) {
      mescroll.tabType2 = 6;
      this.tab6.mescroll = mescroll;
    },
    mescrollInit7(mescroll) {
      mescroll.tabType2 = 7;
      this.tab7.mescroll = mescroll;
    },
    // 多mescroll的配置,需通过方法获取,保证每个配置是单例
    getMescrollDown(tabType2) {
      let isAuto = tabType2 === 4; // 第一个mescroll传入true,列表自动加载
      return {
        auto: isAuto,
        callback: this.downCallback
      };
    },
    getMescrollUp(tabType2) {
      let emptyWarpId = "dataList" + tabType2;
      return {
        auto: true,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
        noMoreSize: 3, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          warpId: emptyWarpId, // 父布局的id;
          tip: "暂无相关数据~", // 提示
          icon: require("@/assets/empty.png") // 无数据时显示图片
        },
        page: {
          num: 0,
          size: 5
        },
        htmlNodata: '<p class="upwarp-nodata">暂无更多数据~</p>'
      };
    },
    /* 下拉刷新的回调 */
    downCallback(mescroll) {
      mescroll.resetUpScroll(); // 触发下拉刷新的回调,加载第一页的数据
    },
    /* 上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    upCallback(page, mescroll) {
      if (mescroll.tabType2 === 4) {
        // 全部
        // this.tab4.isListInit = true;// 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(
          mescroll.tabType2,
          page.num,
          page.size,
          curPageData => {
            mescroll.endSuccess(curPageData.length); // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            if (page.num === 1) this.tab4.list = []; // 如果是第一页需手动制空列表
            this.tab4.list = this.tab4.list.concat(curPageData); // 追加新数据
          },
          () => {
            if (page.num === 1) this.tab4.isListInit = false;
            mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
          }
        );
      } else if (mescroll.tabType2 === 5) {
        // 未抢单
        // this.tab5.isListInit = true;// 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(
          mescroll.tabType2,
          page.num,
          page.size,
          curPageData => {
            mescroll.endSuccess(curPageData.length); // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            if (page.num === 1) this.tab5.list = []; // 如果是第一页需手动制空列表
            this.tab5.list = this.tab5.list.concat(curPageData); // 追加新数据
          },
          () => {
            if (page.num === 1) this.tab5.isListInit = false;
            mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
          }
        );
      } else if (mescroll.tabType2 === 6) {
        // 待评价
        // this.tab6.isListInit = true;// 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(
          mescroll.tabType2,
          page.num,
          page.size,
          curPageData => {
            mescroll.endSuccess(curPageData.length); // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            if (page.num === 1) this.tab6.list = []; // 如果是第一页需手动制空列表
            this.tab6.list = this.tab6.list.concat(curPageData); // 追加新数据
          },
          () => {
            if (page.num === 1) this.tab6.isListInit = false;
            mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
          }
        );
      } else if (mescroll.tabType2 === 7) {
        // 待确认
        // this.tab7.isListInit = true;// 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(
          mescroll.tabType2,
          page.num,
          page.size,
          curPageData => {
            mescroll.endSuccess(curPageData.length); // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            if (page.num === 1) this.tab7.list = []; // 如果是第一页需手动制空列表
            this.tab7.list = this.tab7.list.concat(curPageData); // 追加新数据
          },
          () => {
            if (page.num === 1) this.tab7.isListInit = false;
            mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
          }
        );
      }
    },
    // 切换菜单
    changeTab(type) {
      let curTab = this.getTabData(this.tabType2); // 当前列表
      let newTab = this.getTabData(type); // 新转换的列表
      curTab.mescroll.hideTopBtn(); // 隐藏当前列表的回到顶部按钮
      this.tabType2 = type; // 切换菜单
      if (!newTab.isListInit) {
        newTab.mescroll.triggerDownScroll(); // 加载列表
      } else {
        setTimeout(() => {
          // 检查新转换的列表是否需要显示回到到顶按钮
          var curScrollTop = newTab.mescroll.getScrollTop();
          if (curScrollTop >= newTab.mescroll.optUp.toTop.offset) {
            newTab.mescroll.showTopBtn();
          } else {
            newTab.mescroll.hideTopBtn();
          }
        }, 30);
      }
    },
    // 获取菜单对应的数据
    getTabData(tabType2) {
      if (tabType2 == null) tabType2 = this.tabType2;
      if (tabType2 === 4) {
        return this.tab4;
      } else if (tabType2 === 5) {
        return this.tab5;
      } else if (tabType2 === 6) {
        return this.tab6;
      } else if (tabType2 === 7) {
        return this.tab7;
      }
    },

    getListDataFromNet(
      tabType2,
      pageNum,
      pageSize,
      successCallback,
      errorCallback
    ) {
      // tabType2: 4全部，5已取消，6已完成，7未完成
      try {
        let listData = [];
        let data = {
          page: pageNum,
          pageSize: pageSize
        };
        if (tabType2 === 4) {
          let url = "/qd/rest/myOrder/myList";

          window /
            $api.get(url, data).then(res => {
              if (!res || !res.body) {
                Toast("服务器内部错误");
                return;
              }
              if (res.code && res.code == 200) {
                listData = res.body.records;
              }
              // 回调
              successCallback && successCallback(listData);
            });
        } else if (tabType2 === 5) {
          let url = "/qd/rest/myOrder/myUnList";

          window /
            $api.get(url, data).then(res => {
              if (!res || !res.body) {
                Toast("服务器内部错误");
                return;
              }
              if (res.code && res.code == 200) {
                listData = res.body.records;
              }
              // 回调
              successCallback && successCallback(listData);
            });
        } else if (tabType2 === 6) {
          let url = "/qd/rest/myOrder/myPingJiaList";

          window /
            $api.get(url, data).then(res => {
              if (!res || !res.body) {
                Toast("服务器内部错误");
                return;
              }
              if (res.code && res.code == 200) {
                listData = res.body.records;
              }
              // 回调
              successCallback && successCallback(listData);
            });
        } else if (tabType2 === 7) {
          let url = "/qd/rest/myOrder/myQueRenList";

          window /
            $api.get(url, data).then(res => {
              if (!res || !res.body) {
                Toast("服务器内部错误");
                return;
              }
              if (res.code && res.code == 200) {
                listData = res.body.records;
              }
              // 回调
              successCallback && successCallback(listData);
            });
        }
      } catch (e) {
        // 联网失败的回调
        errorCallback && errorCallback();
      }
    },

    // 组件首次渲染调用的函数
    init() {
      this.getAllCategoryOrderCount();
    },

    // 获取所有类型单子的数量
    getAllCategoryOrderCount() {
      let url = "/qd/rest/myOrder/myCount";

      window /
        $api.get(url).then(res => {
          if (!res || !res.body) {
            Toast("服务器内部错误");
            return;
          }

          if (res.code && res.code == 200) {
            this.tCount = res.body.tCount;
            this.daiPingJia = res.body.daiPingJia;
            this.daiQueRen = res.body.daiQueRen;
            this.weiQiangDan = res.body.weiQiangDan;
          }
        });
    },

    // 判断单子状态
    getTaskStatusDes(status) {
      switch (status) {
        case 0:
          return "未抢单";
        case 1:
          return "已完成";
        case 2:
          return "待确认"; // 2：正在进行
        case 3:
          return "超时未处理";
        case 4:
          return "待安排";
      }
    }
  }
};
</script>
