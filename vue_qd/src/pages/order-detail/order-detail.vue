<template>
<div class="order-detail-container">
    <div class="common-header-container">
        <mt-header fixed title="订单详情">
            <router-link :to="{path: '/order-manage', query: {type: 'order', tabType: tabType}}" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="common-header-height"></div>
    </div>
    <!-- 单子主体内容 -->
    <div class="order-content">
        <!-- 组名 -->
        <div class="order-title  mt-13">
            <div class="group-name">{{orderDetail.task && orderDetail.task.groupName}}</div>
            <div v-if="orderDetail.order && (orderDetail.order.orderStatus == 2 || orderDetail.order.orderStatus == 3 || orderDetail.order.orderStatus == 4)" 
                class="order-status">{{orderDetail.order && getOrderStatusDes(orderDetail.order.orderStatus)}}</div>
        </div>
        <!-- 单子固定信息内容 -->
        <div class="order-express">
            <ul>
                <li>订单日期: <span>{{formatDate(orderDetail, 'task', 'taskDate', 'YYYY-MM-DD')}}</span></li>
                <li>订单价格: <span class="order-prise f34">{{orderDetail.task && orderDetail.task.price}}元</span></li>
                <li>工作时间: <span>{{orderDetail.workTime}}</span></li>
                <li>工作站名称: <span>{{orderDetail.task && orderDetail.task.stationName}}</span></li>
                <li>工作站地址: <span>{{orderDetail.task && orderDetail.task.workStationAddress}}</span></li>
                <li>工作站电话: 
                    <a :href="'tel:' + orderDetail.task.workStationTel" v-if="orderDetail.task && orderDetail.task.workStationTel">{{orderDetail.task.workStationTel}}</a>
                    <span v-if="!orderDetail.task || !orderDetail.task.workStationTel">无</span>
                </li>

                <li>组长: <span>{{orderDetail.task? (orderDetail.task.groupHeadName.slice(0,1) + '师傅'):''}}</span></li>
                <li>B岗: <span>{{orderDetail.partTimerName}}</span></li>
                <li>B岗联系电话: 
                    <a :href="'tel:' + orderDetail.phone" v-if=" orderDetail.phone">{{orderDetail.phone}}</a>
                    <span  v-if=" !orderDetail.phone">无</span>
                </li>
            </ul>
        </div>
        <!-- 工作状态 -->
        <div class="working-status  mt-13">
            <ul>
                <!-- <li>订单创建时间: {{orderDetail.order && orderDetail.order.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') === 'Invalid date' ? '无' : orderDetail.order && orderDetail.order.createTime | dateFormat('YYYY-MM-DD HH:mm:ss')}}</li> -->
                <!-- <li v-if="orderDetail.order && (orderDetail.order.orderStatus == 2 || orderDetail.order.orderStatus == 3 || orderDetail.order.orderStatus == 4)">订单取消时间: {{orderDetail.order && orderDetail.order.cancelTime | dateFormat('YYYY-MM-DD HH:mm:ss') === 'Invalid date' ? '无' : orderDetail.order && orderDetail.order.cancelTime | dateFormat('YYYY-MM-DD HH:mm:ss')}}</li> -->
                <!-- <li>上班时间: {{orderDetail.order && orderDetail.order.startTime | dateFormat('YYYY-MM-DD HH:mm:ss') === 'Invalid date' ? '无' : orderDetail.order && orderDetail.order.startTime | dateFormat('YYYY-MM-DD HH:mm:ss')}} <span>({{orderDetail.order && orderDetail.order.startTime ? startTimeExpress[1] : startTimeExpress[0]}})</span></li> -->
                <!-- <li>下班时间: {{orderDetail.order && orderDetail.order.endTime | dateFormat('YYYY-MM-DD HH:mm:ss') === 'Invalid date' ? '无' : (orderDetail.order && orderDetail.order.endTime | dateFormat('YYYY-MM-DD HH:mm:ss'))}} <span>({{orderDetail.order && orderDetail.order.endTime ? endTimeExpress[1] : endTimeExpress[0]}})</span></li> -->
                <li>订单创建时间: {{formatDate(orderDetail, 'order', 'createTime', 'YYYY-MM-DD HH:mm:ss')}}</li>
                <li v-if="orderDetail.order && (orderDetail.order.orderStatus == 2 || orderDetail.order.orderStatus == 3 || orderDetail.order.orderStatus == 4)">订单取消时间: {{formatDate(orderDetail, 'order', 'cancelTime', 'YYYY-MM-DD HH:mm:ss')}}</li>
                <li>上班时间: {{formatDate(orderDetail, 'order', 'startTime', 'YYYY-MM-DD HH:mm:ss')}} <span>({{orderDetail.order && orderDetail.order.startTime ? startTimeExpress[1] : startTimeExpress[0]}})</span></li>
                <li>下班时间: {{formatDate(orderDetail, 'order', 'endTime', 'YYYY-MM-DD HH:mm:ss')}} <span>({{orderDetail.order && orderDetail.order.endTime ? endTimeExpress[1] : endTimeExpress[0]}})</span></li>
                <li v-if="orderDetail.order && orderDetail.order.orderStatus == 4">工作开始前<i>12小时</i>内取消订单扣取订单价格的100%，<i>{{orderDetail.task && orderDetail.task.price}}元</i>。</li>
                <li v-if="orderDetail.order && orderDetail.order.orderStatus == 3">工作开始前<i>24-12小时</i>内取消订单扣取订单价格的50%，<i>{{orderDetail.task && orderDetail.task.price / 2}}元</i>。</li>
                <li v-if="orderDetail.order && orderDetail.order.orderStatus == 5"><i>旷工</i>，罚款订单价格的100%，<i>{{orderDetail.task && orderDetail.task.price}}元</i>。</li>
            </ul>
        </div>
        <!-- 按钮 -->
        <div class="btn">
            <!-- ‘待进行’并且没有‘上班打卡’时间的单子才显示‘上班打卡’ -->
            <div @click="workStart" v-if="orderDetail.order 
                && orderDetail.order.orderStatus == 0 
                && !orderDetail.order.startTime" class="btn-submit mb-50">上班打卡</div>
            <!-- ‘进行中’并且没有‘下班打卡’时间，而且有‘上班打卡’时间的单子才显示‘下班打卡’ -->
            <div @click="workEnd" v-if="orderDetail.order 
                && orderDetail.order.orderStatus == 6 
                && !orderDetail.order.endTime 
                && orderDetail.order.startTime" class="btn-submit mb-50">下班打卡</div>
            <!-- 只有‘待进行’的单子才能进行‘取消订单’的操作 -->
            <div @click="cancelOrder" v-if="orderDetail.order 
                && orderDetail.order.orderStatus == 0" class="btn-submit-normal">取消订单</div>
        </div>
        <!-- 信息提示框 -->
        <message-box @close-message-box="closeMessageBox" v-show="isMessageBoxShow" :messageBoxProps="messageBoxProps"></message-box>
        <!-- loading -->
        <loading ref="loading"></loading>
    </div>
</div>
</template>
<script>
import './order-detail.scss';
import Loading from '@/components/common/loading';
import {Toast, MessageBox} from 'mint-ui';
import moment from 'moment';
import CommonModule from "@/common/common.js";
export default {
    components: {
        "loading": Loading
    },
    data() {
        return {
            orderId: '', // 订单id
            orderDetail: {}, // 订单详情
            startTimeExpress: ['未打卡上班', '已打卡上班', '待确认', 'B岗未打卡上班', 'B岗已打卡上班'],
            endWorkingTime: '2018-12-08 20:25:30',
            endTimeExpress: ['未打卡下班', '已打卡下班', '待确认', 'B岗未打卡下班', 'B岗已打卡下班'],
            affirmWorkingTimeExpress: ['待确认', '已确认'],
            isMessageBoxShow: false, // 信息提示弹框是否显示
            messageBoxProps: {
                message: '', // 信息提示框显示的文字内容
                img: '', // 信息提示框中显示的图片
                closeCallBack: null, // 关闭信息弹框执行的回调函数
            }, 
            tabType: 0, // 当前详情单子属于哪个tabType列表
            longitude: "", // 经度
            dimensions: "", // 纬度
            bmLocation: null,
        };
    },
    created() {
        this.bmLocation = api.require("bmLocation");
        // 获取当前单子的orderId
        this.orderId = this.$route.query.orderId;
        this.tabType = this.$route.query.tabType;
        this.init();
    },
    methods: {
        init() {
            this.getorderDetail();
        },
        getorderDetail() {
            let url = '/qd/rest/myOrder/detail';
            let data = {
                orderId: this.orderId,
            };

            window/$api.get(url, data).then(res => {

                if (!res || !res.body) {
                    Toast('服务器内部错误');
                    return;
                }

                if (res.code && res.code == 200) {
                    this.orderDetail = res.body;
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
                case 9:
                    return '异常转线下处理';
            }
        },
        // 格式化日期
        formatDate(orderDetail, pro, time, parttern) {
            if (orderDetail && orderDetail[pro]) {
                if (orderDetail[pro][time] !== null) {
                    return moment(orderDetail[pro][time]).format(parttern);
                } else {
                    return '无';
                }
            } else {
                return '无';
            }
        },
        // 取消订单
        cancelOrder() {
            
            let url = '/qd/rest/order/checkCancel';
            let data = {
                taskId: this.orderDetail.task && this.orderDetail.task.taskId,
            };

            window/$api.get(url, data).then(res => {
                if (!res) {
                    Toast('服务器内部错误');
                    return;
                }
                
                if (res.code && res.code === 200) { // 如果是正常取消
                    MessageBox.confirm('确定取消订单?').then(action => {
                        if (action == 'confirm') {
                            this.submitCancelOrder();
                        }
                    }).catch(() => {});
                } else if (res.code && res.code === 1102) { // 24-12小时内取消
                    MessageBox.confirm('工作开始前24-12小时内取消订单扣取订单价格的50%。', '确定取消订单?').then(action => {
                        if (action == 'confirm') {
                            this.submitCancelOrder();
                        }
                    }).catch(() => {});
                } else if (res.code && res.code === 1101) { // 12小时内取消
                    MessageBox.confirm('工作开始前12小时内取消订单扣取订单价格的100%。', '确定取消订单?').then(action => {
                        if (action == 'confirm') {
                            this.submitCancelOrder();
                        }
                    }).catch(() => {});
                } else if (res.code && res.code === 1103) { // 已经超过上班时间点击取消订单
                    MessageBox.alert('上班时间已到，不能取消订单！');
                }
            })

        },
        // 确认取消订单
        submitCancelOrder() {
            let url = '/qd/rest/order/cancel';
            let data = {
                taskId : this.orderDetail.task && this.orderDetail.task.taskId,
                orderId: this.orderDetail.order && this.orderDetail.order.orderId,
            };

            window/$api.get(url, data).then(res => {

                if (res.code && res.code == 200) {
                    this.messageBoxProps.message = '订单取消成功';
                    this.messageBoxProps.img = 'success';
                    this.messageBoxProps.closeCallBack = this.successCloseCallBack;
                    this.isMessageBoxShow = true;
                } else {
                    this.messageBoxProps.message = '订单取消失败';
                    this.messageBoxProps.img = 'failure';
                    this.isMessageBoxShow = true;
                }

            }).catch(() => {
                Toast('服务器内部错误');
            })
        },
        // 订单取消成功时，关闭信息弹框组件执行的回调函数
        successCloseCallBack() {
            // 跳转到“订单管理”
            this.$router.push('/order-manage');
        },
        // 打卡上班,事件处理函数
        workStart() {
            MessageBox.confirm('确定要打卡上班?').then(action => {
                if (action == 'confirm') {
                    this.$refs.loading.show();
                    this.bmLocation.stopLocation();
                    this.getLocation(this.submitWorkStart);
                    // if (this.longitude && this.dimensions) {
                    //     this.submitWorkStart();
                    // } else {
                    //     Toast('获取位置失败');
                    // }
                }
            }).catch(() => {});
        },
        // 打卡上班，调接口
        submitWorkStart() {

            let url = '/qd/rest/clock/work/start';
            let data = {
                orderId: this.orderDetail.order && this.orderDetail.order.orderId,
                longitude: this.longitude,// 经度
                dimensions: this.dimensions,// 纬度
            };

            window/$api.get(url, data).then(res => {

                if (!res) {
                    Toast('服务器内部错误');
                    return;
                }

                if (res.code && res.code === 200) {
                    this.messageBoxProps.message = '正常打卡成功,请联系A岗“确认上班”';
                    this.messageBoxProps.img = 'success';
                    this.messageBoxProps.closeCallBack = this.init;
                    this.isMessageBoxShow = true;
                } else if (res.code && res.code === 500) {
                    this.messageBoxProps.message = '打卡失败';
                    this.messageBoxProps.img = 'failure';
                    this.messageBoxProps.closeCallBack = this.init;
                    this.isMessageBoxShow = true;
                } else {
                    this.messageBoxProps.message = res.body? res.body : '打卡失败';
                    this.messageBoxProps.img = 'failure';
                    this.messageBoxProps.closeCallBack = this.init;
                    this.isMessageBoxShow = true;
                }

            }).catch(() => {
                Toast('服务器内部错误');
            })

        },
        // 打卡下班,事件处理函数
        workEnd() {
            MessageBox.confirm('确定要打卡下班?').then(action => {
                if (action == 'confirm') {
                    this.$refs.loading.show();
                    this.getLocation(this.submitWorkEnd);
                    // if (this.longitude && this.dimensions) {
                    //     this.submitWorkEnd();
                    // } else {
                    //     Toast('获取位置失败');
                    // }
                }
            }).catch(() => {});
        },
        // 打卡下班，调接口
        submitWorkEnd() {

            let url = '/qd/rest/clock/work/end';
            let data = {
                orderId: this.orderDetail.order && this.orderDetail.order.orderId,
                longitude: this.longitude,// 经度
                dimensions: this.dimensions,// 纬度
            };

            window/$api.get(url, data).then(res => {

                if (!res) {
                    Toast('服务器内部错误');
                    return;
                }

                if (res.code && res.code === 200) {
                    this.messageBoxProps.message = '正常打卡成功,请联系A岗“确认下班”';
                    this.messageBoxProps.img = 'success';
                    this.messageBoxProps.closeCallBack = this.init;
                    this.isMessageBoxShow = true;
                } else if (res.code && res.code === 500) {
                    this.messageBoxProps.message = '打卡失败';
                    this.messageBoxProps.img = 'failure';
                    this.messageBoxProps.closeCallBack = this.init;
                    this.isMessageBoxShow = true;
                } else {
                    this.messageBoxProps.message = res.body? res.body : '打卡失败';
                    this.messageBoxProps.img = 'failure';
                    this.messageBoxProps.closeCallBack = this.init;
                    this.isMessageBoxShow = true;
                }

            }).catch(() => {
                Toast('服务器内部错误');
            })

        },
        // 关闭消息提示弹框
        closeMessageBox() {
            this.isMessageBoxShow = false;
        },
        // 获取当前经纬度
        getLocation(callback) {
            let _this = this;
            // 判断当前系统是Android ios
            let systemType = api.systemType;

            if (systemType === "ios") {
                // ios获取当前位置经纬度信息
                $api
                .getLocation()
                .then(res => {
                    _this.$refs.loading.close();
                    _this.longitude = res.longitude;
                    _this.dimensions = res.latitude;
                    if (_this.longitude && _this.dimensions) {
                        callback();
                    } else {
                        Toast('获取位置失败，请检查GPS设置');
                    }
                })
                .catch(() => {
                    _this.$refs.loading.close();
                    Toast("获取位置失败，请检查GPS设置");
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
                    function(ret,err) {
                        if (ret.status) {
                        // 防止在监测到“获取不到位置”之后重新请求到数据导致重复请求列表的情况
                        // 10s之后才请求到位置信息会出现请求了两次列表的情况，这里的判断避免这类情况
                            _this.$refs.loading.close();
                            _this.longitude = ret.location.longitude;
                            _this.dimensions = ret.location.latitude;
                            if (_this.longitude && _this.dimensions) {
                                callback();
                            } else {
                                Toast('获取位置失败，请检查GPS设置');
                            }
                        } else {
                            _this.$refs.loading.close();
                            Toast("获取位置失败，请检查GPS设置");
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
                        _this.$refs.loading.close();
                        Toast("获取位置失败，请检查GPS设置");
                    }
                }, 10000);
            }
        },
    },
    mounted() {
        CommonModule.topAdaption('.mint-header');
        $api.dom('.common-header-height').style.height = $api.offset($api.dom('.mint-header')).h + 'px';
    },

};
</script>