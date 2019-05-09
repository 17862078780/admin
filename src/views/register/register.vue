<template>
  <div>
    <div class="register-wrapper">
      <div id="register">
        <p class="title">用户注册</p>
        <el-form :model="user" :rules="rules" ref="user" label-width="100px" class="demo-ruleForm">
          <!-- 
    private String avatar;//头像
          private String address;//住址-->

          <el-form-item label="上传头像">
            <el-upload
              class="avatar-uploader"
              action="http://gwjyhs.com/upload.php"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-button type="primary" style="width:70%;">点击选择图片</el-button>
              <img v-if="user.avatar" :src="user.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="user.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="user.checkPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="user.sex" size="medium">
              <el-radio border label="男"></el-radio>
              <el-radio border label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请输入手机号" prop="mobile">
            <el-input v-model="user.mobile"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker v-model="user.birthday" type="date" placeholder="选择您的出生日期"></el-date-picker>
          </el-form-item>
          <!-- 选择地址 -->
          <el-form-item label="地址" prop="address">
            <el-cascader
              size="large"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-form-item label="自己爱好" prop="desc">
              <el-input type="textarea" v-model="user.interest"></el-input>
            </el-form-item>
            <el-button type="primary" @click="submitForm('user')" style="width:100%;">注册</el-button>
            <p class="login" @click="gotoLogin">已有账号？立即登录</p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
import reqApi from "@/api/register";
export default {
  name: "Register",
  data() {
    var checkTel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else if (!this.checkMobile(value)) {
        callback(new Error("手机号码不合法"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.user.checkPass !== "") {
          this.$refs.user.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.user.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 选择地址
      options: regionData,
      selectedOptions: [],
      flag: true,
      user: {
        username: "",
        password: "", //密码
        checkPass: "",
        sex: "男",
        avatar:
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557375496212&di=a3295129e3f4c8ae71bfe25c847ce1b6&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F69ad7a731f43d4b8729f1a2fbe65c43801ca0f033250-EV1vMf_fw658", //头像
        mobile: "", //手机号
        birthday: "", //生日
        interest: "", //爱好
        address: "" //地址
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        mobile: [{ validator: checkTel, trigger: "change" }],
        password: [
          { validator: validatePass, trigger: "blur" },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{4,16}$/,
            message:
              "密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 4 - 16位"
          }
        ],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请选择您的出生日期",
            trigger: "change"
          }
        ],
        address: [{ required: true, message: "请选择出生日期", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 验证手机号
    checkMobile(str) {
      let re = /^1\d{10}$/;
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    // <!--提交注册-->
    submitForm(user) {
      this.$refs[user].validate(valid => {
        if (valid) {
          reqApi.register(this.user).then(response => {
            this.$message({
              message: response.message,
              type: response.flag ? "success" : "error"
            });
            if (response.flag) {
              // gologin
              this.gotoLogin();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // <!--进入登录页-->
    gotoLogin() {
      this.$router.push({
        path: "/login"
      });
    },
    // 用户头像上传
    handleAvatarSuccess(res, file) {
      console.log(URL.createObjectURL(file.raw));
      this.user.avatar = URL.createObjectURL(file.raw);
    },
    // 地址
    handleChange(value) {
      this.user.address =
        CodeToText[value[0]] + CodeToText[value[1]] + CodeToText[value[2]];
      // console.log(this.user.address)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style scoped>
.title {
  font-size: 26px;
  line-height: 50px;
  font-weight: bold;
  margin: 10px;
  text-align: center;
}
.login {
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #1ab2ff;
  cursor: pointer;
  text-align: left;
  text-indent: 8px;
  width: 160px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style scoped>
