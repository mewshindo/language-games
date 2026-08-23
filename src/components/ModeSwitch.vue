<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{ labelOn?: string; labelOff?: string; label: string }>(), {
  labelOn: 'On',
  labelOff: 'Off',
  label: 'Mode',
})

const isEnabled = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'mode-changed', value: boolean): void
}>()

function handleChange() {
  isEnabled.value = !isEnabled.value
  emit('mode-changed', isEnabled.value)
}
</script>

<template>
  <label class="switch">
    <div class="button-container">
      <button type="button" class="switch" @click="handleChange">
        {{ isEnabled ? props.labelOn : props.labelOff }}
      </button>
    </div>
    <h5>{{ props.label }}</h5>
  </label>
</template>

<style scoped>
.button-container,
button {
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 800;
  text-align: center;
  background-color: var(--color-darker-than-dark);
  padding: 4px 8px 2px 8px;
  margin-bottom: 5%;
  border-radius: 10px;
}
h5 {
  text-align: center;
  margin-bottom: 5px;
  font-size: 15px;
  font-weight: 600;
  user-select: none;
}
button {
  background-color: transparent;
  font-family: Montserrat, sans-serif;
  font-size: 1rem;
  color: inherit;
  border: none;
  transition: color 0.2s;
}
button:hover {
  cursor: pointer;
  color: hsla(160, 100%, 37%, 1);
}
button:active {
  color: hsla(0, 0%, 80%, 1);
}
</style>
