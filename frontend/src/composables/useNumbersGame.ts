import { ref, type Ref } from 'vue'
import type { LanguageInstruction } from '@/languages/types'
import {
  createResult,
  sendRunStarted,
  type CreateResultPayload,
  type UserPrivate,
} from '@/services/api'

export function useNumbersGame(
  activeLanguage: LanguageInstruction,
  user: Ref<UserPrivate | undefined>,
) {
  const numbersrange = ref(false)
  const currentNumber = ref(randomNumber())
  const isNumberToTranslation = ref(false)
  const text = ref('')
  const remainingTime = ref(30)

  const isPlaying = ref(false)
  const isGameCompleted = ref(false)
  const intervalId = ref<number | null>(null)

  const result = ref('0')
  let resultInternal = 0

  const timeframe = ref(30)

  function randomNumber() {
    return numbersrange.value
      ? Math.floor(Math.random() * 10) + 1
      : Math.floor(Math.random() * activeLanguage.maxNumber) + 1
  }

  function stopGame() {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
    isPlaying.value = false
  }

  function startGame() {
    stopGame()

    if (user) {
      runStarted()
    }

    isPlaying.value = true
    remainingTime.value = timeframe.value

    intervalId.value = window.setInterval(() => {
      remainingTime.value -= 1

      if (remainingTime.value <= 0) {
        isGameCompleted.value = true
        result.value = (resultInternal * (60 / timeframe.value)).toString()
        if (user) sendResult()
        stopGame()
      }
    }, 1000)
  }

  async function runStarted() {
    if (!user.value) return
    await sendRunStarted(user.value.id)
  }

  async function sendResult() {
    if (!user.value) return
    const resultPayload: CreateResultPayload = {
      mode: `${isNumberToTranslation.value ? 'numberToText' : 'textToNumber'}`,
      language: `${activeLanguage.label}`,
      game: 'numbers',
      difficulty: numbersrange.value ? 1 : 2,
      score: resultInternal * (60 / timeframe.value),
    } as CreateResultPayload
    createResult(user.value.id, resultPayload)
  }

  function restartGame() {
    stopGame()
    isPlaying.value = false
    isGameCompleted.value = false
    result.value = '0'
    resultInternal = 0
    currentNumber.value = randomNumber()
    text.value = ''
  }

  function onModeChanged(value: number) {
    isNumberToTranslation.value = value == 1
    if (isPlaying.value) {
      stopGame()
    }
  }
  function onDifficultySelected(value: number) {
    numbersrange.value = value == 1
    currentNumber.value = randomNumber()
    text.value = ''
    if (isPlaying.value) {
      stopGame()
    }
  }
  function onTimeframeSelected(value: number) {
    if (value == 0) timeframe.value = 30
    if (value == 1) timeframe.value = 15
    if (value == 2) timeframe.value = 60
    remainingTime.value = timeframe.value
    if (isPlaying.value) {
      stopGame()
    }
  }

  function onInput() {
    if (!isPlaying.value && !isGameCompleted.value) {
      startGame()
    }
    const answer = text.value.trim().toLowerCase()
    if (!answer) return

    const expectedAnswers = isNumberToTranslation.value
      ? activeLanguage.acceptedAnswers(currentNumber.value)
      : [String(currentNumber.value)]

    if (expectedAnswers.some((expected) => expected.toLowerCase() === answer)) {
      if (isPlaying.value) {
        resultInternal++
      }
      currentNumber.value = randomNumber()
      text.value = ''
    }
  }
  return {
    onModeChanged,
    onDifficultySelected,
    onTimeframeSelected,
    onInput,
    restartGame,
    currentNumber,
    numbersrange,
    isNumberToTranslation,
    isPlaying,
    text,
    remainingTime,
    result,
    isGameCompleted,
  }
}
