<template>
  <!-- 电工证 -->
  <div class="common_flex-center bg-white component-specialty-container pr-40 pl-40">
    <div class="f30 pb-50" v-if="!viewMode">点击上传电工证证件信息</div>
    <img src="@/assets/specialty.png" id="specialtyImg" @click="viewPic">
    <div class="color-yellow f36 pt-30" @click="clickSpecialty" v-if="!viewMode">点击上传</div>
    <div class="color-grey f30 pb-150 pt-50">温馨提示: 您上传的信息将用于简历审核</div>
    <div class="btn-submit" @click="$emit('change-step')">下一步</div>
    <div class="height100"></div>
  </div>
</template>
<script>
import "./register-specialty.scss";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";

export default {
  props: {
    specialtyPic: String, //接收父组件传递过来的图片地址
    viewMode: false,  // 是否为仅查看状态
  },
  data() {
    return {
      photoBrowser: api.require("photoBrowser"),  // 图片查看器
      specialtyImgSrc: "" //上传之后的图片地址
    };
  },
  mounted() {
    if (this.specialtyPic) {
      document.getElementById("specialtyImg").src = this.specialtyPic;
    }
  },
  methods: {
    // 点击上传电工证
    clickSpecialty() {
      let _this = this;
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
                      if (res.code == 200) {
                        _this.specialtyImgSrc =
                          res.body.prefix + res.body.fileUrl;
                        _this.$emit("specialty-img", _this.specialtyImgSrc);
                        document.getElementById("specialtyImg").src =
                          _this.specialtyImgSrc;
                        Toast("上传图片成功");
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
    // 点击查看图片
    viewPic() {
      // 本组件上传未跳转到父组件
      if (this.specialtyImgSrc) {
        this.initPhotoBrowser(this.specialtyImgSrc);
        return;
      }
      // 父组件传递
      if (this.specialtyPic) {
        this.initPhotoBrowser(this.specialtyPic);
        return;
      }
      // 如果没有上传过图片，点击上传
      if(!this.specialtyPic && !this.specialtyImgSrc){
        this.clickSpecialty();
      }
    }
  }
};
</script>

