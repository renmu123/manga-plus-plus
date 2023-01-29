import { createRouter, createWebHistory } from "vue-router";
// import pool from "./pool";
// import order from "./order/index";
// import goods from "./goods/index";
// import HomeView from "../views/home/index.vue";
// import LoginView from "../views/login/index.vue";
// import { userInfoStore } from "../stores/user-store";
// import { getUserInfo } from "@/assets/js/api/user/info-api";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/views/Dashboard/index.vue"),
    },
    {
      path: "/library",
      name: "library",
      component: () => import("@/views/Library/index.vue"),
    },
    {
      path: "/comic",
      name: "comic",
      component: () => import("@/views/Comic/index.vue"),
    },
  ],
});

export default router;
