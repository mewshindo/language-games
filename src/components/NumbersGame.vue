<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ModeSwitch from '@/components/ModeSwitch.vue'
import { languages } from '@/languages'

const text = ref('')
const activeLanguage = languages.japanese.instruction
const activeInfoComponent = languages.japanese.infoComponent
const isNumberToTranslation = ref(false)
const currentNumber = ref(randomNumber())
const isTyping = ref(false)

function randomNumber() {
  return Math.floor(Math.random() * activeLanguage.maxNumber) + 1
}

function onModeChanged(value: boolean) {
  isNumberToTranslation.value = value
}

function submitAnswer() {
  const answer = text.value.trim().toLowerCase()
  if (!answer) return

  const expectedAnswers = isNumberToTranslation.value
    ? activeLanguage.acceptedAnswers(currentNumber.value)
    : [String(currentNumber.value)]

  if (expectedAnswers.some((expected) => expected.toLowerCase() === answer)) {
    currentNumber.value = randomNumber()
    text.value = ''
  }
}

const inputElement = ref<HTMLInputElement | null>(null)

function focusInputOnTyping(event: KeyboardEvent) {
  const target = event.target as HTMLElement

  if (event.key === 'Escape') {
    isTyping.value = false
    return
  }

  if (
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) &&
    isTyping.value == true
  ) {
    return
  }

  inputElement.value?.focus()
  isTyping.value = true
}
function unfocusInput() {
  isTyping.value = false
}

onMounted(() => {
  window.addEventListener('keydown', focusInputOnTyping)
  window.addEventListener('click', unfocusInput)
})

onUnmounted(() => {
  window.removeEventListener('keydown', focusInputOnTyping)
})
</script>

<template>
  <div class="numbers-game">
    <div class="controls" :class="{ 'is-typing': isTyping }">
      <ModeSwitch
        :label-on="'6 ➔ 六'"
        :label-off="'六 ➔ 6'"
        :label="'mode'"
        @mode-changed="onModeChanged"
      />
    </div>
    <div class="game">
      <ruby
        >{{ isNumberToTranslation ? currentNumber : activeLanguage.translate(currentNumber)
        }}<rt
          v-if="activeLanguage.getReadings(currentNumber).length > 0 && !isNumberToTranslation"
          >{{ activeLanguage.getReadings(currentNumber) }}</rt
        ></ruby
      >
      <input
        ref="inputElement"
        v-model="text"
        @keyup.enter="submitAnswer"
        @input="submitAnswer"
        type="text"
        :placeholder="'Start typing...'"
      />
    </div>
    <component :is="activeInfoComponent" class="infotable" :class="{ 'is-typing': isTyping }" />
  </div>
</template>

<style scoped>
.numbers-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 5%;
  width: 80vw;
  margin: auto;
}
.controls {
  margin-top: 10%;
}
.game {
  display: inherit;
  flex-direction: inherit;
  margin-bottom: 5%;
  margin-top: 5%;
}
ruby {
  font-size: 48px;
  margin: auto;
  text-align: center;
}
rt {
  font-size: 24px;
  text-align: center;
}
hr {
  width: 50%;
  margin: auto;
  height: 1px;
  border: none;
  border-bottom: 1px solid;
  margin-bottom: 4vh;
}
input {
  font-size: 24px;
  padding: 10px;
  margin-top: 20px;
  width: 300px;
  text-align: center;
  border: none;
  background-color: var(--color-background-soft);
  color: var(--vt-c-text-dark-2);
  caret-color: transparent;
}
input:focus {
  outline: none;
}
input:hover {
  cursor: pointer;
}

.controls,
.infotable {
  transition: opacity 0.2s ease;
}
.is-typing {
  opacity: 0;
}
</style>
