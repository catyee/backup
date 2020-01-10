<template>
  <div class="pick-order-container">
    <div class="common-header-container">
      <mt-header title="抢单列表"></mt-header>
      <!-- <div class="common-header-height"></div> -->
      <!-- <div class="phone-statusbar-height"></div> -->
    </div>
    <div class="mescroll-box">
      <div class="mescroll" ref="mescroll">
        <div class="common-content-padding pb40 content" id="list">
          <div
            class="common-order-item"
            v-for="(order, index) in orderList"
            :key="index"
            @click="toDetail(order.taskId)"
          >
            <div class="station">
              <p>{{order.stationName}}</p>
              <p class="normal-desc location">
                {{order.distance ? order.distance.toFixed(0): 0}}km
                <img src="@/assets/location.png">
              </p>
            </div>
            <div class="time">
              <div class="left">
                <span class="normal-desc">工作时间:</span>
                <span
                  class="time-content"
                >{{order.startTimeStr?order.startTimeStr.slice(0,5):''}}-{{order.endTimeStr?order.endTimeStr.slice(0,5):''}}</span>
                <span class="normal-desc">({{order.taskDateStr}})</span>
              </div>
            </div>
            <div class="price mt-14">
              <div class="left">
                <span class="normal-desc">订单价格:</span>
                <span class="f48 color-danger bold">{{order.price}}</span>
                <span class="normal-desc">元</span>
              </div>
              <div class="right">
                <div class="btn-operate bg-linear-red f24">可抢单</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "./pick-order.scss";
import { Toast } from "mint-ui";
import MeScroll from "mescroll.js";
import "mescroll.js/mescroll.min.css";
import CommonModule from "@/common/common.js";
export default {
  data() {
    return {
      bmLocation: null,
      mescroll: null,
      longitude: "", // 经度
      dimensions: "", // 纬度
      orderList: [] // 单子列表
    };
  },
  created() {
    this.bmLocation = api.require("bmLocation");
  },
  mounted() {
    this.mescroll = new MeScroll(this.$refs.mescroll, {
      up: {
        auto: true,
        callback: this.upCallback,
        page: {
          num: 0,
          size: 10
        },
        htmlNodata: '<p class="upwarp-nodata">没有数据了</p>',
        noMoreSize: 5,
        empty: {
          warpId: "list", // 父布局的id; 如果此项有值,将不使用clearEmptyId的值;
          tip: "暂无相关数据~", // 提示
          icon: require("@/assets/empty.png") // 无数据时显示图片
        }
      }
    });

    CommonModule.topAdaption(".mint-header");
    // CommonModule.scrollTopAdaption('.mescroll', '.mescroll-box');
    $api.domAll(".mescroll")[0].style.top =
      $api.offset($api.domAll(".mescroll-box")[0]).t + "px";
    CommonModule.scrollBottomAdaption(".mescroll", "footer");
  },
  methods: {
    // 上拉加载函数
    upCallback(page) {
      this.getLocation(page);
    },
    // 跳转到详情页
    toDetail(id) {
      this.$router.push({ path: `/pick-order-detail/${id}` });
    },
    // 获取当前经纬度
    getLocation(page) {
      let _this = this;
      // 判断当前系统是Android ios
      let systemType = api.systemType;

      if (systemType === "ios") {
        // ios获取当前位置经纬度信息
        $api
          .getLocation()
          .then(res => {
            _this.longitude = res.longitude;
            _this.dimensions = res.latitude;
            _this.getOrderList(page);
          })
          .catch(() => {
            Toast("获取位置失败");
            _this.getOrderList(page);
          });
      } else {
        // Android获取当前位置经纬度信息
        // 配置单次定位超时时间
        this.bmLocation.configManager({
          locationTimeout: 2
        });

        this.bmLocation.singleLocation(
          {
            reGeocode: false,
            netWorkState: false
          },
          function(ret) {
            if (ret.status) {
              // 防止在监测到“获取不到位置”之后重新请求到数据导致重复请求列表的情况
              // 10s之后才请求到位置信息会出现请求了两次列表的情况，这里的判断避免这类情况
              if(! _this.longitude || !_this.dimensions){
                page.num = 1;
              }
              _this.longitude = ret.location.longitude;
              _this.dimensions = ret.location.latitude;
              _this.getOrderList(page);
            } else {
              Toast("获取位置失败");
              _this.getOrderList(page);
            }
          }
        );
        if (locationTimer) {
          window.clearTimeout(locationTimer);
        }
        // 如果一直获取不到位置信息（10s之后判断有没有位置信息），提示并且继续请求列表接口
        let locationTimer = window.setTimeout(function() {
          if (!_this.longitude || !_this.dimensions) {
            _this.bmLocation.stopLocation();
            Toast("获取位置失败");
            _this.getOrderList(page);
          }
        }, 10000);
      }
    },
    getOrderList(page) {
      let url = "/qd/rest/task/list/available";
      let data = {
        currentPage: page.num,
        pageSize: page.size,
        longitude: this.longitude, // 经度
        dimensions: this.dimensions // 纬度
      };
      window.$api
        .get(url, data)
        .then(res => {
          if (!res || !res.body || !res.code) {
            this.$nextTick(() => {
              this.mescroll.endSuccess(0);
            });
            Toast("服务器错误");
            return;
          }
          if (page.num === 1) this.orderList = [];
          if (res.code === 200) {
            this.orderList = this.orderList.concat(res.body.records);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              this.mescroll.endSuccess(res.body.records.length);
            });
          } else {
            Toast("服务器错误" + res.code);
            this.mescroll.endErr();
          }
        })
        .catch(e => {
          this.mescroll.endErr();
          Toast("服务器错误");
        });
    }
  }
};
</script>
