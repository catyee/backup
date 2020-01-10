<template>
  <div class="evaluate-container">
    <!-- 头部页面标题 -->
    <div class="common-header-container">
      <mt-header title="评价">
        <router-link :to="{path: '/order-manage', query: {type: type, tabType: tabType, tabType2: tabType2}}" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <!-- <div class="common-header-height"></div>
      <div class="phone-statusbar-height"></div>-->
    </div>
    <!-- 主体内容 -->
    <div class="content">
      <div class="base-inf">
        <div class="head-pic">
          <img src="@/assets/head-pic.png" alt>
        </div>
        <div class="express">
          <p class="name">{{name}}</p>
          <p class="date">工作时间:
            <span>{{workTime}}</span>
          </p>
        </div>
      </div>
      <!-- 星级评价组件 -->
      <div class="grade">
        <grade-component
          @evaluate-grade="handleEvaluateGrade($event)"
          :gradeComponentProps="gradeComponentProps"
        ></grade-component>
      </div>
      <!-- textarea -->
      <div class="textarea">
        <textarea v-model="gradeContent" placeholder="填写评价"></textarea>
      </div>
      <!-- 提交按钮 -->
      <div class="btn">
        <div class="btn-submit" :class="{'btn-submit-forbid': grade == 0}" @click="handleSubmit">提交</div>
      </div>
      <!-- ‘提交’点击信息弹框 -->
      <message-box
        @close-message-box="handleCloseMessageBox"
        v-show="isMessageBoxShow"
        :messageBoxProps="messageBoxProps"
      ></message-box>
    </div>
  </div>
</template>
<script>
import GradeComponent from "@/components/common/grade-component";
import "./evaluate.scss";
import { Toast } from "mint-ui";
import { MessageBox } from "mint-ui";
import CommonModule from "@/common/common.js";
export default {
  components: {
    "grade-component": GradeComponent
  },
  data() {
    return {
      // 向星级评价组件传递的参数
      gradeComponentProps: {
        canChange: true,
        totalStars: 5,
        defaultActiveStars: 0,
        class: {
          titleClass: "title",
          starsClass: "stars",
          gradeDesClass: "grade-des"
        }
      },
      // 向消息提示组件传递的参数
      messageBoxProps: {
        // message: '提交成功',
        // img: 'success',
        // closeCallBack: this.handleRouteBack,
      },
      grade: 0, // 评价等级（几星）
      gradeContent: "",
      isMessageBoxShow: false, // 是否显示提交信息框
      taskId: "",
      name: "", // 被评价人姓名
      workTime: "", // 工作时间
      tabType: null, // 代表当前评价页来源于order-list中的哪个tab
      tabType2: null, //  代表当前评价页来源于arrange-list中的哪个tab
      type: null, // 代表当前评价页的来源，order或者arrange
    };
  },
  methods: {
    // 处理星级评价组件传出的‘评价等级’信息
    handleEvaluateGrade($event) {
      this.grade = $event;
    },
    handleSubmit() {
      MessageBox.confirm("确定提交评价?")
        .then(action => {
          if (action == "confirm") {
            this.submit();
          }
        })
        .catch(() => {});
    },
    submit() {
      // 只有当评价了星级之后才能进行提交操作
      if (this.grade > 0) {
        // 1、调接口提交评价信息
        let url = "/qd/rest/evaluate";
        let data = {
          taskId: this.taskId,
          grade: this.grade,
          gradeContent: this.utf16toEntities(this.gradeContent)
        };

        window /
          $api.post(url, data).then(res => {
            if (!res || !res.body) {
              Toast("服务器内部错误");
              return;
            }

            // 2、根据返回数据显示消息提示框
            if (res.code && res.code === 200) {
              this.messageBoxProps = {
                message: "提交成功",
                img: "success",
                closeCallBack: this.handleRouteBack
              };
              this.isMessageBoxShow = true;
            } else {
              Toast("提交失败"+res.code);
              return;
            }
          });
      } else {
        this.messageBoxProps = {
          message: "请评价星级",
          img: "failure"
        };
        this.isMessageBoxShow = true;
      }
    },
    // 跳转到
    handleRouteBack() {
        this.$router.push({path: '/order-manage', query: {type: this.type, tabType: this.tabType, tabType2: this.tabType2}});
    },
    handleCloseMessageBox() {
      this.isMessageBoxShow = false;
    },
    // 将表情转换成字符
    utf16toEntities(str) { 
      var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则 
      str = str.replace(patt, function(char){ 
          var H, L, code; 
            if (char.length===2) { 
                H = char.charCodeAt(0); // 取出高位 
                L = char.charCodeAt(1); // 取出低位 
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法 
                return "&#" + code + ";"; 
            } else { 
                return char; 
            } 
        }); 
        return str; 
    },
    
  },
  created() {
    if (this.$route.query.tabType) {
      this.tabType = this.$route.query.tabType;
    } else if (this.$route.query.tabType2) {
      this.tabType2 = this.$route.query.tabType2;
    }
    this.type = this.$route.query.type;

    this.taskId = this.$route.params.taskId;
    this.name = this.$route.query.name;
    this.workTime = this.$route.query.workTime;
  },
  mounted() {
    CommonModule.topAdaption(".mint-header");
  }
};
</script>