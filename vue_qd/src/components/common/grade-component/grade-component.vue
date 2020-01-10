<template>
<div class="grade-component-container">
    <div :class="[gradeComponentProps.class.titleClass]">评分</div>
    <div :class="[gradeComponentProps.class.starsClass]">
        <img @click.stop="cancelActive(index)" v-for="(item, index) of activeStars" :key="'active-' + index" src="@/assets/wodepingjia_click.png" alt="">
        <img @click.stop="selectActive(index)" v-for="(item, index) of normalStars" :key="'normal-' + index" src="@/assets/wodepingjia_nor.png" alt="">
    </div>
    <div :class="[gradeComponentProps.class.gradeDesClass]">{{gradeDes[activeStars]}}</div>
</div>
</template>
<script>
import './grade-component.scss';
export default {
    data() {
        return {
            activeStars: 0, // 点亮的星星个数
            gradeDes: ['', '非常差', '差', '一般', '满意', '非常好'],
        };
    },
    /**
     * gradeComponentProps = {
     *  canChange: true, 点击‘星星’能否改变‘星星’状态,评价页中可以点击，‘我的评价’中只支持显示星星等级，点击星星不生效
     *  totalStars: 5, 星的总个数
     *  defaultActiveStars: 0;（可选） 组件初始化时默认点亮的星星个数
     *  class: {
     *      titleClass: '',  class='title'的类名
     *      starsClass: '',  class='stars'的类名
     *      gradeDesClass: ''    class='grade-des'的类名
     *  }
     * }
     * 
     * evaluate-grade -> 向父组件传递的评价星级事件，参数$event就是等级（一星：1；二星：2；。。。）
    */
    props: ['gradeComponentProps'],
    computed: {
        // 未点亮星星的个数
        normalStars() {
            return this.gradeComponentProps.totalStars - this.activeStars;
        }
    },
    methods: {
        // 处理点击已经选中高亮显示的星星（有色星星）
        cancelActive(index) {
            if (this.gradeComponentProps.canChange) {
                this.activeStars = index + 1;
                this.$emit('evaluate-grade', this.activeStars);
            }
        },
        // 处理点击未选中的星星（无色星星）
        selectActive(index) {
            if (this.gradeComponentProps.canChange) {
                this.activeStars += (index + 1);
                this.$emit('evaluate-grade', this.activeStars);
            }
        }
    },
    created() {
        if (this.gradeComponentProps.defaultActiveStars && typeof this.gradeComponentProps.defaultActiveStars == 'number') {
            // 如果父组件传入了默认高亮的星星个数，则将activeStars赋值为defaultActiveStars
            this.activeStars = this.gradeComponentProps.defaultActiveStars;
            this.$emit('evaluate-grade', this.activeStars);
        }
    }
};
</script>