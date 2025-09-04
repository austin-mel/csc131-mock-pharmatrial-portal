import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { UserRole, UserInformation } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const accountType = ref<UserRole>('')

  function login(role: UserRole) {
    isLoggedIn.value = true
    accountType.value = role
  }

  function logout() {
    isLoggedIn.value = false
    accountType.value = ''
  }

  return { isLoggedIn, accountType, login, logout }
})