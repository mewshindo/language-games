<script setup lang="ts">
import { ref } from 'vue'
import ModeSwitch from '@/components/ModeSwitch.vue'
import NumbersInfo from '../languages/ja/NumbersInfo.vue'
import { japanese } from '@/languages/ja/ja'

const text = ref('')
const activeLanguage = japanese
const isNumberToTranslation = ref(false)
const currentNumber = ref(randomNumber())

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
</script>

<template>
  <div class="numbers-game">
    <div class="game">
      <h1>Numbers Game</h1>
      <ModeSwitch :label-on="'10 → 十'" :label-off="'十 → 10'" @mode-changed="onModeChanged" />
      <h2>{{ isNumberToTranslation ? currentNumber : activeLanguage.translate(currentNumber) }}</h2>
      <input
        v-model="text"
        @keyup.enter="submitAnswer"
        type="text"
        :placeholder="isNumberToTranslation ? 'Enter translation' : 'Enter number'"
      />
    </div>
  </div>
  <NumbersInfo />
</template>

<style scoped>
.numbers-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}
.info {
  width: 50%;
  margin: 0 auto;
}
h2 {
  margin: auto;
  text-align: center;
}
table {
  width: 100%;
}
td {
  font-size: 20px;
}
</style>
