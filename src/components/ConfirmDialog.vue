<script setup>
const props = defineProps({
  message: String,
  visible: Boolean,
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-box">
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button class="delete-btn" @click="$emit('cancel')">Annuler</button>
        <button class="save-btn" @click="$emit('confirm')">Confirmer</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.modal-box {
  position: fixed;
  background: var(--back-color2-);
  color: var(--font-color1-);
  font-size: 19px;
  padding: 2rem;
  border-radius: 8px;
  border: solid 1px var(--back-color3-);
  width: 300px;
  text-align: center;
}

.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-around;
}

button {
  font-weight: bold;
  font-size: 16px;
}
</style>
