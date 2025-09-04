import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { UserRole } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const accountType = ref<UserRole>('')

  function login(type: UserRole) {
    isLoggedIn.value = true
    accountType.value = type
  }

  function logout() {
    isLoggedIn.value = false
    accountType.value = ''
  }

  return { isLoggedIn, accountType, login, logout }
})