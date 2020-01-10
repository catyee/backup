<template>
<div class="message-box-container" @click.stop="handleEmit">
    <div class="box" @click.stop>
        <div class="img">
            <img v-if="this.messageBoxProps.img" :src="handleImg" alt="">
        </div>
        <div class="message">{{messageBoxProps.message}}</div>
        <div v-if="messageBoxProps.handleBtnName" @click.stop="handleBtnClick" class="handle-btn">{{messageBoxProps.handleBtnName}}</div>
    </div>
</div>
</template>
<script>
import './message-box.scss';
export default {
    /**
     * messageBoxProps => 父组件向子组件传递的信息对象
     * messageBoxProps.message =>(必传) 提示信息描述
     * messageBoxProps.img =>(可选传) 提示框中图片名（如：成功->success; 失败->failure）
     * messageBoxProps.closeCallBack =>(可选传) 关闭弹框时需要执行的函数
     * messageBoxProps.handleBtnName =>(可选传) 提示框中操作按钮文字内容，如果没有按钮则不传递该项
     * messageBoxProps.handleBtnCallBack =>(可选传) 提示框中'确定'或‘取消’按钮点击的回调
     * 
     * close-message-box => 子组件向父组件抛出的隐藏组件的事件名
     */
    data() {
        return {
        }
    },
    props: ['messageBoxProps'],
    computed: {
        handleImg() {
            return require('@/assets/' + this.messageBoxProps.img + '.png');
        }
    },
    methods: {
        handleEmit() {
            this.$emit('close-message-box');
            // 判断是否存在关闭弹框的回调函数,存在则执行回调
            if (this.messageBoxProps.closeCallBack && typeof this.messageBoxProps.closeCallBack === 'function') {
                this.messageBoxProps.closeCallBack();
            }
        },
        handleBtnClick() {
            this.$emit('close-message-box');
            // 判断是否存在点击按钮的回调函数，存在则执行回调
            if (this.messageBoxProps.handleBtnCallBack && typeof this.messageBoxProps.handleBtnCallBack === 'function') {
                this.messageBoxProps.handleBtnCallBack();
            }
        }
    }
};
</script>