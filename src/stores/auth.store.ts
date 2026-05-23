import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { seedPortals } from '@/data';
import type { Portal, PortalId } from '@/types';

const demoCredentials: Record<PortalId, { email: string; password: string }> = {
  'jh-doctor': { email: 'doctor@jh.example', password: 'jh-doctor-demo' },
  'jh-admin': { email: 'admin@jh.example', password: 'jh-admin-demo' },
  fda: { email: 'admin@fda.example', password: 'fda-demo' },
  bavaria: { email: 'admin@bavaria.example', password: 'bavaria-demo' },
};

export const useAuthStore = defineStore('auth', () => {
  const selectedPortalId = ref<PortalId>('jh-doctor');
  const loggedIn = ref(false);
  const error = ref<string | null>(null);

  const portals = seedPortals;
  const selectedPortal = computed(() => portals.find(portal => portal.id === selectedPortalId.value) as Portal);
  const currentPortal = computed(() => loggedIn.value ? selectedPortal.value : null);
  const isLoggedIn = computed(() => loggedIn.value);

  function selectPortal(portalId: PortalId) {
    selectedPortalId.value = portalId;
  }

  function login(email = demoCredentials[selectedPortalId.value].email, password = demoCredentials[selectedPortalId.value].password) {
    const credentials = demoCredentials[selectedPortalId.value];
    if (email.trim().toLowerCase() !== credentials.email || password !== credentials.password) {
      loggedIn.value = false;
      error.value = 'Invalid email or password for selected portal!';
      return false;
    }
    loggedIn.value = true;
    error.value = null;
    return true;
  }

  function logout() {
    loggedIn.value = false;
    error.value = null;
  }

  return { portals, selectedPortalId, selectedPortal, currentPortal, isLoggedIn, error, selectPortal, login, logout };
});
