let ajpushModule = {
    init: {},
    bind: {},
    getMessage: {}
}
ajpushModule.init = function () {
    ajpushModule.ajpush = api.require("ajpush");
    ajpushModule.bind();
    ajpushModule.getMessage();
}
ajpushModule.bind = function () {
    api.addEventListener({
        name: 'appintent'
    }, function (ret, err) {
        alert(ret.appParam && ret.appParam.ajpush && ret.appParam.ajpush.content); //监听通知被点击后收到的数据
    })
    api.addEventListener({
        name: 'pause'
    }, function (ret, err) {
        onPause(); //监听应用进入后台，通知jpush暂停事件
    })

    api.addEventListener({
        name: 'resume'
    }, function (ret, err) {
        onResume(); //监听应用恢复到前台，通知jpush恢复事件
    })

    //通知-app恢复
    function onResume() {
        ajpushModule.ajpush.onResume();
        console.log('JPush onResume');
    }

    //通知-app暂停
    function onPause() {
        ajpushModule.ajpush.onPause();
        console.log('JPush onPause');
    }
}
ajpushModule.getMessage = function () {
    var userId = $api.getStorage('userId');
    var partTimerId = $api.getStorage('partTimerId');
    var alias = 'USER_' + userId;
    var tags = ['USER', alias];
    var param = {
        alias: alias,
        tags: tags
    };
    // 绑定用户名和标签，服务端可以指定别名和标签进行消息推送
    ajpushModule.ajpush.bindAliasAndTags(param, function (ret) { });
}

export default ajpushModule;