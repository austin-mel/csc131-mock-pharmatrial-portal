import { defineStore } from 'pinia'
import { ref } from 'vue'

export type AccountType = 'bavaria' | 'jh' | 'fda' | 'guest'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const accountType = ref<AccountType>('guest')

  function login(type: AccountType) {
    isLoggedIn.value = true
    accountType.value = type
  }

  function logout() {
    isLoggedIn.value = false
    accountType.value = 'guest'
  }

  return { isLoggedIn, accountType, login, logout }
})