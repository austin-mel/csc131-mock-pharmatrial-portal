import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const store = useAuthStore();
  const { currentPortal, isLoggedIn } = storeToRefs(store);

  return {
    currentPortal,
    isLoggedIn,
    portalTheme: computed(() => currentPortal.value?.color ?? '#1a1714'),
    login: store.login,
    logout: store.logout,
    selectPortal: store.selectPortal,
  };
}
