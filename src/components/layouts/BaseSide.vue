<template>
  <div class="menuBox">
    <header class="head texC flex-bc cfff">
      <img class="logo" src="@/assets/tl.svg" />
    </header>
    <el-menu
      style="width: 100%; height: 100%"
      class="el-menu-vertical-demo flex1"
      router
      background-color="transparent"
      text-color="#fff"
      :collapse="isCollapse"
      :default-active="$router.currentRoute.value.fullPath"
      :default-openeds="thatRouteArr"
      :unique-opened="true"
      @open="handleOpen"
      @close="handleClose"
      @select="handleThat"
    >
      <template v-for="(item, idx) in roleRouter" :key="idx">
        <el-menu-item :index="item.path" v-if="item.name">
          <template #title>
            <div class="title">
              <span>{{ $t(`sideName.${item.name}`) }}</span>
              <!-- <span>{{ item.name }}</span> -->
            </div>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script setup>
import { ref, onMounted, watchEffect, watch } from "vue";
import { useRouter } from "vue-router";
import { routes } from "@/router/index.js";
import {
  Viewfinder,
  History,
  Server,
  User,
  Config,
  Log,
} from "@icon-park/vue-next";
import router from "~/router";
// import { useI18n } from "vue-i18n";
// const { t } = useI18n();

var user = localStorage.getItem("$user");
if (user) {
  user = JSON.parse(user);
  console.log("user", user);
}

const isCollapse = ref(false);
const $router = useRouter();
var thatRoute = ref("");
var thatRouteArr = ref([]);

routes.forEach((el) => {
  if (el.path == "/") {
    el.path = "/dispose/seat";
  }
});
const roleRouter = ref([]);
roleRouter.value = JSON.parse(JSON.stringify(routes));
let routerArr = [];
roleRouter.value?.forEach((el) => {
  let list = JSON.parse(JSON.stringify(el));
  let info = list?.hasRole?.find((item) => item == user.role);
  if (info) {
    routerArr.push(el);
  }
});
roleRouter.value = routerArr;
// if (user.role == "CEP") {
//   roleRouter.value = [
//     {
//       path: "/history/snap",
//       name: "CEP拍照记录",
//       icon: "history",
//       hasRole: ["admin", "staff"],
//     },
//   ];
// }

// if (user.role == "CCA") {
//   roleRouter.value = [
//     {
//       path: "/history/cca",
//       name: "CCA拍照记录",
//       icon: "history",
//       hasRole: ["admin", "staff"],
//     },
//   ];
// }
const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath);
};
const handleThat = (key, keyPath) => {
  thatRoute.value = key;
  // console.log(key, keyPath);
};
watchEffect(() => {
  // console.log('watchEffect:', $router.currentRoute.value.path);
  thatRoute.value = $router.currentRoute.value.path;
});
</script>
<style lang="scss" scoped>
.head {
  position: sticky;
  position: -webkit-sticky;
  height: 190px;
  top: 0;
  & > img {
    width: 100%;
    height: 100%;
  }
  .logo {
    width: 152px;
    height: 71px;
    margin-top: 41px;
  }
}
.menuBox {
  color: #fff;
  flex-shrink: 0;
  width: 198px;
  height: 100%;
  overflow: hidden;
  border-radius: 20px;
  background: url("@/assets/img/side/bg.jpg") no-repeat;
  background-size: 100% 100%;
  box-shadow: 0px 3px 16px 1px rgba(0, 0, 0, 0.1);

  :deep(.el-menu-vertical-demo) {
    height: calc(100% - 190px) !important;
    overflow-y: scroll;
    border: 0;
    .el-menu-item * {
      vertical-align: baseline;
    }
    .el-drawer:focus {
      outline: none;
    }
    .el-cascader-menu__hover-zone path {
      display: none;
    }
    .is-active {
      .title {
        border-radius: 8px;
        background: linear-gradient(
          178deg,
          #b5d7fe 0%,
          #5aa9fc 100%
        ) !important;
        color: #468ef4;
      }
    }

    .title {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      // justify-content: center;
      font-size: 16px;
      font-weight: 500;
      color: #fff;
      padding: 0 10px;

      .icon {
        flex-shrink: 0;
        font-size: 20px;
        margin-right: 5px;
        span {
          vertical-align: baseline !important;
        }
      }
    }
    .el-sub-menu {
      .el-sub-menu__title {
        padding: 0;
        color: #fff;
        display: flex;
      }
    }

    .el-menu-item-group__title {
      padding: 0;
    }
    .el-menu-item {
      background: none;
      color: #b8dafe;
      font-size: 14px;
      height: 38px;
      padding: 0 10px;
      box-sizing: border-box;
      margin-bottom: 12px;
    }
  }

  .el-menu-item {
    width: 100%;
    position: relative;
  }
  .nowBackground {
    height: 38px;
    font-size: 16px;
    color: #fff;
    border-radius: 21px 0px 0px 21px;
  }
  .icons {
    width: 30px;
    height: 30px;
  }
}
</style>

<style lang="scss">
// 有二级菜单的标题时鼠标悬停的颜色
.el-sub-menu__title.el-tooltip__trigger.el-tooltip__trigger:hover {
  color: red;
}
</style>
