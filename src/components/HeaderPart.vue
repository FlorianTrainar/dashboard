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
      router.push({ name: 'vue' }) // redirection vers la page Vue.js
    }
  }
}
</script>
<template>
  <!-- Phone version -->

  <header>
    <div class="menu">
      <div class="logo-container">
        <img src="../assets/img/logo4.jpg" alt="logo" />
      </div>
      <div class="menu-element">
        <RouterLink
          :to="{ name: 'floboard' }"
          :class="{ active: selected === 'floboard' }"
          @click="showMenu('floboard')"
        >
          <font-awesome-icon icon="calendar-check" />
        </RouterLink>
      </div>
      <div class="menu-element">
        <button
          class="show-menu-btn"
          :class="{ active: selected === 'framework' }"
          @click="showMenu('framework')"
        >
          <font-awesome-icon icon="laptop-code" />
        </button>
        <div class="sub-menu" v-if="selected === 'framework'">
          <RouterLink
            :to="{ name: 'vue' }"
            @click="subSelected = 'vue'"
            :class="{ active: subSelected === 'vue' }"
            >Vue</RouterLink
          >
          <RouterLink
            @click="subSelected = 'react'"
            :class="{ active: subSelected === 'react' }"
            :to="{ name: 'react' }"
            >React</RouterLink
          >
        </div>
      </div>

      <div class="menu-element">
        <RouterLink
          :to="{ name: 'languages' }"
          :class="{ active: selected === 'languages' }"
          @click="showMenu('languages')"
          ><font-awesome-icon icon="pen-nib"
        /></RouterLink>
      </div>

      <div class="menu-element">
        <RouterLink
          :to="{ name: 'notebook' }"
          :class="{ active: selected === 'notebook' }"
          @click="showMenu('notebook')"
          ><font-awesome-icon icon="book"
        /></RouterLink>
      </div>

      <!-- <div class="menu-element">
        <RouterLink
          :to="{ name: 'links' }"
          :class="{ active: selected === 'links' }"
          @click="showMenu('links')"
        >
          <font-awesome-icon icon="globe" />
        </RouterLink>
      </div> -->
      <!-- <div class="menu-element" v-if="user">
        <button @click="handleLogout">Se déconnecter</button>
      </div> -->
    </div>
  </header>
</template>
<style scoped>
header {
  background-color: var(--back-color1-);
  border-right: solid 1px var(--back-color4-);
}

.menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 10px;
}

header img {
  width: 80px;
  height: 80px;
  margin: 30px auto;
  border-radius: 50%;
  border: solid 1px var(--back-color2--);
}

.menu-element {
  margin-bottom: 20px;
  width: 100%;
}

.menu-element > a,
.menu-element > button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: var(--font-color2-);
  font-size: 26px;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  width: 100%;
}
.menu-element > a:hover,
.menu-element > button:hover {
  cursor: pointer;
  color: var(--hover-color-);
}
.menu-element > a.active,
.menu-element > button.active {
  color: var(--selected-color-);
}
.menu svg {
  font-size: 2.2rem;
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
  color: var(--selected-color-);
}

/* footer  */

@media screen and (max-width: 768px) and (orientation: portrait) {
  header {
    display: block;
    background-color: var(--back-color1-);
    min-width: var(--header-width-);
    border: solid 1px var(--back-color4-);

    position: fixed;
    bottom: 0;
    width: 100%;
    height: 95px;
    border-radius: 8px 8px 0 0;
  }
  .menu {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 0;
    height: 100%;

    /* border: solid 1px blue; */
  }

  .menu-element {
    margin-bottom: 0px;
  }
  .sub-menu {
    background-color: var(--back-color1-);
    position: fixed;

    bottom: 75px;
    left: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border: solid 1px var(--back-color4-);
    border-bottom: none;
    border-radius: 8px 8px 0 0;
  }
  .logo-container {
    display: none;
  }
}
</style>
