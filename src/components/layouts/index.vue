<template>
  <div class="appMain" v-if="loginType">
    <BaseSide />
    <div class="appRightContent flex flex-y">
      <BaseHeader class="flex0" @headChange="headChange"/>
      <BaseTag class="flex0" />
      <div class="appContent flex1">
        <router-view class="appRouterView" />
      </div>
    </div>
  </div>
  <Login class="appRouterView" @loginChange="isLogin" v-else />
</template>
<script setup>
import { ref } from 'vue'
const loginType = ref(false);
var loginForm = localStorage.getItem('$user')
if (loginForm) {
  loginType.value = true;
} else {
  loginType.value = false;
}
const isLogin = (is) => {
  loginType.value = is;
}
const headChange = (is) => {
  loginType.value = is;
}
</script>
  