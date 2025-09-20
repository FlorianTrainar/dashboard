<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const selected = ref('')
const subSelected = ref('')

const showMenu = (menu) => {
  selected.value = menu
}
</script>
<template>
  <header>
    <div class="menu">
      <RouterLink
        :to="{ name: 'home' }"
        :class="{ active: selected === 'home' }"
        @click="showMenu('home')"
        >Home</RouterLink
      >

      <button
        class="show-menu-btn"
        :class="{ active: selected === 'snippets' }"
        @click="showMenu('snippets')"
      >
        Snippets
      </button>
      <div class="sub-menu" v-if="selected === 'snippets'">
        <RouterLink
          @click="subSelected = 'css'"
          :class="{ active: subSelected === 'css' }"
          :to="{ name: 'css' }"
          >CSS</RouterLink
        >
        <RouterLink
          :to="{ name: 'js' }"
          @click="subSelected = 'js'"
          :class="{ active: subSelected === 'js' }"
          >JS</RouterLink
        >
        <RouterLink
          :to="{ name: 'vue' }"
          @click="subSelected = 'vue'"
          :class="{ active: subSelected === 'vue' }"
          >VUE</RouterLink
        >
      </div>
    </div>
  </header>
</template>
<style scoped>
header {
  background-color: var(--back-color1-);
  min-width: var(--header-width-);
}
.menu {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  padding: 0 10px;
}

.menu > a,
.menu > button {
  color: var(--font-color2-);
  font-size: 30px;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
.menu > a:hover,
.menu > button:hover {
  cursor: pointer;
  color: var(--hover-color-);
}
.menu > a.active,
.menu > button.active {
  color: var(--font-color1-);
}

.sub-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: var(--back-color2-);
  width: 100%;
  padding: 4px 10px;
}
.sub-menu > a {
  color: var(--font-color2-);
  font-size: 24px;
  text-decoration: none;
}
.sub-menu > a:hover {
  color: var(--hover-color-);
}
.sub-menu > a.active {
  color: var(--font-color1-);
}
</style>
