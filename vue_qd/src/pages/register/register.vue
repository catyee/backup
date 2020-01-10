<template>
  <div class="page-register-container">
    <div class="top-panel">
      <div class="common-header-container">
        <mt-header title="个人信息">
          <router-link to="/user-center" slot="left">
            <mt-button icon="back"></mt-button>
          </router-link>
        </mt-header>
        <!-- <div class="common-header-height"></div>
        <div class="phone-statusbar-height"></div>-->
      </div>

      <div class="register-content">
        <div class="top-line"></div>
        <!-- 注册流程icon -->
        <div class="progress-container">
          <div class="register-progress">
            <div class="line"></div>
            <div class="progress-item" :class="{active: step==1}" @click="step=1">
              <div class="circle"></div>
              <div class="text">个人信息</div>
            </div>
            <div class="progress-item" :class="{active: step==2}" @click="step=2">
              <div class="circle"></div>
              <div class="text">上传电工证</div>
            </div>
            <div class="progress-item" :class="{active: step==3}" @click="step=3">
              <div class="circle"></div>
              <div class="text">实名认证</div>
            </div>
          </div>
        </div>
      </div>
      <!-- register-content placeholder -->
      <div class="register-content-height"></div>
    </div>

    <!-- 注册信息 -->
    <div class="main-panel pt-64">
      <!-- 基本信息 -->
      <div class="base-container" v-if="step==1">
        <mt-field
          label="姓名"
          v-model="userMsg.name"
          :readonly="viewMode"
          :disabled="viewMode"
          placeholder="必填"
        ></mt-field>
        <mt-field
          label="性别"
          :readonly="true"
          v-model="userMsg.sex.name"
          @click.native="clickSheet(1)"
          :disabled="viewMode"
        ></mt-field>
        <mt-field
          label="身份证号"
          v-model="userMsg.idCard"
          placeholder="必填"
          :readonly="viewMode"
          :disabled="viewMode"
          :attr="{ maxlength: 18 }"
        ></mt-field>
        <mt-field
          label="年龄"
          v-model="userMsg.age"
          placeholder="必填"
          :readonly="viewMode"
          :disabled="viewMode"
          type="number"
        ></mt-field>
        <mt-field
          label="学历"
          v-model="userMsg.diploma"
          :readonly="true"
          :disabled="viewMode"
          placeholder="必选"
          @click.native="clickSheet(2)"
        ></mt-field>
        <mt-field
          label="户口所在地"
          v-model="userMsg.residence"
          :readonly="viewMode"
          :disabled="viewMode"
          placeholder="必填"
        ></mt-field>
        <mt-field
          label="现住址"
          v-model="nowDress "
          :readonly="true"
          :disabled="viewMode"
          placeholder="省市区"
          @click.native="selectAddress"
        ></mt-field>
        <mt-field
          label="现住址"
          v-model="userMsg.nowDressDetail"
          :readonly="viewMode"
          :disabled="viewMode"
          placeholder="街、号"
        ></mt-field>
        <mt-field
          label="紧急联系人"
          v-model="userMsg.emergencyPerson"
          :readonly="viewMode"
          :disabled="viewMode"
          placeholder="必填"
        ></mt-field>
        <mt-field
          label="紧急联系人电话"
          type="tel"
          v-model="userMsg.emergencyMobile"
          :readonly="viewMode"
          :disabled="viewMode"
          placeholder="必填"
        ></mt-field>
        <mt-field
          label="从业年限"
          type="number"
          v-model="userMsg.workYear"
          :readonly="viewMode"
          :disabled="viewMode"
          placeholder="必填"
        ></mt-field>
        <mt-field
          label="健康状况"
          v-model="userMsg.healthCondition"
          :readonly="true"
          :disabled="viewMode"
          placeholder="必选"
          @click.native="clickSheet(3)"
        ></mt-field>
        <mt-field
          label="现工作单位"
          v-model="userMsg.currentCompany"
          :readonly="viewMode"
          :disabled="viewMode"
          placeholder="必填"
        ></mt-field>
        <div class="height72"></div>
        <div class="btn-submit" @click="step=2" id="footer">下一步</div>
        <div class="height100"></div>
        <!-- 性别选择框 -->
        <mt-popup v-model="sexSheetVisible" position="bottom" id="sex-selector">
          <ul>
            <li @click="selectedSex({value: '1', name: '男'})">男</li>
            <li @click="selectedSex({value: '2', name: '女'})">女</li>
          </ul>
        </mt-popup>
        <!-- 学历选择框 -->
        <mt-popup v-model="eduSheetVisible" position="bottom" id="education-selector">
          <ul>
            <li @click="selectedEdu('本科及以上')">本科及以上</li>
            <li @click="selectedEdu('大专')">大专</li>
            <li @click="selectedEdu('中专')">中专</li>
            <li @click="selectedEdu('高中')">高中</li>
            <li @click="selectedEdu('初中')">初中</li>
            <li @click="selectedEdu('其他')">其他</li>
          </ul>
        </mt-popup>

        <!-- 健康状况选择框 -->
        <mt-popup v-model="healthSheetVisible" position="bottom" id="healthy-selector">
          <ul>
            <li @click="selectedHealth('较差')">较差</li>
            <li @click="selectedHealth('一般')">一般</li>
            <li @click="selectedHealth('良好')">良好</li>
            <li @click="selectedHealth('健康')">健康</li>
          </ul>
        </mt-popup>
      </div>
      <!-- 地址选择器 -->
      <address-selector
        @close-address-selector="closeAddressSelector"
        @get-address-value="getAddressValue"
        v-show="showAddressSelector"
      ></address-selector>
    </div>
    <!-- 电工证 -->
    <div v-if="step==2" class="main-panel pt-64">
      <keep-alive>
        <register-specialty
          v-on:change-step="step = 3"
          :specialty-pic="userMsg.specialtyPic"
          :view-mode="viewMode"
          v-on:specialty-img="getSpecialtyImg"
        />
      </keep-alive>
    </div>
    <!-- 身份证 -->
    <div v-if="step==3" class="main-panel pt-64">
      <keep-alive>
        <register-identity
          v-on:submit="submit"
          :front-pic="userMsg.idCardFrontPic"
          :back-pic="userMsg.idCardBackPic"
          :view-mode="viewMode"
          v-on:identity-front-img="getIdentityFrontImg"
          v-on:identity-back-img="getIdentityBackImg"
        />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import "./register.scss";
import RegisterIdentity from "@/components/register/register-identity";
import RegisterSpecialty from "@/components/register/register-specialty";
import { Toast } from "mint-ui";
import { MessageBox } from "mint-ui";
import CommonModule from "@/common/common.js";
import AddressSelector from "@/components/common/address-selector/address-selector";
export default {
  components: {
    RegisterIdentity,
    RegisterSpecialty,
    AddressSelector
  },
  created() {
    this.flag = this.$route.params.flag; // 从user-center状态传递过来，''表示填写注册信息，'1'表示查看注册信息，'2'表示既可查看也可修改
  
    // 仅可查看不可修改flag == 1
    if(this.flag == 1){
        this.viewMode = true;
    }
    // 如果flag存在，可以获取到用户信息
    if (this.flag) {
      this.getUserInfo();
      return;
    }
    let userMsg = $api.getStorage("userMsg");
    if (userMsg) {
      this.userMsg = userMsg;
    }
  },
  data() {
    return {
      flag: "", // 从user-center状态传递过来，''表示填写注册信息，'1'表示查看注册信息
      userId: '',
      viewMode: false, // 是否为仅查看状态
      step: 1, // 录入信息进度
      userMsg: {
        name: "", //姓名
        idCard: "", //身份证
        age: "", // 年龄
        residence: "", //户口所在地
        nowDressDetail: "", // 现住址详细地址
        nowDressProvince: "", // 现住址省
        nowDressCity: "", // 现住址市
        nowDressDistrict: "", // 现住址区
        diploma: "", // 学历
        emergencyPerson: "", // 紧急联系人
        emergencyMobile: "", //紧急联系人电话
        workYear: "", // 从业年限
        healthCondition: "", //健康状况
        currentCompany: "", // 现工作单位
        sex: { value: "1", name: "男" }, //性别选中
        specialtyPic: "", //电工证图片
        idCardFrontPic: "", // 身份证正面照片
        idCardBackPic: "" // 身份证反面照片
      },
      nowDress: "", // 省市区
      sexSheetVisible: false, // 性别选择下拉框显示
      eduSheetVisible: false, // 学历选择下拉框显示
      healthSheetVisible: false, // 健康状况选择下拉框显示
      showAddressSelector: false // 显示地址选择
    };
  },
  beforeRouteLeave(to, from, next) {
    // 仅为填写注册信息的情况下存储
    if (this.flag != 1) {
      $api.setStorage("userMsg", this.userMsg);
    }
    next();
  },
  methods: {
    // 查看状态下，获取注册信息
    getUserInfo() {
      let url = "/qd/rest/partTimer/info";
      let userId = $api.getStorage("userId");
      let data = {
        userId: userId
      };
      $api
        .get(url, data)
        .then(res => {
          if (!res || !res.code) {
            Toast("服务器错误");
            return;
          }
          if (res.code == 200 && res.body) {
            let data = res["body"];
            this.userMsg.name = data["partTimerName"]; // 姓名
            this.userMsg.idCard = data["idCard"]; // 身份证号码
            // 性别
            if (data["sex"] == 2) {
              this.sex = { value: "2", name: "女" };
            } else {
              this.sex = { value: "1", name: "男" };
            }
            this.userMsg.diploma = data["diploma"]; // 学历
            this.userMsg.age = data["age"]; // 学历
            this.userMsg.residence = data["residence"]; // 户口所在地
            this.userMsg.emergencyPerson = data["emergencyPerson"]; // 紧急联系人
            this.userMsg.emergencyMobile = data["emergencyNumber"]; // 紧急联系人电话
            this.userMsg.workYear = data["workYear"]; // 从业年限
            this.userMsg.healthCondition = data["healthy"]; // 健康状况
            this.userMsg.currentCompany = data["unit"]; // 现工作单位
            this.userMsg.specialtyPic = data["certification"]; // 电工证
            this.userMsg.idCardFrontPic = data["zCardPicture"]; // 身份证正面
            this.userMsg.idCardBackPic = data["fCardPicture"]; // 身份证反面
            this.userMsg.nowDressProvince = data["nowDressProvince"]; // 现住址省
            this.userMsg.nowDressCity = data["nowDressCity"]; // 现住址市
            this.userMsg.nowDressDistrict = data["nowDressDistrict"]; // 现住址区
            this.userMsg.nowDressDetail = data["nowDressDetail"]; // 现住址详细地址
            this.nowDress =
              this.userMsg.nowDressProvince +
              this.userMsg.nowDressCity +
              this.userMsg.nowDressDistrict;
          } else {
            Toast("获取信息失败" + res.code);
          }
        })
        .catch(e => {
          Toast("获取信息失败");
        });
    },
    // 提交注册信息
    submit() {
      let _this = this;
      // 提交之前验证数据
      let isChecked = this.checkData();
      if (isChecked) {
        MessageBox({
          title: "提示",
          message: "提交之后可以登录查看审核进度，审核时间至多5个工作日",
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonClass: "color-yellow",
          cancelButtonText: "再考虑一下",
          confirmButtonText: "确认",
          cancelButtonClass: "color-grey"
        }).then(action => {
          if (action == "cancel") {
          }
          if (action == "confirm") {
            this.submitData();
          }
        });
      }
    },
    submitData() {
      let data = {
        partTimerName: this.userMsg.name, // 姓名
        idCard: this.userMsg.idCard, //身份证号码
        sex: this.userMsg.sex["value"], // 性别
        diploma: this.userMsg.diploma, //学历
        age: this.userMsg.age, // 年龄
        nowDressProvince: this.userMsg.nowDressProvince, //现住址
        nowDressCity: this.userMsg.nowDressCity, //现住址
        nowDressDistrict: this.userMsg.nowDressDistrict, //现住址
        nowDressDetail: this.userMsg.nowDressDetail, //现住址
        residence: this.userMsg.residence, //户口所在地
        emergencyPerson: this.userMsg.emergencyPerson, //紧急联系人
        emergencyNumber: this.userMsg.emergencyMobile, //紧急联系人电话
        workYear: this.userMsg.workYear, //从业年限
        healthy: this.userMsg.healthCondition, //健康状况
        unit: this.userMsg.currentCompany, //现工作单位
        certification: this.userMsg.specialtyPic, //电工证
        zCardPicture: this.userMsg.idCardFrontPic, //身份证正面
        fCardPicture: this.userMsg.idCardBackPic //身份证反面
      };
      let url = "/qd/rest/information/addInformation";
      if(this.flag == 2) {
        url = '/qd/rest/information/update';
        data['partTimerId'] = $api.getStorage('partTimerId');
      }
      window.$api
        .post(url, data)
        .then(res => {
          if (res.code === 200) {
            Toast("提交成功");
            // 注册成功后，清空暂存信息
            $api.setStorage("userMsg", null);
            this.$router.push("/user-center");
          } else if (res.code == 1501) {
            Toast("提交失败,该身份证号已经被注册。");
          } else {
            Toast("提交失败" + res.code);
          }
        })
        .catch(e => {
          Toast("提交失败" + JSON.stringify(e));
        });
    },
    // 验证身份证号码
    checkIdCard() {
      let idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!idCardReg.test(this.userMsg.idCard)) {
        Toast("身份证格式不正确");
        return false;
      }
      return true;
    },
    // 验证数据
    checkData() {
      // 验证姓名
      if (!this.userMsg.name) {
        this.step = 1;
        Toast("请输入姓名");
        return false;
      }
      // 验证年龄
      if (!this.userMsg.age) {
        this.step = 1;
        Toast("请输入年龄");
        return false;
      }
      if (this.userMsg.age <= 0 || this.userMsg.age > 90) {
        this.step = 1;
        Toast("年龄不合法");
        return false;
      }
      // 验证身份证
      if (!this.userMsg.idCard) {
        this.step = 1;
        Toast("请输入身份证");
        return false;
      }
      // 验证身份证格式是否正确
      if (!this.checkIdCard()) {
        this.step = 1;
        return false;
      }
      // 验证学历
      if (!this.userMsg.diploma) {
        this.step = 1;
        Toast("请输入学历");
        return false;
      }
      // 验证户口所在地
      if (!this.userMsg.residence) {
        this.step = 1;
        Toast("请输入户口所在地");
        return false;
      }

      // 验证现住址

      if (!this.userMsg.nowDressProvince || !this.userMsg.nowDressDistrict) {
        this.step = 1;
        Toast("请选择现住址");
        return false;
      }
        // 验证现住址详细地址
      if (!this.userMsg.nowDressDetail) {
        this.step = 1;
        Toast("请填写现住址详细地址");
        return false;
      }
      // 验证紧急联系人
      if (!this.userMsg.emergencyPerson) {
        this.step = 1;
        Toast("请输入紧急联系人");
        return false;
      }
      // 验证紧急联系人电话
      if (!this.userMsg.emergencyMobile) {
        this.step = 1;
        Toast("请输入紧急联系人电话");
        return false;
      }
      // 验证从业年限
      if (!this.userMsg.workYear) {
        this.step = 1;
        Toast("请输入从业年限");
        return false;
      }

      // 验证健康状况
      if (!this.userMsg.healthCondition) {
        this.step = 1;
        Toast("请输入健康状况");
        return false;
      }
      // 验证现工作单位
      if (!this.userMsg.currentCompany) {
        this.step = 1;
        Toast("请输入现工作单位");
        return false;
      }

      // 验证电工证图片
      if (!this.userMsg.specialtyPic) {
        this.step = 2;
        Toast("请上传电工证");
        return false;
      }
      // 验证身份证正面图片
      if (!this.userMsg.idCardFrontPic) {
        this.step = 3;
        Toast("请上传身份证正面图片");
        return false;
      }
      // 验证身份证反面图片
      if (!this.userMsg.idCardBackPic) {
        this.step = 3;
        Toast("请上传身份证反面图片");
        return false;
      }
      return true;
    },
    // 点击下拉框
    clickSheet(sheet) {
      if (this.flag == 1) {
        return;
      }
      switch (sheet) {
        case 1:
          this.sexSheetVisible = true;
          break;
        case 2:
          this.eduSheetVisible = true;
          break;
        case 3:
          this.healthSheetVisible = true;
          break;
      }
    },
    // 选中性别
    selectedSex(sex) {
      this.userMsg.sex = sex;
      this.sexSheetVisible = false;
    },
    // 选中学历
    selectedEdu(edu) {
      this.userMsg.diploma = edu;
      this.eduSheetVisible = false;
    },
    // 选中健康状况
    selectedHealth(health) {
      this.userMsg.healthCondition = health;
      this.healthSheetVisible = false;
    },

    // 获取电工证图片
    getSpecialtyImg($event) {
      this.userMsg.specialtyPic = $event;
    },

    // 获取身份证正面照片
    getIdentityFrontImg($event) {
      this.userMsg.idCardFrontPic = $event;
    },
    // 获取身份证反面照片
    getIdentityBackImg($event) {
      this.userMsg.idCardBackPic = $event;
    },
    // 选择户口所在地
    selectAddress() {
      if (this.flag == 1) {
        return;
      }
      this.showAddressSelector = true;
    },

    // 关闭地址选择
    closeAddressSelector() {
      this.showAddressSelector = false;
    },
    // 获取地址
    getAddressValue(province, city, county) {
      if (city == "市辖区") {
        city = "";
      }
      this.nowDress = province + city + county;
      this.userMsg.nowDressProvince = province;
      this.userMsg.nowDressCity = city;
      this.userMsg.nowDressDistrict = county;
    }
  },
  mounted() {
    CommonModule.topAdaption(".mint-header");
    CommonModule.bottomAdaption("sex-selector");
    CommonModule.bottomAdaption("education-selector");
    CommonModule.bottomAdaption("healthy-selector");
  }
};
</script>

