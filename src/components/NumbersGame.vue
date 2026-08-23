<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ModeSwitch from '@/components/ModeSwitch.vue'

onMounted(() => {
  currentNumber.value = Math.floor(Math.random() * 10) + 1
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

const numbersKanji: Record<number, string> = {1: "一 いち", 2: "二 に", 3: "三 さん", 4: "四 よん", 5: "五 ご", 6: "六 ろく", 7: "七 なな", 8: "八 はち", 9: "九 きゅう", 10: "十 じゅう"}

const text = ref('')

var currentNumber = ref(0)

function onNumberFieldInput() {
  if (text.value === numbersKanji[currentNumber.value]?.split(' ')[0]) {
    text.value = ''
    currentNumber.value = Math.floor(Math.random() * 10) + 1
  }
}

function onKeyDown(e: KeyboardEvent) {
  if(e.key == 'Enter') {
    text.value = ''
  }
}
window.addEventListener('keydown', onKeyDown)

</script>

<template>
<div>
    <h1>Numbers Game</h1>
    <ModeSwitch :label-on="'Enabled'" :label-off="'Disabled'" />
    <h2>{{ currentNumber }}</h2>
    <input v-model="text" @input="onNumberFieldInput" type="text" placeholder="Enter numbers" />
    <div class="info">
        <h2>Numbers and their respective Kanji</h2>
        <table>
            <tbody>
                <tr v-for="(kanji, number) in numbersKanji" :key="number">
                    <td style="text-align: right;">{{ number }}</td>
                    <td><hr style="margin: 5px"></td>
                    <td>
                        <ruby>{{ kanji.split(' ')[0] }}<rt>{{ kanji.split(' ')[1] }}</rt></ruby>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<style scoped>
.info{
    width: 50%;
    margin: 0 auto;
}
table{
    width: 100%;
}
td{
    font-size: 20px;
}
</style>