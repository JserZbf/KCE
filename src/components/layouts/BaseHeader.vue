<template>
  <div class="main flex-ac-sb">
    <img src="../../assets/img/header/bg.png" alt="" />
    <div class="leftName">
      <h4 class="texL">{{ $t("kone") }}</h4>
    </div>
    <div class="rightTab flex">
      <div class="box2 flex-ac-sa">
        <el-popconfirm :title="langMsg" @confirm="onLang()">
          <template #reference>
            <img
              class="flex-c-c icon"
              src="@/assets/img/header/translate.png"
              @click="seleteLang"
            />
          </template>
        </el-popconfirm>
        <el-popover placement="bottom" :width="174" trigger="click">
          <template #reference>
            <img
              class="flex-c-c icon"
              style="width: 24px; height: 24px"
              src="@/assets/img/header/android.png"
            />
          </template>
          <div class="flex-c-c">扫码下载APP</div>
          <div class="qrBox" style="width: 150px; height: 150px">
            <qrcode-vue
              class="qrcode"
              :value="qrcode"
              size:300
              style="width: 150px; height: 150px"
            ></qrcode-vue>
          </div>
        </el-popover>
        <img
          class="flex-c-c icon"
          src="@/assets/img/header/logout.png"
          alt=""
          @click="loginOut"
        />
        <!-- <user class="flex-c-c" theme="outline" size="24" fill="#eee" />
        <logout
          class="flex-c-c"
          theme="outline"
          size="24"
          fill="#eee"
         
        /> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits } from "vue";
import { toggleDark } from "~/composables";
import { Logout, User, VolumeNotice } from "@icon-park/vue-next";
import QrcodeVue from "qrcode.vue";
import { baseUrl } from "@/utils/baseUrl";
var qrcode = ref("123");
// qrcode.value = baseUrl + "/api/ces/File/download?fileId=ces_app";
qrcode.value =
  "http://10.106.21.10:85" + "/api/ces/File/download?fileId=ces_app";

// new QRCode(qrcode.value, {
//   text: "https://blog.csdn.net/weixin_42601136", // 需要转换为二维码的内容
//   width: 100,
//   height: 100,
//   colorDark: "#000000",
//   colorLight: "#ffffff",
// //   correctLevel: QRCode.CorrectLevel.H,
// });
var langMsg = ref("切换到英文吗？");
const emit = defineEmits("headChange");
const loginOut = () => {
  localStorage.clear();
  emit("headChange", false);
};

let language = localStorage.getItem("lang");
console.log(language);
if (language == "zhCN") {
  langMsg.value = "切换到英文吗？";
} else {
  langMsg.value = "切换到中文吗？";
}
const seleteLang = () => {
  console.log(language);
  if (language == "zhCN") {
    langMsg.value = "Switch to English?";
  } else {
    langMsg.value = "切换到中文吗？";
  }
};
const onLang = () => {
  if (language == "zhCN") {
    localStorage.setItem("lang", "en");
  } else {
    localStorage.setItem("lang", "zhCN");
  }
  location.reload();
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 80px;
  position: relative;
  overflow: hidden;
  & > img {
    width: 100%;
    height: 80px;
    position: absolute;
    z-index: 0;
    right: 0;
    left: 0px;
    top: 0px;
    bottom: 0;
  }
  .leftName {
    width: 280px;
    padding: 22px 0;
    margin-left: 56px;
    position: relative;
    font-size: 26px;
    z-index: 1;
    color: #7e7e7e;
    // position: absolute;
    // left: 56px;
    // top: 0;
    // bottom: 0;
    img {
      width: 80px;
      height: 100%;
    }
  }
  .rightTab {
    // position: absolute;
    // right: 0;
    // top: 0;
    // bottom: 0;
    width: 14.5%;
    .box {
      width: 100px;
      height: 80px;
      background: #eaf4ff;
      z-index: 1;
    }
    .box2 {
      //   width: 147px;
      width: 100%;
      height: 80px;
      background: linear-gradient(275deg, #3c8bff 0%, #b7e9ff 100%);
      // padding: 28px;
      box-sizing: border-box;
      z-index: 1;
      .qrBox {
        width: 200px;
        height: 200px;
      }
      .qrCode {
        width: 90px;
        height: 90px;
      }
      .icon {
        width: 28px;
        height: 28px;
      }
      .i-icon {
        width: 50%;
        height: 100%;
      }
    }
  }
}
</style>
