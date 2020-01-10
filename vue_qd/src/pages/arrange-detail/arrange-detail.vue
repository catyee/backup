<template>
<div class="arrange-detail-container">
    <div class="common-header-container">
        <mt-header fixed title="订单详情">
            <router-link :to="{path: '/order-manage', query: {type: 'arrange', tabType2: tabType2}}" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="common-header-height"></div>
    </div>
    <!-- 单子主体内容 -->
    <div class="arrange-content mt-13">
        <!-- 组名 -->
        <div class="arrange-title">
            <div class="group-name">{{arrangeDetail.task && arrangeDetail.task.groupName}}</div>
            <div v-if="arrangeDetail.task && (arrangeDetail.task.taskStatus == 0)" class="arrange-status">{{arrangeDetail.task && getarrangeStatusDes(arrangeDetail.task.taskStatus)}}</div>
        </div>
        <!-- 单子固定信息内容 -->
        <div class="arrange-express">
            <ul>
                <li>订单日期: <span>{{formatDate(arrangeDetail, 'task', 'taskDate', 'YYYY-MM-DD')}}</span></li>
                <li>订单价格: <span class="f34">{{arrangeDetail.task && arrangeDetail.task.price}}元</span></li>
                <li>工作时间: <span>{{arrangeDetail.workTime}}</span></li>
                <li>工作站名称: <span>{{arrangeDetail.task && arrangeDetail.task.stationName}}</span></li>
                <li>工作站地址: <span>{{arrangeDetail.task && arrangeDetail.task.workStationAddress}}</span></li>
                <li>工作站电话: <span>{{arrangeDetail.task && arrangeDetail.task.workStationTel}}</span></li>
                <li>组长: <span>{{arrangeDetail.task && arrangeDetail.task.groupHeadName}}</span></li>
                <li>B岗: <span>{{arrangeDetail.partTimerName || '无'}}</span></li>
                <li>B岗联系电话: <span>{{arrangeDetail.phone || '无'}}</span></li>
            </ul>
        </div>
        <!-- 工作状态 -->
        <div class="working-status mt-13">
            <ul>
                <!-- <li>B岗上班打卡时间: {{arrangeDetail.arrange && arrangeDetail.arrange.startTime | dateFormat('YYYY-MM-DD HH:mm:ss') || '无'}} <span>({{arrangeDetail.arrange && arrangeDetail.arrange.startTime ? startTimeExpress[4] : startTimeExpress[3]}})</span></li> -->
                <!-- <li>确认上班时间: {{arrangeDetail.arrange && arrangeDetail.arrange.startVerifyTime | dateFormat('YYYY-MM-DD HH:mm:ss') || '无'}} <span>({{arrangeDetail.arrange && arrangeDetail.arrange.startVerifyTime ? verifyExpress[1] : verifyExpress[0]}})</span></li> -->
                <!-- <li>B岗下班打卡时间: {{arrangeDetail.arrange && arrangeDetail.arrange.endTime | dateFormat('YYYY-MM-DD HH:mm:ss') || '无'}} <span>({{arrangeDetail.arrange && arrangeDetail.arrange.endTime ? endTimeExpress[4] : endTimeExpress[3]}})</span></li> -->
                <!-- <li>确认上班时间: {{arrangeDetail.arrange && arrangeDetail.arrange.endVerifyTime | dateFormat('YYYY-MM-DD HH:mm:ss') || '无'}} <span>({{arrangeDetail.arrange && arrangeDetail.arrange.endVerifyTime ? verifyExpress[1] : verifyExpress[0]}})</span></li> -->
                <li>B岗上班打卡时间: {{formatDate(arrangeDetail, 'order', 'startTime', 'YYYY-MM-DD HH:mm:ss')}} <span>({{arrangeDetail.order && arrangeDetail.order.startTime ? startTimeExpress[4] : startTimeExpress[3]}})</span></li>
                <li>确认上班时间: {{formatDate(arrangeDetail, 'order', 'startVerifyTime', 'YYYY-MM-DD HH:mm:ss')}} <span>({{arrangeDetail.order && arrangeDetail.order.startVerifyTime ? verifyExpress[1] : verifyExpress[0]}})</span></li>
                <li>B岗下班打卡时间: {{formatDate(arrangeDetail, 'order', 'endTime', 'YYYY-MM-DD HH:mm:ss')}} <span>({{arrangeDetail.order && arrangeDetail.order.endTime ? endTimeExpress[4] : endTimeExpress[3]}})</span></li>
                <li>确认下班时间: {{formatDate(arrangeDetail, 'order', 'endVerifyTime', 'YYYY-MM-DD HH:mm:ss')}} <span>({{arrangeDetail.order && arrangeDetail.order.endVerifyTime ? verifyExpress[1] : verifyExpress[0]}})</span></li>
            </ul>
        </div>
        <!-- 按钮 -->
        <div class="btn">
            <!-- B岗打卡后，A岗才能确认 -->
            <div @click="verifyStart" v-if="arrangeDetail.task 
                && arrangeDetail.task.taskStatus == 2 
                && arrangeDetail.order 
                && !arrangeDetail.order.startVerifyTime
                && arrangeDetail.order.startTime" class="btn-submit">确认上班</div>
            <div @click="verifyEnd" v-if="arrangeDetail.task 
                && arrangeDetail.task.taskStatus == 2 
                && arrangeDetail.order 
                && arrangeDetail.order.startVerifyTime 
                && !arrangeDetail.order.endVerifyTime
                && arrangeDetail.order.endTime" class="btn-submit">确认下班</div>
        </div>
        <!-- 信息提示弹框 -->
        <message-box @close-message-box="closeMessageBox" v-show="isMessageBoxShow" :messageBoxProps="messageBoxProps"></message-box>
    </div>
</div>
</template>
<script>
import './arrange-detail.scss';
import {Toast, MessageBox} from 'mint-ui';
import CommonModule from "@/common/common.js";
import moment from 'moment';
export default {
    data() {
        return {
            taskId: 0, // 订单id
            arrangeDetail: {}, // 订单详情
            isMessageBoxShow: false, // 信息提示弹框是否显示
            messageBoxProps: {
                message: '', // 信息提示框显示的文字内容
                img: '', // 信息提示框中显示的图片
                closeCallBack: null, // 关闭信息弹框执行的回调函数
            },
            startTimeExpress: ['未到上班时间', '已打卡上班', '待确认', 'B岗未打卡上班', 'B岗已打卡上班'],
            endTimeExpress: ['未到下班时间', '已打卡下班', '待确认', 'B岗未打卡下班', 'B岗已打卡下班'],
            verifyExpress: ['待确认', '已确认'],
            tabType2: 4, // 当前详情单子属于哪个tabType列表
        };
    },
    created() {
        // 获取当前单子的arrangeId
        this.taskId = this.$route.query.taskId;
        this.tabType2 = this.$route.query.tabType2;
        this.init();
    },
    mounted() {
        CommonModule.topAdaption('.mint-header');
        $api.dom('.common-header-height').style.height = $api.offset($api.dom('.mint-header')).h + 'px';
    },
    methods: {
        init() {
            this.getarrangeDetail();
        },
        getarrangeDetail() {
            let url = '/qd/rest/myOrder/myDetail';
            let data = {
                taskId: this.taskId,
            };

            window.$api.get(url, data).then(res => {

                if (!res || !res.body) {
                    Toast('服务器内部错误');
                    return;
                }

                if (res.code && res.code == 200) {
                    this.arrangeDetail = res.body;
                }else {
                     Toast('服务器内部错误'+res.code);
                    return;
                }

            })
        },
        // 判断单子状态
        getarrangeStatusDes(status) {
            switch(status) {
                case 0:
                return '未抢单';
            }
        },
        // 格式化日期
        formatDate(arrangeDetail, pro, time, parttern) {
            if (arrangeDetail && arrangeDetail[pro]) {
                if (arrangeDetail[pro][time] !== null) {
                    return moment(arrangeDetail[pro][time]).format(parttern);
                } else {
                    return '无';
                }
            } else {
                return '无';
            }
        },
        // 确认上班，事件处理函数
        verifyStart() {
            if (!this.arrangeDetail.order.startTime) {
                MessageBox.confirm('B岗未上班打卡，确定要提交确认上班?').then(action => {
                    if (action == 'confirm') {
                        this.submitVerifyStart();
                    }
                }).catch(() => {});
            } else {
                MessageBox.confirm('确定要提交确认上班?').then(action => {
                    if (action == 'confirm') {
                        this.submitVerifyStart();
                    }
                }).catch(() => {});
            }
            
        },
        // 确认上班，调取接口
        submitVerifyStart() {

            let url = '/qd/rest/clock/verify/start';
            let data = {
                orderId: this.arrangeDetail.order && this.arrangeDetail.order.orderId,
            };

            window/$api.get(url, data).then(res => {

                if (!res) {
                    Toast('服务器内部错误');
                    return;
                }

                if (res.code && res.code === 200) {
                    this.messageBoxProps.message = '确认成功';
                    this.messageBoxProps.img = 'success';
                    this.messageBoxProps.closeCallBack = this.init;
                    this.isMessageBoxShow = true;
                } else {
                    this.messageBoxProps.message = '确认失败';
                    this.messageBoxProps.img = 'failure';
                    this.messageBoxProps.closeCallBack = this.init;
                    this.isMessageBoxShow = true;
                }

            });

        },
        // 确认下班，事件处理函数
        verifyEnd() {
            if (!this.arrangeDetail.order.endTime) {
                MessageBox.confirm('B岗未下班打卡，确定要提交确认下班?').then(action => {
                    if (action == 'confirm') {
                        this.submitVerifyEnd();
                    }
                }).catch(() => {});
            } else {
                MessageBox.confirm('确定要提交确认下班?').then(action => {
                    if (action == 'confirm') {
                        this.submitVerifyEnd();
                    }
                }).catch(() => {});
            }
        },
        // 确认下班，调取接口
        submitVerifyEnd() {

            let url = '/qd/rest/clock/verify/end';
            let data = {
                orderId: this.arrangeDetail.order && this.arrangeDetail.order.orderId,
            };

            window/$api.get(url, data).then(res => {

                if (!res) {
                    Toast('服务器内部错误');
                    return;
                }

                if (res.code && res.code === 200) {
                    this.messageBoxProps.message = '确认成功';
                    this.messageBoxProps.img = 'success';
                    this.messageBoxProps.closeCallBack = this.init;
                    this.isMessageBoxShow = true;
                } else {
                    this.messageBoxProps.message = '确认失败';
                    this.messageBoxProps.img = 'failure';
                    this.messageBoxProps.closeCallBack = this.init;
                    this.isMessageBoxShow = true;
                }

            });

        },
        // 关闭信息提示弹框
        closeMessageBox() {
            this.isMessageBoxShow = false;
        },
    },
    

};
</script>