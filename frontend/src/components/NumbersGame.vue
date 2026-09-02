<script setup lang="ts">
import { computed, ref } from 'vue'
import StatefulButton from '@/components/inputs/StatefulButton.vue'
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
    </div>
    <div v-show="isGameCompleted">
      <ResultsDisplay :result="result"/>
    </div>
    <div v-show="isPlaying || isGameCompleted" class="bottomControls">
      <h2 class="green">{{remainingTime}}</h2>
      <div>
        <button type="button" @click="restartGame">
          ↻
        </button>
        <h4 style="margin-top: 10px;">Restart</h4>
      </div>
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
  margin: auto;
  min-height: fit-content;
}
button{
  height: 60px;
  width: 60px;
  padding-bottom: 25px;
  text-align: center;
  background-color: var(--color-darker-than-dark);
  border: none;
  border-radius: 15px;
  color: var(--vt-c-text-dark-2);
  font-weight: 600;
  font-size: 40px;
  transition: color 0.2s;
}
button:hover {
  cursor: pointer;
  color: hsla(160, 100%, 37%, 1);
}
button:active {
  color: hsla(0, 0%, 80%, 1);
}
.controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  min-width: 300px;
  width: 40vw;
  gap: 16px;
  margin-top: 10%;
}
.bottomControls{
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
.game-container{
  display: inherit;
  flex-direction: inherit;
  align-items: inherit;
  justify-content: inherit;
  height: 60vh;
  min-height: 400px;
  gap: 40px;
}
.game {
  display: inherit;
  flex-direction: inherit;
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
