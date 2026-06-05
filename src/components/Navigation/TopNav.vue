<script setup lang="ts">
import { UserAvatar } from "@/components";
import { useRouter } from "vue-router";
import { SvgIcon } from "@/assets";
import { useAuthStore } from "@/stores";
import { Routes } from "@/router";

const auth = useAuthStore();
const portal = auth.currentPortal;
const router = useRouter();
defineEmits<{ menu: [] }>();

function logout() {
    auth.logout();
    router.replace({ name: Routes.LOGIN });
}
</script>

<template>
    <nav
        class="sticky top-0 z-[200] flex min-h-14 items-center gap-3 bg-ink px-4 py-2 shadow-[0_2px_12px_rgba(0,0,0,.18)] md:h-14 md:gap-5 md:px-7 md:py-0 max-[480px]:gap-2 max-[480px]:px-3"
    >
        <button
            class="grid size-10 shrink-0 place-items-center rounded-md border border-white/10 bg-white/10 text-white/75 shadow-[0_2px_8px_rgba(0,0,0,.16)] transition-colors hover:bg-white/15 hover:text-white lg:hidden"
            type="button"
            aria-label="Open clinical trials menu"
            @click="$emit('menu')"
        >
            <SvgIcon name="menu" />
        </button>
        <div
            class="min-w-0 flex-1 truncate font-serif text-[17px] text-white max-[480px]:text-[15px]"
        >
            Clinical Trial
            <span class="italic text-white/40 max-[480px]:hidden">
                Data Exchange
            </span>
        </div>
        <div
            class="hidden font-mono text-[11px] uppercase tracking-[.12em] text-white/45 sm:block"
        >
            {{ portal?.label }}
        </div>
        <div
            v-if="portal"
            class="flex shrink-0 items-center gap-2.5 text-[13px] text-white/70 max-[480px]:gap-2"
        >
            <UserAvatar :text="portal.abbr" :color="portal.color" />
            <span class="hidden sm:inline">
                {{ portal.user }}
            </span>
            <button
                class="rounded border-0 bg-white/10 px-2.5 py-[5px] font-mono text-[10px] uppercase tracking-[.1em] text-white/60 max-[480px]:px-2"
                @click="logout"
            >
                Logout
            </button>
        </div>
    </nav>
</template>
