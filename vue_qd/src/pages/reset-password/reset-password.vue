<template>
<div class="reset-password-container">
    <div class="common-header-container">
        <mt-header fixed title="重置密码">
            <router-link to="/login/find-back-password" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="common-header-height"></div>
    </div>
    <div class="gray-line"></div>
    <div class="content pt-50 pl-20 pr-20">
        <!-- 新密码 -->
        <div class="new-password">
            <input type="text" placeholder="新密码" v-model="newPassword">
            <div class="color-danger tip">{{newPasswordTip}}</div>
        </div>
        <!-- 确认密码 -->
        <div class="affirm-password">
            <input type="text" placeholder="确认密码" v-model="affirmPassword">
            <div class="color-danger tip">{{affirmPasswordTip}}</div>
        </div>
        <!-- 确定按钮 -->
        <div class="btn">
            <div class="btn-submit" @click="handleSubmit">确定</div>
        </div>
    </div>
    <!-- 信息弹框组件 -->
    <message-box @close-message-box="closeMessageBox" v-show="isMessageBoxShow" :messageBoxProps="messageBoxProps"></message-box>
</div>
</template>
<script>
import './reset-password.scss';
import { Toast } from "mint-ui";
import CommonModule from "@/common/common.js";
export default {
    data() {
        return {
            messageBoxProps: {
                message: '',
                img: '',
            },
            isMessageBoxShow: false,
            newPassword: '', // 新密码
            affirmPassword: '', // 确认新密码
            userId: '', // 用户的主键ID
            newPasswordTip: '', // 新密码提示
            affirmPasswordTip: '', // 确认新密码提示
        }
    },
    created() {
        this.userId = this.$route.query.userId;
    },
    methods: {
        handleSubmit() {
            // 验证两次输入的密码是否一致
            if(!this.handleSame()) return;
            this.resetSubmit();
        },
        // 关闭信息弹框
        closeMessageBox() {
            this.isMessageBoxShow = false;
        },
        // 验证两次输入的密码是否一致
        handleSame() {
            if (this.newPassword !== this.affirmPassword) {
                Toast('两次输入的密码不一致');
                return false;
            } else if (!this.newPassword) {
                this.newPasswordTip = '请输入密码';
                return false;
            } else if (!this.affirmPassword) {
                this.affirmPasswordTip = '请输入密码';
                return false;
            } else {
                return true;
            }
        },
        // 发送重置密码请求
        async resetSubmit() {
            let url = '/admin/rest/user/forget/password';
            let data = {
                userId: this.userId,
                password: this.affirmPassword,
            };

            const success = await $api.post(url, data).then(res => {
                if (res.code === 200) {
                    return true;
                }
                if (res.code === 404) {
                    return false;
                }
            }).catch((e) => {
                Toast(JSON.stringify(e));
                return false;
            });
            if (success) {
                this.messageBoxProps = {
                    message: '修改密码成功',
                    img: 'success',
                    closeCallBack: this.closeCallBack,
                };
                this.isMessageBoxShow = true;
            } else {
                this.messageBoxProps = {
                    message: '修改密码失败',
                    img: 'failure',
                };
                this.isMessageBoxShow = true;
            }
        },
        // 修改密码成功时，关闭信息提示框执行的回调函数
        closeCallBack() {
            this.$router.push({path: '/login'});
        },
    },
    mounted() {
        CommonModule.topAdaption('.mint-header');
        $api.dom('.common-header-height').style.height = $api.offset($api.dom('.mint-header')).h + 'px';
  },
};
</script>