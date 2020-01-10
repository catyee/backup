<template>
<div class="income-detail-container">
    <!-- 头部标题 -->
    <div class="common-header-container">
      <mt-header title="收入明细">
            <router-link to="/user-center" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
      </mt-header>
    </div>
    <mt-navbar v-model="selected">
        <mt-tab-item id="actual-income">实际收入</mt-tab-item>
        <mt-tab-item id="deduct-expense">扣费金额</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected" :swipeable="true" class="main-content">
        <mt-tab-container-item id="actual-income">
            <actual-tab />
        </mt-tab-container-item>
        <mt-tab-container-item id="deduct-expense">
             <deduct-tab />
        </mt-tab-container-item>
    </mt-tab-container>
</div>
</template>
<script>
import ActualTab from "@/components/income-detail/actual-tab";
import DeductTab from "@/components/income-detail/deduct-tab";
import './income-detail.scss';
import CommonModule from "@/common/common.js";
export default {
    components: {
        'actual-tab': ActualTab,
        'deduct-tab': DeductTab,
    },
    data() {
        return {
            selected: 'actual-income'
        };
    },
    mounted() {
        CommonModule.topAdaption('.mint-header');
    },
};
</script>