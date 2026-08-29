<script setup lang="ts">
import { computed, ref } from 'vue'
import StatefulButton from '@/components/controls/StatefulButton.vue'
import ResultsDisplay from '@/components/ResultsDisplay.vue'
import { languages } from '@/languages'
import { useNumbersGame } from '@/composables/useNumbersGame'
import { useFocusModeHandler } from '@/composables/useFocusModeHandler'
import type { LanguageInstruction } from '@/languages/types'

const activeInfoComponent = languages.japanese.infoComponent
const activeLanguage: LanguageInstruction = languages.japanese.instruction

const inputElement = ref<HTMLInputElement | null>(null)

const readings = computed(() => activeLanguage.getReadings(currentNumber.value))

const {
  onModeChanged,
  onDifficultySelected,
  onTimeframeSelected,
  onInput,
  restartGame,
  currentNumber,
  text,
  isNumberToTranslation,
  remainingTime,
  isPlaying,
  isGameCompleted,
  result
} = useNumbersGame(activeLanguage)

const { isTyping } = useFocusModeHandler(inputElement)
</script>

<template>
  <div class="numbers-game">
    <div class="game-container" v-show="!isGameCompleted">
    <div class="controls" :class="{ 'is-typing': isTyping }">
      <StatefulButton
      :modes="['30','15','60']"
      :label="'timeframe'"
      @mode-changed="onTimeframeSelected"
      />
      <StatefulButton
        :modes="['六 ➔ 6', '6 ➔ 六']"
        :label="'mode'"
        @mode-changed="onModeChanged"
      />
      <StatefulButton
        :modes="['1-99','1-10']"
        :label="'range'"
        @mode-changed="onDifficultySelected"
      />
    </div>
    <div class="game">
      <ruby
        >{{ isNumberToTranslation ? currentNumber : activeLanguage.translate(currentNumber)
        }}<rt
          v-show="readings.length > 0 && !isNumberToTranslation"
          >{{readings}}</rt
          ></ruby
      >
      <input
      ref="inputElement"
      v-model="text"
      @input="onInput"
      type="text"
      :placeholder="'Start typing...'"
      />
    </div>
    <div v-show="isPlaying">
      <h2 class="green">{{remainingTime}}</h2>
      <button type="button" @click="restartGame">
        ↻
      </button>
    </div>
    </div>
    <div>
      <ResultsDisplay v-if="isGameCompleted" :result="result"/>
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
  width: 80vw;
  gap: 80px;
  margin: auto;
  min-height: fit-content;
}
.controls {
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 10%;
}
.game-container{
  display: inherit;
  flex-direction: inherit;
  align-items: inherit;
  justify-content: inherit;
  height: 60vh;
  min-height: 200px;
  gap: 40px;
}
.game {
  display: inherit;
  flex-direction: inherit;
  margin-bottom: 5%;
  margin-top: 5%;
  min-height: 20vh;
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
  font-weight: 600;
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
