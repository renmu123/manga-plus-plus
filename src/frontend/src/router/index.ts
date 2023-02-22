import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/views/Dashboard/index.vue"),
    },
    {
      path: "/library/:id",
      name: "library",
      component: () => import("@/views/Library/index.vue"),
    },
    {
      path: "/library/:libraryId/:id",
      name: "comic",
      component: () => import("@/views/Comic/index.vue"),
    },
    {
      path: "/chapter/:id",
      name: "chapter",
      component: () => import("@/views/Chapter/index.vue"),
    },
    {
      path: "/chapter/images/:id",
      name: "images",
      component: () => import("@/views/ImageView/index.vue"),
    },
    {
      path: "/setting",
      name: "setting",
      component: () => import("@/views/Setting/index.vue"),
    },
  ],
});

export default router;
