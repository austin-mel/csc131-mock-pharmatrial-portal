import { createRouter, createWebHistory } from "vue-router";

import { routes } from "./application-routes.ts";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router };
