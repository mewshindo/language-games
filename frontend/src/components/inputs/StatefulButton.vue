<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{ modes?: string[], label: string }>(), {
  modes: () => ['On', 'Off'],
  label: 'Mode',
})

const mode = ref<number>(0)
const emit = defineEmits<{
  (e: 'mode-changed', value: number): void
}>()

function handleChange() {
  if(mode.value + 1 <= props.modes.length - 1){
    mode.value += 1
  }
  else{
    mode.value = 0
  }
  emit('mode-changed', mode.value)
}
</script>

<template>
  <label class="switch">
    <div class="button-container">
      <button type="button" class="switch" @click="handleChange">
        {{props.modes[mode]}}
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
  height: 40px;
  padding: 0 8px 0 8px;
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
