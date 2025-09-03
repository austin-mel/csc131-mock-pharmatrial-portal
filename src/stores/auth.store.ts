import { defineStore } from 'pinia'
import { ref } from 'vue'

export type AccountType = 'bavaria' | 'jh' | 'fda' | 'admin' | ''

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const accountType = ref<AccountType>('')

  function login(type: AccountType) {
    isLoggedIn.value = true
    accountType.value = type
  }

  function logout() {
    isLoggedIn.value = false
    accountType.value = ''
  }

  return { isLoggedIn, accountType, login, logout }
})