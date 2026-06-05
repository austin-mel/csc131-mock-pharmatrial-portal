import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores";
import { routes } from "./application-routes";
import { Routes } from "./allowed-routes";

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: Routes.LOGIN };
    if (to.name === Routes.LOGIN && auth.isLoggedIn)
        return { name: Routes.DASHBOARD };
    return true;
});

router.afterEach((to) => {
    if (typeof to.meta.title === "string") document.title = to.meta.title;
});

export { router };
