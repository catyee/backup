<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app",
  // 屏幕适配
  mounted() {
    // 顶部
    // CommonModule.topAdaption('.common-header-container');
    // 底部适配在home组件中
  }
};
</script>

<style lang="scss">
html,
body {
  background-color: #f8f8f8;
  // 方便计算rem做的字体,应该根据屏幕dpr和宽度动态调整
  font-size: 100px !important;
  height: 100%;
}

#app {
  // 设计稿基础字体
  font-family: PingFang-SC-Medium;
  height: 100%;
  font-size: 14px;
  box-sizing: border-box;
}
@media screen and (max-width: 375px) {
  #app {
    font-size: 14px;
  }
}

@media screen and (min-width: 376px) and (max-width: 414px) {
  #app {
    font-size: 16px;
  }
}
</style>
