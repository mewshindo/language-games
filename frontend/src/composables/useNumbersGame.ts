import { ref } from 'vue'
import { languages } from '@/languages'
import type { LanguageInstruction } from '@/languages/types'

export function useNumbersGame(activeLanguage: LanguageInstruction) {
  const numbersrange = ref(false)
  const currentNumber = ref(randomNumber())
  const isNumberToTranslation = ref(false)
  const text = ref('')

  const timeframe = ref(30) 

  function randomNumber() {
    return numbersrange.value
      ? Math.floor(Math.random() * 10) + 1
      : Math.floor(Math.random() * activeLanguage.maxNumber) + 1
  }

  function onModeChanged(value: number) {
    isNumberToTranslation.value = value == 0
  }
  function onDifficultySelected(value: number) {
    numbersrange.value = value == 0
    currentNumber.value = randomNumber()
    text.value = ''
  }
  function onTimeframeSelected(value: number){

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
  return {
    onModeChanged,
    onDifficultySelected,
    currentNumber,
    numbersrange,
    isNumberToTranslation,
    text,
    submitAnswer,
  }
}
