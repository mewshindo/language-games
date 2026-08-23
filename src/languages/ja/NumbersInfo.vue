<script setup lang="ts">
import ModeSwitch from '@/components/ModeSwitch.vue'
import { japanese } from '@/languages/ja/ja'
import type { LanguageNumber } from '@/languages/types'

const numbers = Array.from({ length: 10 }, (_, index) => japanese.getNumber(index + 1)).filter(
  (number): number is LanguageNumber => number !== undefined,
)
</script>

<template>
  <div class="info">
    <h2>Numbers and their respective Kanji</h2>
    <table>
      <tbody>
        <tr v-for="kanji in numbers" :key="kanji.number">
          <td style="text-align: right">{{ kanji.number }}</td>
          <td><hr style="margin: 5px" /></td>
          <td>
            <ruby
              >{{ kanji.name
              }}<rt v-for="reading in kanji.readings"
                >{{ reading }}<a v-if="kanji.readings.length > 1">/</a></rt
              ></ruby
            >
          </td>
        </tr>
      </tbody>
    </table>
    <ModeSwitch :label-on="'Furigana'" :label-off="'Romaji'" @mode-changed="" />
  </div>
</template>
