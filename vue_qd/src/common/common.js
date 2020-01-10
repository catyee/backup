import { Toast } from 'mint-ui';
import { partTimerStatus } from './enum';
let CommonModule = {
    getUserStatus: {}, // 获取用户审核状态
    getTokenTime: {}, // 获取token的失效时间
    hasToken: {}, // 判断是否登录（有无存储token）
    toastInstance: null, //toast实例
}

// 抢单列表页都可以查看，判断token失效 如果失效，弹框提示 是否重新登录
// 点击抢单 如果未登录 toast未登录，跳转到登录页； 如果登录过期，toast登录失效，跳转到登录页；如果审核未通过，toast相应提示，跳转到我的页面
// 点击跳转到其他页同

// 获取用户审核状态
CommonModule.getUserStatus = function () {
    let url = "/qd/rest/user/status";
    let data = {
        userId: $api.getStorage("userId")
    };
    return $api.get(url, data).then(res => {
        if (!res || !res.code) {
            api.toast({
                msg: '服务器错误',
            });
            return false;
        }
        if (res.code == 200 && res.body) {
            // 存储partTimerStatus
            $api.setStorage("partTimerStatus", res.body["partTimerStatus"]);
            $api.setStorage("partTimerName", res.body["partTimerName"]);
            $api.setStorage("partTimerId", res.body["partTimerId"]);
            $api.setStorage("remark", res.body["remark"]);
            return true;
        } else {
            api.toast({
                msg: '服务器错误' + res.code,
            });
            return false;
        }
    })

};
// 判断是否登录（有无存储token）
CommonModule.hasToken = function () {
    // 没有存储token
    if (!$api.getStorage('token')) {
        return false;
    }
    return true;
};
// 获取token的失效时间
CommonModule.getTokenTime = function () {
    let url = '/qd/rest/user/token/TimeToLive';

    return $api.get(url).then(res => {
        if (!res || !res.code) {
            api.toast({
                msg: '服务器错误',
            });
            return false;
        }
        if (res.code == 1006) {
            return false;
        }
        if ((res.code == 200) && res.body) {
            let time = res['body']['time']; // token失效的时间
            // 已经失效
            if (time <= 0) {
                return false;
            } else {
                // 未失效
                return true;
            }
        } else {
            api.toast({
                msg: '服务器错误' + res.code,
            });
            return false;
        }
    }).catch(e => {
        api.toast({
            msg: '服务器错误' + JSON.stringify(e),
        });
        return false;
    })
}

// 路由守卫执行函数
CommonModule.judgeAuthority = async function () {
    // 判断是否登录
    let token = CommonModule.hasToken();
    if (CommonModule.toastInstance) {
        CommonModule.toastInstance.close();
    }
    // 如果没有登录
    if (!token) {
        CommonModule.toastInstance = Toast('您还没有登录！');
        return Promise.resolve(false);
    }
    let tokenValid = await CommonModule.getTokenTime();
    // token失效
    if (!tokenValid) {
        CommonModule.toastInstance = Toast('登录已经过期，请重新登录！');
        return Promise.resolve(false);
    }
    let verified = await CommonModule.getUserStatus();
    let status = $api.getStorage('partTimerStatus');
    if (!verified) {
        return Promise.resolve(false);
    }
    // 还没有审核通过
    if (status != partTimerStatus[0] && status != partTimerStatus[5]) {
        CommonModule.toastInstance = Toast('信息还未审核通过');
        return Promise.resolve(false);
    }

    // 未完善信息
    if (status == partTimerStatus[5]) {
        CommonModule.toastInstance = Toast('请先完善信息');
        return Promise.resolve(false);
    }
    return Promise.resolve(true);

}

// 手机屏幕顶部自适应（刘海屏）
CommonModule.topAdaption = function (headerClass) {
    // $api.fixStatusBar($api.byId(el));
    $api.fixStatusBar($api.domAll(headerClass)[0]);
};
// 手机屏幕底部自适应（iPhoneX虚拟home键）
CommonModule.bottomAdaption = function (el) {
    $api.fixTabBar($api.byId(el));
};
/**
 * 滑动列表top值自适应
 * top = tab选项卡容器与页面顶部的距离 + tab选项卡容器内部固定在顶部的内容的高度
 * scrollContainerClass : 滑动列表区域容器的class名
 * tabContainerClass : tab选项卡每个选项对应内容容器的class名
 * tabInnerFixedClass : tab的每个选项中若存在固定定位在滑动列表区域顶部的元素的class名
 * 
 * 注：此方法只适用于滑动列表单独作为一个子组件的情况，由于是子组件的mounted钩子完成后才触发父组件的mounted，所以需要将safeAreaTop值加到top上，当滑动列表和header标题同属一个组件时，不需要添加safeAreaTop值
*/
CommonModule.scrollTopAdaption = function (scrollContainerClass, tabContainerClass, tabInnerFixedClass, num) {
    // 获取所有的.mescroll元素
    let mescrollList = $api.domAll(scrollContainerClass);
    // 遍历所有的mescroll元素，改变每一个的top值
    for (let i = 0; i < mescrollList.length; i++) {
        if (tabInnerFixedClass) {
            if (num) {
                mescrollList[i].style.top = $api.offset($api.domAll(tabContainerClass)[1]).t + $api.offset($api.domAll(tabInnerFixedClass)[1]).h + $api.fixStatusBar() + 'px';
            } else {
                mescrollList[i].style.top = $api.offset($api.domAll(tabContainerClass)[0]).t + $api.offset($api.domAll(tabInnerFixedClass)[0]).h + $api.fixStatusBar() + 'px';
            }
        } else {
            mescrollList[i].style.top = $api.offset($api.domAll(tabContainerClass)[0]).t + $api.fixStatusBar() + 'px';
        }
    }
};
/**
 * 滑动列表bottom值自适应
 * bottom = 固定在页面底部的元素的高度
 * scrollContainerClass : 滑动列表区域容器的class名
 * bottomFixedId : 固定在底部的dom的id
*/
CommonModule.scrollBottomAdaption = function (scrollContainerClass, bottomFixedId) {
    // 获取所有的.mescroll元素
    let mescrollList = $api.domAll(scrollContainerClass);
    // 遍历所有的mescroll元素，改变每一个的top值
    for (let i = 0; i < mescrollList.length; i++) {
        mescrollList[i].style.bottom = $api.offset($api.byId(bottomFixedId)).h + 'px';
    }
};

// 比较版本号
CommonModule.cmpVersion = function (thisVersion, otherVersion) {
    var _this = thisVersion.split('.');
    var _other = otherVersion.split('.');
    for (var i = 0; i < 3; i++) {
        var _t = parseInt(_this[i]);
        var _o = parseInt(_other[i]);
        if (_t > _o) {
            return 1;
        } else if (_t < _o) {
            return -1;
        }
    }
    return 0;
}


export default CommonModule;