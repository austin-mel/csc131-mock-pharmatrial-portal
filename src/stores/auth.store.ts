import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BavariaLogo, FDALogo, JHLogo } from '@/assets'
import type { Portal, PortalId } from '@/types'
import { router, Routes } from '@/router'

const portals: Portal[] = [
  {
    id: 'jh-doctor',
    label: 'Jane Hopkins',
    role: 'Doctor',
    color: '#1e7e4e',
    tint: '#eaf6ef',
    abbr: 'JH',
    user: 'Doctor',
    logo: JHLogo,
  },
  {
    id: 'jh-admin',
    label: 'Jane Hopkins',
    role: 'Admin',
    color: '#1e7e4e',
    tint: '#eaf6ef',
    abbr: 'JH',
    user: 'Admin',
    logo: JHLogo,
  },
  {
    id: 'fda',
    label: 'FDA',
    role: 'Regulator',
    color: '#2a5c8f',
    tint: '#eaf1f8',
    abbr: 'FDA',
    user: 'FDA',
    logo: FDALogo,
  },
  {
    id: 'bavaria',
    label: 'Bavaria',
    role: 'Sponsor',
    color: '#c0392b',
    tint: '#fbeeed',
    abbr: 'BAV',
    user: 'Sponsor',
    logo: BavariaLogo,
  },
]

const demoCredentials: Record<PortalId, { email: string; password: string }> = {
  'jh-doctor': { email: 'doctor@jh.example', password: 'jh-doctor-demo' },
  'jh-admin': { email: 'admin@jh.example', password: 'jh-admin-demo' },
  fda: { email: 'admin@fda.example', password: 'fda-demo' },
  bavaria: { email: 'admin@bavaria.example', password: 'bavaria-demo' },
}

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const selectedPortalId = ref<PortalId>('jh-doctor')
  const error = ref('')
  const currentPortal = computed(() => portals.find(portal => portal.id === selectedPortalId.value))

  function selectPortal(portalId: PortalId) {
    selectedPortalId.value = portalId
    error.value = ''
  }

  function login(email: string, password: string) {
    const credentials = demoCredentials[selectedPortalId.value]
    if (email !== credentials.email || password !== credentials.password) {
      error.value = 'Invalid demo credentials for the selected portal.'
      return
    }

    isLoggedIn.value = true
    error.value = ''
    router.push({ name: Routes.DASHBOARD })
  }

  function logout() {
    isLoggedIn.value = false
    error.value = ''
    router.push({ name: Routes.LOGIN })
  }

  return { portals, selectedPortalId, currentPortal, isLoggedIn, error, selectPortal, login, logout }
})
