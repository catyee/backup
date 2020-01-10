
<template>
  <!-- 上传身份证 -->
  <div class="common_flex-center bg-white component-identity-container pr-40 pl-40">
    <div class="f30 pb-50" v-if="!viewMode">请按要求上传身份证信息</div>
    <img src="@/assets/identity_front.png" id="frontImg" @click="viewFrontPic">
    <div class="color-yellow f36 pt-30" @click="uploadFront" v-if="!viewMode">上传身份证正面</div>
    <div class="color-yellow f36 pt-30" v-if="viewMode">身份证正面</div>
    <img src="@/assets/identity_back.png" id="backImg" @click="viewBackPic" class="pt-50">
    <div class="color-yellow f36 pt-30" @click="uploadBack" v-if="!viewMode">上传身份证反面</div>
    <div class="color-yellow f36 pt-30" v-if="viewMode">身份证反面</div>
    <div class="color-grey f30 pb-100 pt-50">温馨提示: 您上传的信息将用于简历审核</div>
    <div class="btn-submit" @click="submit" v-if="!viewMode">提交</div>
    <div class="f30 pt-26" v-if="!viewMode">
      提交表示您已了解并同意
      <router-link
        :to="{path: '/agreement',query: {
                name: '/register'
              }}"
      >
        <span class="color-danger">《抢单协议》</span>
      </router-link>
    </div>
    <div class="height100"></div>
  </div>
</template>
<script>
import "./register-identity.scss";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
export default {
  props: {
    viewMode: false, // 是否为仅查看状态
    frontPic: String, //接收父组件传递过来的图片地址
    backPic: String //接收父组件传递过来的图片地址
  },
  data() {
    return {
      photoBrowser: api.require("photoBrowser"), // 图片查看器
      frontImgSrc: "", //上传之后的正面图片地址
      backImgSrc: "" //上传之后的反面图片地址
    };
  },
  mounted() {
    if (this.frontPic) {
      document.getElementById("frontImg").src = this.frontPic;
    }
    if (this.backPic) {
      document.getElementById("backImg").src = this.backPic;
    }
  },
  methods: {
    // 通用上传方法
    uploadFile(successCallback) {
      api.actionSheet(
        {
          cancelTitle: "取消",
          buttons: ["相机", "相册"],
          style: {
            fontNormalColor: "#e9be2b",
            fontPressColor: "#e9be2b"
          }
        },
        function(ret, err) {
          if (ret.buttonIndex != 3) {
            var _sourceType = "";
            if (ret.buttonIndex == 1) {
              _sourceType = "camera";
            } else {
              _sourceType = "library";
            }
            api.getPicture(
              {
                sourceType: _sourceType,
                allowEdit: true,
                quality: 30
              },
              function(ret, err) {
                if (ret && ret.data) {
                  let url = "/qd/rest/information/upload";
                  let data = ret.data;
                  // loading 提示
                  Indicator.open("上传中...");
                  window.$api
                    .uploadFile(url, data)
                    .then(res => {
                      Indicator.close();
                      if (res.code === 200) {
                        successCallback && successCallback(res.body);
                      } else {
                        Toast("上传图片失败" + res.code);
                      }
                    })
                    .catch(e => {
                      Indicator.close();
                      Toast("上传图片失败" + JSON.stringify(e));
                    });
                } else {
                  Toast("您没有选择图片");
                }
              }
            );
          }
        }
      );
    },
    // 点击上传正面身份证
    uploadFront() {
      let _this = this;
      _this.uploadFile(body => {
        _this.frontImgSrc = body.prefix + body.fileUrl;
        _this.$emit("identity-front-img", _this.frontImgSrc);
        document.getElementById("frontImg").src = _this.frontImgSrc;
        Toast("上传图片成功");
      });
    },
    // 点击上传反面身份证
    uploadBack() {
      let _this = this;
      _this.uploadFile(body => {
        _this.backImgSrc = body.prefix + body.fileUrl;
        _this.$emit("identity-back-img", _this.backImgSrc);
        document.getElementById("backImg").src = _this.backImgSrc;
        Toast("上传图片成功");
      });
    },
    // 初始化查看图片组件
    initPhotoBrowser(image) {
      let _this = this;
      _this.photoBrowser.open(
        {
          images: [image],
          bgColor: "#000"
        },
        function(ret, err) {
          if (ret && ret.eventType == "click") {
            _this.photoBrowser.close();
          }
        }
      );
    },
    // 点击查看正面图片
    viewFrontPic() {
      // 本组件上传未跳转到父组件
      if (this.frontImgSrc) {
        this.initPhotoBrowser(this.frontImgSrc);
        return;
      }
      // 父组件传递
      if (this.frontPic) {
        this.initPhotoBrowser(this.frontPic);
        return;
      }
      // 如果没有上传过图片，点击上传
      if (!this.frontPic && !this.frontImgSrc) {
        this.uploadFront();
      }
    },
    // 点击查看反面图片
    viewBackPic() {
      // 本组件上传未跳转到父组件
      if (this.backImgSrc) {
        this.initPhotoBrowser(this.backImgSrc);
        return;
      }
      // 父组件传递
      if (this.backPic) {
        this.initPhotoBrowser(this.backPic);
        return;
      }
      // 如果没有上传过图片，点击上传
      if (!this.backPic && !this.backImgSrc) {
        this.uploadBack();
      }
    },
    // 点击提交
    submit() {
      this.$emit("submit");
    }
  }
};
</script>

