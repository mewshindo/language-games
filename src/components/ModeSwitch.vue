<script setup lang="ts">

import { ref } from 'vue'

const props = withDefaults(
  defineProps<{ labelOn?: string; labelOff?: string }>(),
  { labelOn: 'On', labelOff: 'Off' }
)

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
    <button type="button" class="switch" @click="handleChange">{{ isEnabled ? props.labelOn : props.labelOff }}</button>
  </label>
</template>

<style scoped>
.switch{
  background-color: transparent;
  font-family: Montserrat, sans-serif;
  font-size: 1rem;
  color: inherit;
  border: none;
  transition: color 0.5s;
}
.switch:hover{
  cursor: pointer;
  color: hsla(160, 100%, 37%, 1);
}
</style>