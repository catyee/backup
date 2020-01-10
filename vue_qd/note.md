- 全局注入一个插件，从而不需要在每个组件文件中import插件。 在main.js文件中使用**Vue.use()**，例如Vue.use(Router),这样在所有的Vue文件中可以使用路由this.$route。
- 全局注册组件：Vue.component('组件名',引入组件)
- 全局注册过滤器: Vue.filter()
- Vue.config.productionTip = false; 关闭控制台运行在开发环境的提示
- Vue.config是一个对象，包含Vue的全局配置，Vue.config的配置全部在main.js中设置的
```
    new Vue({
        // 将router配置参数注入路由，从而让整个应用都有路由功能
        router,
        // render: function(createElement) {return createElement(App)}; 生成一个以App为标签的vnode节点，返回给mount函数，渲染成真实DOM节点，并挂载到根节点上
        render: h => h(App), 
    }).$mount('#app'); // 挂载到#app元素上


```

- Vue.config.js webpack配置 输出文件地址 公共scss文件引入
