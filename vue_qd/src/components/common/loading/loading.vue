<template>
    <img id="loading" src="@/assets/loading.gif" alt="" v-show="isShow">
</template>
<script>
import './loading.scss';
export default {
    data() {
        return {
            isShow: false,
        };
    },
    methods: {
        // 显示 loading
        show() {
            this.isShow = true;
        },
        // 隐藏 loading
        close() {
            this.isShow = false;
        }
    }
}
</script>

