<script setup lang="ts">
import { ref, watch } from "vue";
import ActionButton from "../ActionButton/ActionButton.vue";
import PortalCard from "../PortalCard/PortalCard.vue";
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
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1a1714]"
  >
    <section
      class="relative z-[1] w-[440px] max-w-[calc(100vw-24px)] rounded-lg bg-white px-6 py-8 shadow-[0_8px_48px_rgba(0,0,0,.15)] sm:px-10 sm:py-11"
    >
      <div
        class="mb-1 font-['DM_Serif_Display',serif] text-[22px] text-[#1a1714]"
      >
        Clinical Trial
        <span class="italic text-[#2a5c8f]">
          Data Exchange
        </span>
      </div>
      <div
        class="mb-7 font-['DM_Mono',monospace] text-[10px] uppercase tracking-[.14em] text-[#6b6560]"
      >
        CSUS Dream Team · Sponsored by Vendia
      </div>
      <div class="mb-[22px] grid grid-cols-2 gap-2.5">
        <PortalCard
          v-for="portal in auth.portals"
          :key="portal.id"
          :portal="portal"
          :selected="portal.id === auth.selectedPortalId"
          @select="auth.selectPortal"
        />
      </div>
      <label
        class="mb-[5px] block text-[11px] font-semibold uppercase tracking-[.08em] text-[#6b6560]"
      >
        Email Address
      </label>
      <input
        v-model="email"
        class="mb-3.5 w-full rounded-[5px] border-[1.5px] border-[#dedad3] bg-[#faf9f7] px-[13px] py-2.5 text-sm text-[#1a1714]"
        type="email"
        placeholder="username@institution.org"
      />
      <label
        class="mb-[5px] block text-[11px] font-semibold uppercase tracking-[.08em] text-[#6b6560]"
      >
        Password
      </label>
      <input
        v-model="password"
        class="mb-3.5 w-full rounded-[5px] border-[1.5px] border-[#dedad3] bg-[#faf9f7] px-[13px] py-2.5 text-sm text-[#1a1714]"
        type="password"
        placeholder="password"
      />
      <p
        v-if="auth.error"
        class="mb-3 text-center text-xs font-semibold text-[#c0392b]"
      >
        {{ auth.error }}
      </p>
      <ActionButton variant="primary" block @click="signIn">
        Sign In
      </ActionButton>
      <p class="mt-3 text-center text-[11px] text-[#6b6560]">
        Use the provided portal demo credentials to login.
      </p>
    </section>
  </div>
</template>
