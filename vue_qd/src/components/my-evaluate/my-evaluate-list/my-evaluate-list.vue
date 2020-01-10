<template>
    <div class="my-evaluate-list-container">
        <!-- 头像 -->
        <div class="evaluate-head-pic">
            <img src="@/assets/evaluate-head-pic.png" alt="">
        </div>
        <!-- 中间内容信息 -->
        <div class="evaluate-content">
            <div class="first-row">
                <div class="evaluate-name">{{item && item.toUserName}}</div>
                <!-- 时间 -->
                <div class="evaluate-date">
                    {{formatDate(item, 'createTime', 'YYYY-MM-DD')}}
                </div>
            </div>
            <div class="evaluate-work-time">
                工作时间: 
                <span>{{evaluateWorkTime}}</span>
            </div>
            <div class="evaluate-grade">
                <grade-component :gradeComponentProps="gradeComponentProps"></grade-component>
            </div>
            <div class="evaluate-detail">{{item && item.gradeContent ? item && uncodeUtf16(item.gradeContent) : '无'}}</div>
        </div>
    </div>
</template>
<script>
import GradeComponent from '@/components/common/grade-component';
import './my-evaluate-list.scss';
import moment from 'moment';
export default {
    components: {
        'grade-component': GradeComponent,
    },
    props: ['item'],
    data() {
        return {
            // evaluateName: '乔峰',
            evaluateWorkTime: '08:30-20:30',
            // evaluateDetail: '工作认真负责，非常专业',
            gradeComponentProps: {
                canChange: false,
                totalStars: 5,
                defaultActiveStars: this.item && this.item.grade,
                class: {
                    titleClass: 'title',
                    starsClass: 'stars',
                    gradeDesClass: 'grade-des',
                }
            },
        }
    },
    methods: {
        // 格式化日期
        formatDate(detail, pro, parttern) {
            if (detail && detail[pro]) {
                return moment(detail[pro]).format(parttern);
            } else {
                return '无';
            }
        },
        // 将评价内容中的特殊表情字符串转换成对应的表情
        uncodeUtf16(str){
            var reg = /\&#.*?;/g;
            var result = str.replace(reg,function(char){
                var H,L,code;
                if(char.length == 9 ){
                    code = parseInt(char.match(/[0-9]+/g));
                    H = Math.floor((code-0x10000) / 0x400)+0xD800;
                    L = (code - 0x10000) % 0x400 + 0xDC00;
                    return unescape("%u"+H.toString(16)+"%u"+L.toString(16));
                }else{
                    return char;
                }
            });
            return result;
        }
    }
};
</script>
<style>
</style>