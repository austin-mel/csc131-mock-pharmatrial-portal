import type { RouteRecordRaw } from 'vue-router';
import { DashboardView, LoginView, NotFoundView } from '@/views';
import { Routes } from './allowed-routes';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: Routes.LOGIN,
    component: LoginView,
    meta: {
      title: 'Pharmatrial | Sign In',
      public: true,
    },
  },
  {
    path: '/dashboard',
    name: Routes.DASHBOARD,
    component: DashboardView,
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: Routes.NOT_FOUND,
    component: NotFoundView,
    meta: {
      title: 'Page Not Found',
      public: true,
    },
  },
];
