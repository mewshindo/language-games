import type { LanguageInstruction, LanguageNumber } from '../types'

const numbers: LanguageNumber[] = [
  { number: 1, name: '一', readings: ['いち'], romajis: ['ichi'] },
  { number: 2, name: '二', readings: ['に'], romajis: ['ni'] },
  { number: 3, name: '三', readings: ['さん'], romajis: ['san'] },
  { number: 4, name: '四', readings: ['よん', 'し'], romajis: ['yon', 'shi'] },
  { number: 5, name: '五', readings: ['ご'], romajis: ['go'] },
  { number: 6, name: '六', readings: ['ろく'], romajis: ['roku'] },
  { number: 7, name: '七', readings: ['しち'], romajis: ['nana'] },
  { number: 8, name: '八', readings: ['はち'], romajis: ['hachi'] },
  { number: 9, name: '九', readings: ['きゅう'], romajis: ['kyu'] },
  { number: 10, name: '十', readings: ['じゅう'], romajis: ['ju'] },
]

export function getNumberByValue(value: number): LanguageNumber | undefined {
  if (value > 0 && value < 11) {
    return numbers.find((n) => n.number === value)
  } else if (value > 10 && value < 20) {
    const ones = numbers.find((n) => n.number === value - 10)
    if (!ones) return undefined

    let number: LanguageNumber = {
      number: value,
      name: '十' + ones.name,
      readings: ['じゅう' + ones.readings[0]],
      romajis: ['ju' + ones.romajis[0]],
    }
    return number
  } else if (value >= 20 && value < 100) {
    let tens = Math.floor(value / 10)
    let ones = value % 10
    const tensNumber = numbers.find((n) => n.number === tens)
    const onesNumber = numbers.find((n) => n.number === ones)
    if (!tensNumber || (ones > 0 && !onesNumber)) return undefined

    let number: LanguageNumber = {
      number: value,
      name: tensNumber.name + '十' + (ones > 0 ? onesNumber?.name : ''),
      readings: [tensNumber.readings[0] + 'じゅう' + (ones > 0 ? onesNumber?.readings[0] : '')],
      romajis: [tensNumber.romajis[0] + 'ju' + (ones > 0 ? onesNumber?.romajis[0] : '')],
    }
    return number
  }
}

export const japanese: LanguageInstruction = {
  id: 'japanese',
  label: 'Japanese',
  maxNumber: 99,
  getNumber: getNumberByValue,
  translate(number) {
    return getNumberByValue(number)?.name ?? ''
  },
  acceptedAnswers(number) {
    const answers: string[] = []
    const currentNumber = getNumberByValue(number)
    if (currentNumber) {
      answers.push(...currentNumber.readings)
      answers.push(...currentNumber.romajis)
      answers.push(currentNumber.name)
    }
    return answers
  },
}
