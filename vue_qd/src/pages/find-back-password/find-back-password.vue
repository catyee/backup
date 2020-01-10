<template>
<div class="find-back-password-container">
    <div class="common-header-container">
        <mt-header fixed title="找回密码">
            <router-link to="/login" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="common-header-height"></div>
    </div>
    <div class="gray-line"></div>
    <div class="content">
        <!-- 手机号码输入框 -->
        <div class="tellphone">
            <input type="text" placeholder="请输入手机号码" v-model="tellphoneNum">
            <div class="color-danger tip">{{phoneTip}}</div>
        </div>
        <!-- 验证码输入框 -->
        <div>
            <verification-code 
                type="2" 
                :code-tip="codeTip" 
                :telNumber="tellphoneNum"
                @verification-code="verificationCodeChange"
                @tel-tip="showTelTip"/>
        </div>
        <!-- 确定按钮 -->
        <div class="btn">
            <div @click="handleSubmit" class="btn-submit" :class="{'btn-submit-forbid': verificationCode.length == 0 || tellphoneNum.length == 0}">确定</div>
        </div>
    </div>
</div>
</template>
<script>
import './find-back-password.scss';
import VerificationCode from '@/components/common/verification-code';
import { Toast } from "mint-ui";
import CommonModule from "@/common/common.js";
export default {
    components: {
        'verification-code': VerificationCode,
    },
    data() {
        return {
            tellphoneNum: '', // 手机号
            verificationCode: '', // 输入的验证码
            codeTip: '', // 验证码提示
            phoneTip: '', // 手机号提示
            userId: '', // 用户的主键ID
        }
    },
    methods: {
        verificationCodeChange($event) {
            this.verificationCode = $event;
        },
        // 点击验证码，判断是否已经输入手机号
        showTelTip($event) {
            this.phoneTip = $event;
        },
        // 验证是否输入手机号
        handlePhone() {
            // 如果没有输入手机号，提示
            if (!this.tellphoneNum) {
                this.phoneTip = "请输入手机号";
                return false;
            }
            this.phoneTip = "";
            return true;
        },
        // 验证验证码
        handleCode() {
            // 如果没有输入验证码，提示
            if (!this.verificationCode) {
                this.codeTip = "请输入验证码";
                return false;
            }
            this.codeTip = "";
            return true;
        },
        // 点击‘确定’按钮
        handleSubmit() {
            // 手机号提示
            if (!this.handlePhone()) return;
            // 如果没有输入验证码，提示
            if (!this.handleCode()) return;

            this.verifyPhoneCode();
        },
        // 验证验证码和手机号是否匹配
        async verifyPhoneCode() {
            let url = "/admin/rest/user/sms/validate";
            let data = {
                userName: this.tellphoneNum,
                code: this.verificationCode
            };

            const success = await $api.post(url, data).then(res => {
                if (res.code == 200) {
                    this.userId = res.body;
                    return true;
                }
                if (res.code == 1015) {
                    this.codeTip = "验证码失效";
                    return false;
                }
                if (res.code == 1016) {
                    this.codeTip = "验证码错误";
                    return false;
                }
                Toast("服务器错误" + res.code);
                return false;
            }).catch(e => {
                Toast(JSON.stringify(e));
                return false;
            });
            if(success) {
                this.goResetPasswordPage();
            }
        },
        goResetPasswordPage() {
            this.$router.push({path: '/login/reset-password', query: {userId: this.userId}});
        },
    },
    mounted() {
        CommonModule.topAdaption('.mint-header');
        $api.dom('.common-header-height').style.height = $api.offset($api.dom('.mint-header')).h + 'px';
    },
};
</script>