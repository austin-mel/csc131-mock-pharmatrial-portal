import type { RouteRecordRaw } from "vue-router";
import { AccountView, DashboardView, LoginView, NotFoundView } from "@/views";

import { Routes } from "./allowed-routes.ts";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: Routes.LOGIN,
    component: LoginView,
    meta: {
      title: "Pharmatrial | Sign In",
    },
  },
  {
    path: "/dashboard",
    name: Routes.DASHBOARD,
    component: DashboardView,
    meta: {
      title: "Dashboard",
    },
  },
  {
    path: "/account",
    name: Routes.ACCOUNT,
    component: AccountView,
    meta: {
      title: "Account Information",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: Routes.NOT_FOUND,
    component: NotFoundView,
  },
];
