<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const selected = ref('home')
const subSelected = ref('')

const showMenu = (menu) => {
  if (menu === selected.value) {
    selected.value = ''
  } else {
    selected.value = menu

    if (menu === 'framework') {
      subSelected.value = 'vue'
      router.push({ name: 'vue' })
    }
  }
}
</script>

<template>
  <header
    class="fixed top-0 left-0 h-screen w-[100px] bg-slate-900 border-r border-slate-500 md:bottom-0 md:top-auto md:h-[95px] md:w-full md:border md:rounded-t-lg"
  >
    <!-- 👉 COPIE EXACTE DE TON HEADER ACTUEL -->

    <div
      class="flex flex-col items-start justify-center px-2 md:flex-row md:items-center md:justify-around md:h-full md:px-0"
    >
      <!-- Logo -->
      <div class="mx-auto my-8 md:hidden">
        <img
          src="../assets/img/logo4.jpg"
          alt="logo"
          class="w-20 h-20 rounded-full border border-slate-700"
        />
      </div>

      <!-- Floboard -->
      <div class="w-full mb-5 md:mb-0">
        <RouterLink
          :to="{ name: 'floboard' }"
          @click="showMenu('floboard')"
          :class="[
            'flex items-center justify-center w-full text-2xl text-gray-400 hover:text-gray-200',
            selected === 'floboard' ? 'text-yellow-400' : '',
          ]"
        >
          <font-awesome-icon icon="calendar-check" class="text-3xl" />
        </RouterLink>
      </div>

      <!-- Framework -->
      <div class="w-full mb-5 md:mb-0 relative">
        <button
          @click="showMenu('framework')"
          :class="[
            'flex items-center justify-center w-full text-2xl text-gray-400 hover:text-gray-200',
            selected === 'framework' ? 'text-yellow-400' : '',
          ]"
        >
          <font-awesome-icon icon="laptop-code" class="text-3xl" />
        </button>

        <!-- Submenu -->
        <div
          v-if="selected === 'framework'"
          class="flex flex-col gap-1 w-full px-5 py-2 rounded-lg md:fixed md:bottom-[75px] md:left-0 md:w-full md:flex-row md:justify-center md:gap-3 bg-slate-900 md:border md:border-slate-500 md:border-b-0"
        >
          <RouterLink
            :to="{ name: 'vue' }"
            @click="subSelected = 'vue'"
            :class="[
              'text-lg text-gray-400 hover:text-gray-200',
              subSelected === 'vue' ? 'text-yellow-400' : '',
            ]"
          >
            Vue
          </RouterLink>

          <RouterLink
            :to="{ name: 'react' }"
            @click="subSelected = 'react'"
            :class="[
              'text-lg text-gray-400 hover:text-gray-200',
              subSelected === 'react' ? 'text-yellow-400' : '',
            ]"
          >
            React
          </RouterLink>
        </div>
      </div>

      <!-- Languages -->
      <div class="w-full mb-5 md:mb-0">
        <RouterLink
          :to="{ name: 'languages' }"
          @click="showMenu('languages')"
          :class="[
            'flex items-center justify-center w-full text-2xl text-gray-400 hover:text-gray-200',
            selected === 'languages' ? 'text-yellow-400' : '',
          ]"
        >
          <font-awesome-icon icon="pen-nib" class="text-3xl" />
        </RouterLink>
      </div>

      <!-- Notebook -->
      <div class="w-full mb-5 md:mb-0">
        <RouterLink
          :to="{ name: 'notebook' }"
          @click="showMenu('notebook')"
          :class="[
            'flex items-center justify-center w-full text-2xl text-gray-400 hover:text-gray-200',
            selected === 'notebook' ? 'text-yellow-400' : '',
          ]"
        >
          <font-awesome-icon icon="book" class="text-3xl" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>
