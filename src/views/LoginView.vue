<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores";
import { LoaderIcon, LockIcon, MailIcon } from "@/assets";
import { Routes } from "@/router";

const email     = ref("");
const password  = ref("");
const router    = useRouter();
const auth      = useAuthStore();

const is_loading = ref(false);
const error_message = ref("");
const success = ref(false);
const isLoggedIn = ref(false);

async function handle_login()
{
    is_loading.value    = true;
    error_message.value = ''

    try
    {
        // TODO: Mock Up Request
        await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Remove Mock Up Logic
    if (email.value === 'bavaria@gmail.com' && password.value === 'bavaria') {
      success.value = true;
      auth.login('Bavaria');
      router.push({ name: Routes.DASHBOARD });
    }
    else if (email.value === 'jh@gmail.com' && password.value === 'jh') {
      success.value = true;
      auth.login('JHDoctor');
      router.push({ name: Routes.DASHBOARD });
    }
        else if (email.value === 'jhadmin@gmail.com' && password.value === 'jh') {
      success.value = true;
      auth.login('JHAdmin');
      router.push({ name: Routes.DASHBOARD });
    }
    else if (email.value === 'fda@gmail.com' && password.value === 'fda') {
      success.value = true;
      auth.login('FDA');
      router.push({ name: Routes.DASHBOARD });
    }
        else
        {
            throw new Error('Invalid Email or Password');
        }
    } 
  catch (error) {
    if (error instanceof Error) {
      error_message.value = error.message;
    } else {
      error_message.value = 'Uncaught Exception';
    }
  } finally {
    is_loading.value = false;
  }
}
</script>

<template>
  <div class="w-full flex justify-center">
      <div class="w-full max-w-md">
          <h1 class="mb-8 text-4xl font-extrabold text-center">
              Pharmaceutical Trial Manager
          </h1>
           <div class="p-8 transition-transform transform bg-white rounded-lg shadow-xl bg-accent hover:scale-105">
              <h2 class="mb-6 text-2xl font-bold text-gray-800 text-center">Login</h2>
              <form class="space-y-6" @submit.prevent="handle_login">
                    <div class="space-y-2">
                        <label for="email" class="block text-sm font-medium text-gray-800">
                            Email
                        </label>
                        <div class="relative">
                            <input v-model="email" type="email" id="email" name="email" required
                                class="w-full px-4 py-2 placeholder-gray-400 border border-gray-600 rounded-mdfocus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email" />
                            <MailIcon class="absolute right-3 top-2.5 h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label for="password"
                            class="block text-sm font-medium text-gray-800 dark:text-gray-200">Password</label>
                        <div class="relative">
                            <input v-model="password" type="password" id="password" name="password" required
                                class="w-full px-4 py-2 placeholder-gray-400 border border-gray-600 rounded-mdfocus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password" />
                            <LockIcon class="absolute right-3 top-2.5 h-5 w-5 text-gray-600" />
                        </div>
                    </div>
                    <button type="submit"
                        class="w-full px-4 py-2 text-white transform rounded-md bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        :class="{ 'cursor-not-allowed opacity-75': is_loading }" :disabled="is_loading">
                        <span v-if="!is_loading">Sign In</span>
                        <div v-else class="flex items-center justify-center">
                            <LoaderIcon class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" />
                            Signing In...
                        </div>
                    </button>
                </form>
                 <transition name="fade">
                    <p v-if="error_message" class="mt-4 text-sm text-center text-red-400">
                        {{ error_message }} <br />
                        Try again or Contact Support
                    </p>
                </transition>
                <transition name="fade">
                    <p v-if="success" class="mt-4 text-sm font-bold text-center text-green-400">
                        Logged In Successfully!
                    </p>
                </transition>
          </div>  
      </div>
  </div>
</template>
