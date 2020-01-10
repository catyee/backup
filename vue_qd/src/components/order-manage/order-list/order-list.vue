<template>
  <div class="order-list-container">
    <div class="common-selectors-wrap">
      <div class="common-selectors">
        <div @click="changeTab(0)" :class="{'common-btn-selected' : tabType == 0}" class="common-btn-primary">全部({{zCount}})</div>
        <div @click="changeTab(1)" :class="{'common-btn-selected' : tabType == 1}" class="common-btn-primary">已取消({{cancelCount}})</div>
        <div @click="changeTab(2)" :class="{'common-btn-selected' : tabType == 2}" class="common-btn-primary">已完成({{completedCount}})</div>
        <div @click="changeTab(3)" :class="{'common-btn-selected' : tabType == 3}" class="common-btn-primary">未完成({{unCompletedCount}})</div>
      </div>
    </div>
      <!-- 全部 -->
      <mescroll-vue ref="mescroll0" v-show="tabType==0" :down="getMescrollDown(0)" :up="getMescrollUp(0)" @init="mescrollInit0">
        <div id="dataList0" class="pr-20 pl-20">
          <router-link tag="div" :to="{path: '/order-detail', query:{orderId: item.order && item.order.orderId, tabType: tabType, type: 'order'}}" class="common-order-item" v-for="(item, index) in tab0.list" :key="index">
            <div class="station">
              <p>{{item.task && item.task.stationName}}</p>
              <!-- <p class="normal-desc location">
                3km
                <img src="@/assets/location.png">
              </p> -->
            </div>
            <div class="time">
              <div class="left">
                <span class="normal-desc">工作时间:</span>
                <span class="time-content">{{item.workTime}}</span>
                <span class="normal-desc">({{item.task && item.task.taskDate | dateFormat('YYYY-MM-DD')}})</span>
              </div>
              <!-- <div :class="item.order && (item.order.orderStatus == 1 || item.order.orderStatus == 2) ? 'cancel-order-color' : (getOrderStatusDes(item.order) === '上班中' ? 'completed-order-color' : 'color-danger')" class="normal-desc">{{item.order && getOrderStatusDes(item.order.orderStatus)}}</div> -->
              <div :class="(item.order && (item.order.orderStatus == 0 || item.order.orderStatus == 6)) ? 'completed-order-color' : ((item.order.orderStatus == 1 || item.order.orderStatus == 2) ? 'cancel-order-color' : '')" class="color-danger">{{item.order && getOrderStatusDes(item.order.orderStatus)}}</div>
            </div>
            <div class="price mt-14">
              <div class="left">
                <span class="normal-desc">订单价格:</span>
                <span :class="(item.order && item.order.orderStatus == 1) ? 'completed-order-color' : (item.order && item.order.orderStatus == 2) ? 'cancel-order-color' : 'color-danger'" class="f48 bold">{{item.task && item.task.price}}</span>
                <span class="normal-desc">元</span>
              </div>
              <div class="right" v-if="item.task && item.order && item.order.endTime && (item.task.isEvaluate == null || item.task.isEvaluate === 0)">
                <router-link tag="div" :to="{path: '/evaluate/' + (item.task && item.task.taskId), query: {name: item.task && item.task.groupHeadName, workTime: item.workTime, tabType: tabType, type: 'order'}}" class="btn-operate bg-linear-yellow">评价</router-link>
              </div>
            </div>
          </router-link>
        </div>
      </mescroll-vue>
      <!-- 已取消 -->
      <mescroll-vue ref="mescroll1" v-show="tabType==1" :down="getMescrollDown(1)" :up="getMescrollUp(1)" @init="mescrollInit1">
        <div id="dataList1" class="pr-20 pl-20">
          <router-link tag="div" :to="{path: '/order-detail', query:{orderId: item.order && item.order.orderId, tabType: tabType, type: 'order'}}" class="common-order-item" v-for="(item, index) in tab1.list" :key="index">
            <div class="station">
              <p>{{item.task && item.task.stationName}}</p>
              <!-- <p class="normal-desc location">
                3km
                <img src="@/assets/location.png">
              </p> -->
            </div>
            <div class="time">
              <div class="left">
                <span class="normal-desc">工作时间:</span>
                <span class="time-content">{{item.workTime}}</span>
                <span class="normal-desc">({{item.task && item.task.taskDate | dateFormat('YYYY-MM-DD')}})</span>
              </div>
              <!-- 订单管理 -->
              <div :class="(item.order && (item.order.orderStatus == 0 || item.order.orderStatus == 6)) ? 'completed-order-color' : ((item.order.orderStatus == 1 || item.order.orderStatus == 2) ? 'cancel-order-color' : '')" class="color-danger">{{item.order && getOrderStatusDes(item.order.orderStatus)}}</div>
            </div>
            <div class="price mt-14">
              <div class="left">
                <span class="normal-desc">订单价格:</span>
                <span :class="(item.order && item.order.orderStatus == 1) ? 'completed-order-color' : (item.order && item.order.orderStatus == 2) ? 'cancel-order-color' : 'color-danger'" class="f48 bold">{{item.task && item.task.price}}</span>
                <span class="normal-desc">元</span>
              </div>
              <!-- <div class="right" v-if="item.task && item.order && item.order.endTime && (item.task.isEvaluate == null || item.task.isEvaluate === 0)">
                <router-link tag="div" :to="{path: '/evaluate/' + (item.task && item.task.taskId), query: {name: item.task && item.task.groupHeadName, workTime: item.workTime, tabType: tabType, type: 'order'}}" class="btn-operate bg-linear-yellow">评价</router-link>
              </div> -->
            </div>
          </router-link>
        </div>
      </mescroll-vue>
      <!-- 已完成（A岗‘确认下班’后，状态变为已完成） -->
      <mescroll-vue ref="mescroll2" v-show="tabType==2" :down="getMescrollDown(2)" :up="getMescrollUp(2)" @init="mescrollInit2">
        <!-- 有数据 -->
        <div id="dataList2" class="pr-20 pl-20">
          <router-link tag="div" :to="{path: '/order-detail', query:{orderId: item.order && item.order.orderId, tabType: tabType, type: 'order'}}" class="common-order-item" v-for="(item, index) in tab2.list" :key="index">
            <div class="station">
              <p>{{item.task && item.task.stationName}}</p>
              <!-- <p class="normal-desc location">
                3km
                <img src="@/assets/location.png">
              </p> -->
            </div>
            <div class="time">
              <div class="left">
                <span class="normal-desc">工作时间:</span>
                <span class="time-content">{{item.workTime}}</span>
                <span class="normal-desc">({{item.task && item.task.taskDate | dateFormat('YYYY-MM-DD')}})</span>
              </div>
              <!-- 订单管理 -->
              <div :class="(item.order && (item.order.orderStatus == 0 || item.order.orderStatus == 6)) ? 'completed-order-color' : ((item.order.orderStatus == 1 || item.order.orderStatus == 2) ? 'cancel-order-color' : '')" class="color-danger">{{item.order && getOrderStatusDes(item.order.orderStatus)}}</div>
            </div>
            <div class="price mt-14">
              <div class="left">
                <span class="normal-desc">订单价格:</span>
                <span :class="(item.order && item.order.orderStatus == 1) ? 'completed-order-color' : (item.order && item.order.orderStatus == 2) ? 'cancel-order-color' : 'color-danger'" class="f48 bold">{{item.task && item.task.price}}</span>
                <span class="normal-desc">元</span>
              </div>
              <div class="right" v-if="item.task && item.order && item.order.endTime && (item.task.isEvaluate == null || item.task.isEvaluate === 0) ">
                <router-link tag="div" :to="{path: '/evaluate/' + (item.task && item.task.taskId), query: {name: item.task && item.task.groupHeadName, workTime: item.workTime, tabType: tabType, type: 'order'}}" class="btn-operate bg-linear-yellow">评价</router-link>
              </div>
            </div>
          </router-link>
        </div>
      </mescroll-vue>
      <!-- 未完成（从抢单到A岗确认下班，之间都时未完成状态） -->
      <mescroll-vue ref="mescroll3" v-show="tabType==3" :down="getMescrollDown(3)" :up="getMescrollUp(3)" @init="mescrollInit3">
        <!-- 有数据 -->
        <div id="dataList3" class="pr-20 pl-20">
          <router-link tag="div" :to="{path: '/order-detail', query:{orderId: item.order && item.order.orderId, tabType: tabType, type: 'order'}}" class="common-order-item" v-for="(item, index) in tab3.list" :key="index">
            <div class="station">
              <p>{{item.task && item.task.stationName}}</p>
              <!-- <p class="normal-desc location">
                3km
                <img src="@/assets/location.png">
              </p> -->
            </div>
            <div class="time">
              <div class="left">
                <span class="normal-desc">工作时间:</span>
                <span class="time-content">{{item.workTime}}</span>
                <span class="normal-desc">({{item.task && item.task.taskDate | dateFormat('YYYY-MM-DD')}})</span>
              </div>
              <!-- 订单管理 -->
              <div :class="(item.order && (item.order.orderStatus == 0 || item.order.orderStatus == 6)) ? 'completed-order-color' : ((item.order.orderStatus == 1 || item.order.orderStatus == 2) ? 'cancel-order-color' : '')" class="color-danger">{{item.order && getOrderStatusDes(item.order.orderStatus)}}</div>
            </div>
            <div class="price mt-14">
              <div class="left">
                <span class="normal-desc">订单价格:</span>
                <span :class="(item.order && item.order.orderStatus == 1) ? 'completed-order-color' : (item.order && item.order.orderStatus == 2) ? 'cancel-order-color' : 'color-danger'" class="f48 bold">{{item.task && item.task.price}}</span>
                <span class="normal-desc">元</span>
              </div>
              <!-- B岗在点击‘下班打卡’后即可填写评价 -->
              <div class="right" v-if="item.task && item.order && item.order.endTime && item.order.orderStatus != 5 && (item.task.isEvaluate == null || item.task.isEvaluate === 0)">
                <router-link tag="div" :to="{path: '/evaluate/' + (item.task && item.task.taskId), query: {name: item.task && item.task.groupHeadName, workTime: item.workTime, tabType: tabType, type: 'order'}}" class="btn-operate bg-linear-yellow">评价</router-link>
              </div>
            </div>
          </router-link>
        </div>
      </mescroll-vue>
      <!-- end -->
  </div>
</template>
<script>
import "./order-list.scss";
import {Toast} from 'mint-ui';
// 引入mescroll的vue组件
import MescrollVue from 'mescroll.js/mescroll.vue';
import CommonModule from "@/common/common.js";
export default {
  components: {
    MescrollVue
  },
  data() {
    return {
      zCount: 0, // '全部'订单数量
      cancelCount: 0, // '取消'订单数量
      completedCount: 0, // '已完成'订单数量
      unCompletedCount: 0, // '未完成'订单数量
      tab0: {mescroll: null, list: [], isListInit: false}, // 全部
      tab1: {mescroll: null, list: [], isListInit: false}, // 已取消
      tab2: {mescroll: null, list: [], isListInit: false}, // 已完成
      tab3: {mescroll: null, list: [], isListInit: false}, // 未完成
      tabType: 3, // 当前选中的类型
    };
  },
  created() {
    if (this.$route.query.tabType) {
      this.tabType = this.$route.query.tabType;
    }
    this.init();
  },
  mounted() {
    // CommonModule.scrollTopAdaption('.mescroll', '.mint-tab-container-item', '.common-selectors-wrap');
    CommonModule.scrollBottomAdaption('.mescroll', 'footer');
  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit0 (mescroll) {
      mescroll.tabType = 0; // 加入标记,便于在回调中取到对应的list
      this.tab0.mescroll = mescroll;
    },
    mescrollInit1 (mescroll) {
      mescroll.tabType = 1;
      this.tab1.mescroll = mescroll;
    },
    mescrollInit2 (mescroll) {
      mescroll.tabType = 2;
      this.tab2.mescroll = mescroll;
    },
    mescrollInit3 (mescroll) {
      mescroll.tabType = 3;
      this.tab3.mescroll = mescroll;
    },
    // 多mescroll的配置,需通过方法获取,保证每个配置是单例
    getMescrollDown (tabType) {
      let isAuto = tabType === 0; // 第一个mescroll传入true,列表自动加载
      return {
        auto: isAuto,
        callback: this.downCallback
      }
    },
    getMescrollUp (tabType) {
      let emptyWarpId = 'dataList' + tabType;
      return {
        auto: true,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
        noMoreSize: 3, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          warpId: emptyWarpId, // 父布局的id;
          tip: '暂无相关数据~', // 提示
          icon: require('@/assets/empty.png'), // 无数据时显示图片
        },
        page: {
          num: 0,
          size: 5,
        },
        htmlNodata: '<p class="upwarp-nodata">暂无更多数据~</p>',
      }
    },
    /* 下拉刷新的回调 */
    downCallback (mescroll) {
      mescroll.resetUpScroll();// 触发下拉刷新的回调,加载第一页的数据
    },
    /* 上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    upCallback (page, mescroll) {
      if (mescroll.tabType === 0) {
        // 全部
        // this.tab0.isListInit = true;// 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(mescroll.tabType, page.num, page.size, (curPageData) => {
          mescroll.endSuccess(curPageData.length);// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          if (page.num === 1) this.tab0.list = []; // 如果是第一页需手动制空列表
          this.tab0.list = this.tab0.list.concat(curPageData); // 追加新数据
        }, () => {
          if (page.num === 1) this.tab0.isListInit = false;
          mescroll.endErr();// 联网失败的回调,隐藏下拉刷新的状态
        })
      } else if (mescroll.tabType === 1) {
        // this.tab1.isListInit = true;// 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(mescroll.tabType, page.num, page.size, (curPageData) => {
          mescroll.endSuccess(curPageData.length);// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          if (page.num === 1) this.tab1.list = []; // 如果是第一页需手动制空列表
          this.tab1.list = this.tab1.list.concat(curPageData); // 追加新数据
        }, () => {
          if (page.num === 1) this.tab1.isListInit = false;
          mescroll.endErr();// 联网失败的回调,隐藏下拉刷新的状态
        })
      } else if (mescroll.tabType === 2) {
        // this.tab2.isListInit = true;// 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(mescroll.tabType, page.num, page.size, (curPageData) => {
          mescroll.endSuccess(curPageData.length);// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          if (page.num === 1) this.tab2.list = []; // 如果是第一页需手动制空列表
          this.tab2.list = this.tab2.list.concat(curPageData); // 追加新数据
        }, () => {
          if (page.num === 1) this.tab2.isListInit = false;
          mescroll.endErr();// 联网失败的回调,隐藏下拉刷新的状态
        })
      } else if (mescroll.tabType === 3) {
        // this.tab3.isListInit = true;// 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(mescroll.tabType, page.num, page.size, (curPageData) => {
          mescroll.endSuccess(curPageData.length);// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          if (page.num === 1) this.tab3.list = []; // 如果是第一页需手动制空列表
          this.tab3.list = this.tab3.list.concat(curPageData); // 追加新数据
        }, () => {
          if (page.num === 1) this.tab3.isListInit = false;
          mescroll.endErr();// 联网失败的回调,隐藏下拉刷新的状态
        })
      }
    },
    // 切换菜单
    changeTab (type) {
      // 获取各类单子数量
      this.getAllCategoryOrderCount();

      let curTab = this.getTabData(this.tabType);// 当前列表
      let newTab = this.getTabData(type);// 新转换的列表
      curTab.mescroll.hideTopBtn(); // 隐藏当前列表的回到顶部按钮
      this.tabType = type // 切换菜单
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
        }, 30)
      }
    },
    // 获取菜单对应的数据
    getTabData (tabType) {
      if (tabType == null) tabType = this.tabType;
      if (tabType === 0) {
        return this.tab0;
      } else if (tabType === 1) {
        return this.tab1;
      } else if (tabType === 2) {
        return this.tab2;
      } else if (tabType === 3) {
        return this.tab3;
      }
    },
    // 联网加载数据
    getListDataFromNet (tabType, pageNum, pageSize, successCallback, errorCallback) {
        // tabType: 0全部，1已取消，2已完成，3未完成
        try {
          let listData = [];
          let data = {
            page: pageNum,
            pageSize: pageSize,
          };
          this.a = pageNum;
          this.b = pageSize;
          if (tabType === 0) {
            let url = '/qd/rest/myOrder/list';

            window/$api.get(url, data).then(res => {
              if (!res || !res.body) {
                Toast('服务器内部错误');
                return;
              }
              if (res.code && res.code == 200) {
                listData = res.body.records;
              }
              // 回调
              successCallback && successCallback(listData);
            })
          } else if (tabType === 1) {
            let url = '/qd/rest/myOrder/cancelList';

            window/$api.get(url, data).then(res => {
              if (!res || !res.body) {
                Toast('服务器内部错误');
                return;
              }
              if (res.code && res.code == 200) {
                listData = res.body.records
              }
              // 回调
              successCallback && successCallback(listData);
            })
          } else if (tabType === 2) {
            let url = '/qd/rest/myOrder/completedList';

            window/$api.get(url, data).then(res => {
              if (!res || !res.body) {
                Toast('服务器内部错误');
                return;
              }
              if (res.code && res.code == 200) {
                listData = res.body.records
              }
              // 回调
              successCallback && successCallback(listData);
            })
          } else if (tabType === 3) {
            let url = '/qd/rest/myOrder/unCompletedList';

            window/$api.get(url, data).then(res => {
              if (!res || !res.body) {
                Toast('服务器内部错误');
                return;
              }
              if (res.code && res.code == 200) {
                listData = res.body.records
              }
              // 回调
              successCallback && successCallback(listData);
            })
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

      let url = '/qd/rest/myOrder/count';

      window/$api.get(url).then(res => {

        if (!res || !res.body) {
          Toast('服务器内部错误');
          return;
        }

        if (res.code && res.code == 200) {
          this.zCount = res.body.zCount;
          this.cancelCount = res.body.cancelCount;
          this.completedCount = res.body.completedCount;
          this.unCompletedCount = res.body.unCompletedCount;
        }

      })

    },

    // 判断单子状态
    getOrderStatusDes(status) {
      switch(status) {
        case 0:
          return '待出发';
        case 1:
          return '已完成';
        case 2:
          return '已取消';
        case 3:
          return '超时取消';
        case 4:
          return '超时取消';
        case 5:
          return '旷工';
        case 6:
          return '上班中';
        case 9:
          return '异常转线下处理';
      }
    },
  },
};
</script>
