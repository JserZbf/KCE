import { createRouter, createWebHashHistory } from "vue-router";
const routerHistory = createWebHashHistory();

import Dashboard from "@/view/dashboard/index.vue";
import DisposeSeat from "@/view/dispose/seat.vue";
import Monitor from "@/view/dispose/monitor.vue";
import User from "@/view/user/index.vue";
import Flow from "@/view/flow/index.vue";
import CEP from "@/view/history/CEP.vue";
import CCA from "@/view/history/CCA.vue";
import CES from "@/view/history/CES.vue";
import Notification from "@/view/notification/index.vue";

import DelCEP from "@/view/history/CEPR.vue";
import DelCES from "@/view/history/CESR.vue";

// var name = "CEP拍照记录";
// if (userInfo?.role == "CEP") {
//   name = "CEP拍照记录";
// }

export const routes = [
  {
    path: "/",
    redirect: {
      name: "dashboard",
    },
    hasRole: [
      "admin",
      "staff",
      "CEP",
      "CCA",
      "superCES",
      "superCCA",
      "superCEP",
    ],
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    hasRole: [
      "admin",
      "staff",
      "CEP",
      "CCA",
      "superCES",
      "superCCA",
      "superCEP",
    ],
  },
  {
    path: "/dispose/seat",
    name: "seat",
    component: DisposeSeat,
    hasRole: ["admin"],
  },
  {
    path: "/dispose/flow",
    name: "flow",
    component: Flow,
    hasRole: ["admin", "staff", "superCES"],
  },
  {
    path: "/history/CCA",
    name: "CCA",
    component: CCA,
    hasRole: ["admin", "staff", "CCA", "superCCA"],
  },
  {
    path: "/history/CEP",
    name: "CEP",
    icon: "history",
    component: CEP,
    hasRole: ["admin", "staff", "CEP", "superCEP"],
  },
  //   {
  //     path: "/history/CEPR",
  //     name: "CEP操作记录",
  //     icon: "history",
  //     component: DelCEP,
  //     hasRole: ["admin", "staff","CEP"],
  //   },
  //   {
  //     path: "/history/CEPD",
  //     name: "CEP删除配置",
  //     icon: "history",
  //     component: CEPD,
  //     hasRole: ["admin", "staff","CEP"],
  //   },
  {
    path: "/history/CES",
    name: "CES",
    component: CES,
    hasRole: ["admin", "staff", "CES", "superCES"],
  },
  {
    path: "/history/log",
    name: "log",
    component: DelCES,
    // hasRole: ["admin", "staff", "CES", "superCES","superCCA","superCEP"],
    hasRole: ["admin", "superCES", "superCCA", "superCEP"],
  },
  {
    path: "/dispose/delete",
    name: "delete",
    // icon: "history",
    component: Monitor,
    hasRole: ["admin", "superCES", "superCCA", "superCEP"],
  },
  {
    path: "/dispose/notification",
    name: "notification",
    // icon: "history",
    component: Notification,
    // hasRole: ["admin"],
    // hasRole: ["admin", "staff", "CES", "superCES","superCCA","superCEP"],
    hasRole: ["admin", "superCES", "superCCA", "superCEP"],
  },

  {
    path: "/dispose/user",
    name: "user",
    component: User,
    hasRole: ["admin"],
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/components/error/404.vue"),
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
    hidden: "true",
  },
];

// 公共路由
const router = createRouter({
  history: routerHistory,
  routes: routes,
});

//前置路由
router.beforeEach((from, to, next) => {
  //   let userInfo = localStorage.getItem("$user");
  //   userInfo = JSON.parse(userInfo);
  next();

  //   if (userInfo.role == "CEP") {
  //     if (from.name != "CEP拍照记录") {
  //     } else {
  //       next();
  //     }
  //   } else {
  //     next();
  //   }
});

export default router;
