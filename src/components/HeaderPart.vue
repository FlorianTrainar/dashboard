<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'

import { useAuth } from '@/assets/JS/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

const selected = ref('home')
const subSelected = ref('')

const showMenu = (menu) => {
  if (menu === selected.value) {
    selected.value = ''
  } else {
    selected.value = menu

    if (menu === 'snippets') {
      subSelected.value = 'vue'
      router.push({ name: 'vue' }) // redirection vers la page Vue.js
    }
  }
}

function handleLogout() {
  logout()
  router.push({ name: 'login' })
}
</script>
<template>
  <header>
    <div class="menu">
      <div class="logo-container">
        <img src="../assets/img/cat-noback-icon.png" alt="logo" />
      </div>
      <div class="menu-element">
        <RouterLink
          :to="{ name: 'home' }"
          :class="{ active: selected === 'home' }"
          @click="showMenu('home')"
          >FloBoard</RouterLink
        >
      </div>
      <div class="menu-element">
        <button
          class="show-menu-btn"
          :class="{ active: selected === 'snippets' }"
          @click="showMenu('snippets')"
        >
          Snippets
        </button>
        <div class="sub-menu" v-if="selected === 'snippets'">
          <RouterLink
            :to="{ name: 'vue' }"
            @click="subSelected = 'vue'"
            :class="{ active: subSelected === 'vue' }"
            >Vue.js</RouterLink
          >
          <RouterLink
            @click="subSelected = 'css'"
            :class="{ active: subSelected === 'css' }"
            :to="{ name: 'css' }"
            >Css</RouterLink
          >
          <RouterLink
            :to="{ name: 'js' }"
            @click="subSelected = 'js'"
            :class="{ active: subSelected === 'js' }"
            >JavaScript</RouterLink
          >
          <RouterLink
            :to="{ name: 'dependencies' }"
            @click="subSelected = 'dependencies'"
            :class="{ active: subSelected === 'dependencies' }"
            >Dependencies</RouterLink
          >
        </div>
      </div>
      <div class="menu-element">
        <RouterLink
          :to="{ name: 'links' }"
          :class="{ active: selected === 'links' }"
          @click="showMenu('links')"
          >Links</RouterLink
        >
      </div>
      <div class="menu-element" v-if="user">
        <button @click="handleLogout">Se déconnecter</button>
      </div>
    </div>
  </header>
</template>
<style scoped>
header {
  background-color: var(--back-color1-);
  min-width: var(--header-width-);
  border-right: solid 1px var(--back-color4-);
}
.menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 10px;
}

.logo-container {
  margin: 30px auto;
  width: calc(var(--header-width-) - 100px);
  height: calc(var(--header-width-) - 100px);
  background-color: var(--back-color4-);
  border-radius: 50%;
  border: solid 1px var(--font-color1-);
  position: relative;
}
.logo-container > img {
  width: 60px;
  position: absolute;
  top: 6px;
  left: 9px;
}

.menu-element {
  margin-bottom: 20px;
}

.menu-element > a,
.menu-element > button {
  color: var(--font-color2-);
  font-size: 26px;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
.menu-element > a:hover,
.menu-element > button:hover {
  cursor: pointer;
  color: var(--hover-color-);
}
.menu-element > a.active,
.menu-element > button.active {
  color: var(--active-color-);
}

.sub-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;

  width: 100%;
  padding: 10px 20px;

  border-radius: 8px;
}
.sub-menu > a {
  color: var(--font-color2-);
  font-size: 21px;
  text-decoration: none;
}
.sub-menu > a:hover {
  color: var(--hover-color-);
}
.sub-menu > a.active {
  color: var(--active-color-);
}
</style>
