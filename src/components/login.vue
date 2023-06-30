<template>
  <div class="login-container">
    <div class="loginBox flex-c-c flex-y">
      <div class="title-container">
        <h3 class="title">{{ $t("login.title") }}</h3>
      </div>
      <el-input
        @keyup.enter.native="handleLogin"
        v-model="loginForm.username"
        :placeholder="$t('login.userName')"
      />
      <el-input
        @keyup.enter.native="handleLogin"
        v-model="loginForm.password"
        type="password"
        :placeholder="$t('login.password')"
      />
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >{{ $t("login.sub") }}</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, defineEmits } from "vue";
import { login } from "@/api/index";
import cookie from "@/utils/cookie.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import md5 from "js-md5";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const passwordType = ref("password");
const emit = defineEmits("loginChange");
const loginForm = ref({
  userName: "",
  password: "",
});
// emit("loginChange", true);
const router = useRouter();
const handleLogin = () => {
  let postData = JSON.parse(JSON.stringify(loginForm));
  console.log(postData);
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.error(t('msg.login_false'));
    return;
  }
  login({
    userName: loginForm.value.username,
    password: md5(loginForm.value.password),
  }).then((res) => {
    console.log("userlogin", res);
    let $user = res.data;
    localStorage.setItem("$user", JSON.stringify(res.data));
    router.replace({ path: "/dashboard" });
    emit("loginChange", true);
  });
};
</script>

<style lang="scss" scoped>
// $bg: #2d3a4b;
$bg: linear-gradient(178deg, #3c8bff 0%, #79dcf5 100%);
$dark_gray: #889aa4;
$light_gray: #eee;
.loginBox {
  position: relative;
  width: 360px;
  max-width: 100%;
  padding: 160px 35px 0;
  margin: 0 auto;
  overflow: hidden;

  .el-input {
    margin-bottom: 20px;
  }
}
.login-container {
  min-height: 100%;
  width: 100%;
  //   background-color: $bg;
  background: linear-gradient(178deg, #3c8bff 0%, #79dcf5 100%) !important;
  overflow: hidden;

  .login-form {
    background: rgb(0, 67, 111) !important;
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
