<template>
  <div class="page-home-container">
    <div class="main-content">
      <router-view/>
    </div>
      <mt-tabbar id="footer">
        <router-link to="/pick-order" class="tab-item">
          <mt-tab-item id="抢单">
            <img src="@/assets/qiangdan_nor.png" slot="icon" v-if="currentPath!='/pick-order'">
            <img src="@/assets/qiangdan_click.png" slot="icon" v-if="currentPath=='/pick-order'">
            抢单
          </mt-tab-item>
        </router-link>
        <router-link to="/order-manage" class="tab-item">
          <mt-tab-item id="订单管理">
            <img
              src="@/assets/dingdanguanli_nor.png"
              slot="icon"
              v-if="currentPath!='/order-manage'"
            >
            <img
              src="@/assets/dingdanguanli_click.png"
              slot="icon"
              v-if="currentPath=='/order-manage'"
            >
            订单管理
          </mt-tab-item>
        </router-link>
        <router-link to="/user-center" class="tab-item">
          <mt-tab-item id="我的">
            <img src="@/assets/wode_nor.png" slot="icon" v-if="currentPath!='/user-center'">
            <img src="@/assets/wode_click.png" slot="icon" v-if="currentPath=='/user-center'">
            我的
          </mt-tab-item>
        </router-link>
      </mt-tabbar>
  </div>
</template>
<script>
import "./home.scss";
import CommonModule from "@/common/common.js";
export default {
  data() {
    return {
      currentPath: ""
    };
  },
  created() {
    this.currentPath = this.$route.path;
  },
  // 屏幕适配
  mounted() {
    CommonModule.bottomAdaption('footer');
  },
  watch: {
    $route() {
      this.currentPath = this.$route.path;
    }
  }
};
</script>
