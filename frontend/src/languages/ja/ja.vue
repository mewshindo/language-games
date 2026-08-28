<script setup lang="ts">
import ModeSwitch from '@/components/ModeSwitch.vue'
import { japanese } from '@/languages/ja/ja'
import type { LanguageNumber } from '@/languages/types'
import { ref } from 'vue'

const numbers = Array.from({ length: 10 }, (_, index) => japanese.getNumber(index + 1)).filter(
  (number): number is LanguageNumber => number !== undefined,
)

const romaji = ref(true)

function handleModeChange(value: boolean) {
  romaji.value = value
}
</script>

<template>
  <div class="info">
    <h2>Numbers in Japanese</h2>
    <table>
      <tbody>
        <tr v-for="kanji in numbers" :key="kanji.number">
          <td>{{ kanji.number }}</td>
          <td>
            <ruby>
              {{ kanji.name }}
              <rt v-if="romaji">{{ kanji.romajis.join(' / ') }}</rt>
              <rt v-else>{{ kanji.readings.join(' / ') }}</rt>
            </ruby>
          </td>
        </tr>
      </tbody>
    </table>
    <ModeSwitch
      :label-on="'Furigana'"
      :label-off="'Romaji'"
      :label="''"
      @mode-changed="handleModeChange"
    />
  </div>
</template>

<style scoped>
.info {
  display: flex;
  min-width: 500px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 50%;
}
table {
  width: 50%;
  margin: auto;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-collapse: collapse;
}
td,
ruby,
rt {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 24px;
  text-align: center;
  margin: auto;
}
rt {
  font-size: 14px;
  padding-bottom: 4px;
}
td {
  border-bottom: 1px solid var(--color-border);
  padding-top: 5px;
  padding-bottom: 5px;
  width: 50%;
}
</style>
