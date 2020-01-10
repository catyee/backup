<template>
  <div class="order-manage-container">
    <div class="common-header-container">
      <mt-header title="订单管理"></mt-header>
    </div>
    <!-- 全职显示 我的订单和我的排班 -->
    <div v-if="type == 'full'">
      <mt-navbar ref="orderTab" v-model="selected" fixed>
        <mt-tab-item id="order">我的订单</mt-tab-item>
        <mt-tab-item id="arrange">我的排班</mt-tab-item>
      </mt-navbar>
      <div class="navbar-header"></div>
      <mt-tab-container v-model="selected" :swipeable="true">
        <mt-tab-container-item id="order">
          <keep-alive>
            <order-list/>
          </keep-alive>
        </mt-tab-container-item>
        <mt-tab-container-item id="arrange">
          <keep-alive>
            <arrange-list/>
          </keep-alive>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <!--兼职全显示 我的订单 -->
    <div v-if="type == 'part'">
      <!-- 为了适应mescroll适配 -->
      <div class="mint-tab-container-item"></div>
      <!--  -->
       <order-list/>
    </div>
   
  </div>
</template>
<script>
import "./order-manage.scss";
import OrderList from "@/components/order-manage/order-list";
import ArrangeList from "@/components/order-manage/arrange-list";
import CommonModule from "@/common/common.js";
import {userType} from "@/common/enum.js";
export default {
  components: {
    OrderList,
    ArrangeList
  },
  data() {
    return {
      selected: "order",
      type:'full',
    };
   
  },
  created() {
    if (this.$route.query.type) {
      if (this.$route.query.type === 'order') {
        this.selected = "order";
      } else if (this.$route.query.type === 'arrange') {
        this.selected = "arrange";
      }
    }
    // 获取用户类型是兼职还是全职
   let type = $api.getStorage('userType');
   // 兼职
    if(type == userType[1]){
      this.type = 'part'
    }
    // 全职
     if(type == userType[0]){
      this.type = 'full'
    }

  },
  mounted() { 
    if (this.selected == 'order') {
      CommonModule.scrollTopAdaption(
        ".mescroll",
        ".mint-tab-container-item",
        ".common-selectors-wrap"
      );
    } else if (this.selected == 'arrange') {
      CommonModule.scrollTopAdaption(
        ".mescroll",
        ".mint-tab-container-item",
        ".common-selectors-wrap",
        true,
      );
    }
    
    CommonModule.topAdaption(".mint-header");
  }
};
</script>
