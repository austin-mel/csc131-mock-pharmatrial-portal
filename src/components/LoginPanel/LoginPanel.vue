<script setup lang="ts">
import { ActionButton, PortalCard } from "@/components";
import { ref, watch } from "vue";
import { useAuthStore } from "@/stores";
const auth = useAuthStore();
const email = ref("doctor@jh.example");
const password = ref("jh-doctor-demo");
const demoCredentials = {
    "jh-doctor": { email: "doctor@jh.example", password: "jh-doctor-demo" },
    "jh-admin": { email: "admin@jh.example", password: "jh-admin-demo" },
    fda: { email: "admin@fda.example", password: "fda-demo" },
    bavaria: { email: "admin@bavaria.example", password: "bavaria-demo" },
} as const;
watch(
    () => auth.selectedPortalId,
    (portalId) => {
        email.value = demoCredentials[portalId].email;
        password.value = demoCredentials[portalId].password;
    },
);
function signIn() {
    auth.login(email.value, password.value);
}
</script>

<template>
    <div
        class="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-3 py-6"
    >
        <section
            class="relative z-[1] w-[440px] max-w-full rounded-lg bg-surface px-4 py-5 shadow-app-lg xs:px-5 xs:py-7 sm:px-10 sm:py-11"
        >
            <div
                class="mb-1 font-serif text-[19px] leading-tight text-ink xs:text-[22px]"
            >
                Clinical Trial
                <span class="italic text-fda"> Data Exchange </span>
            </div>
            <div
                class="mb-4 font-mono text-[9px] uppercase tracking-[.12em] text-muted xs:mb-7 xs:text-[10px] xs:tracking-[.14em]"
            >
                CSUS Dream Team · Sponsored by Vendia
            </div>
            <div class="mb-4 grid grid-cols-2 gap-2 xs:mb-[22px] xs:gap-2.5">
                <PortalCard
                    v-for="portal in auth.portals"
                    :key="portal.id"
                    :portal="portal"
                    :selected="portal.id === auth.selectedPortalId"
                    @select="auth.selectPortal"
                />
            </div>
            <label
                class="mb-[5px] block text-[11px] font-semibold uppercase tracking-[.08em] text-muted"
            >
                Email Address
            </label>
            <input
                v-model="email"
                class="mb-3.5 min-h-10 w-full rounded-[5px] border-[1.5px] border-rule bg-bg px-[13px] py-2.5 text-base text-ink focus:border-fda focus:bg-surface focus:outline-none sm:text-sm"
                type="email"
                placeholder="username@institution.org"
            />
            <label
                class="mb-[5px] block text-[11px] font-semibold uppercase tracking-[.08em] text-muted"
            >
                Password
            </label>
            <input
                v-model="password"
                class="mb-3.5 min-h-10 w-full rounded-[5px] border-[1.5px] border-rule bg-bg px-[13px] py-2.5 text-base text-ink focus:border-fda focus:bg-surface focus:outline-none sm:text-sm"
                type="password"
                placeholder="password"
            />
            <p
                v-if="auth.error"
                class="mb-3 text-center text-xs font-semibold text-bav"
            >
                {{ auth.error }}
            </p>
            <ActionButton variant="primary" block @click="signIn">
                Sign In
            </ActionButton>
            <p class="mt-3 text-center text-[11px] text-muted">
                Use the provided portal demo credentials to login.
            </p>
        </section>
    </div>
</template>
