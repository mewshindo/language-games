import type { LanguageInstruction, LanguageNumber } from '../types'

const numbers: LanguageNumber[] = [
  { number: 1, name: '一', readings: ['いち'], romajis: ['ichi'] },
  { number: 2, name: '二', readings: ['に'], romajis: ['ni'] },
  { number: 3, name: '三', readings: ['さん'], romajis: ['san'] },
  { number: 4, name: '四', readings: ['よん', 'し'], romajis: ['yon', 'shi'] },
  { number: 5, name: '五', readings: ['ご'], romajis: ['go'] },
  { number: 6, name: '六', readings: ['ろく'], romajis: ['roku'] },
  { number: 7, name: '七', readings: ['なな', 'しち'], romajis: ['nana', 'shichi'] },
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

    return {
      number: value,
      name: '十' + ones.name,
      readings: ones.readings.map((reading) => 'じゅう' + reading),
      romajis: ones.romajis.map((romaji) => 'ju' + romaji),
    }
  } else if (value >= 20 && value < 100) {
    const tens = Math.floor(value / 10)
    const ones = value % 10
    const tensNumber = numbers.find((n) => n.number === tens)
    const onesNumber = numbers.find((n) => n.number === ones)

    if (!tensNumber || (ones > 0 && !onesNumber)) return undefined

    const readings = tensNumber.readings.flatMap((tensReading) =>
      ones > 0
        ? onesNumber!.readings.map((onesReading) => `${tensReading}じゅう${onesReading}`)
        : [`${tensReading}じゅう`],
    )

    const romajis = tensNumber.romajis.flatMap((tensRomaji) =>
      ones > 0
        ? onesNumber!.romajis.map((onesRomaji) => `${tensRomaji}ju${onesRomaji}`)
        : [`${tensRomaji}ju`],
    )

    return {
      number: value,
      name: tensNumber.name + '十' + (ones > 0 ? onesNumber!.name : ''),
      readings,
      romajis,
    }
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
  getReadings(number) {
    const currentNumber = getNumberByValue(number)
    if (currentNumber?.readings != null && currentNumber.readings.length > 0) {
      return (
        currentNumber.readings[Math.floor(Math.random() * currentNumber.readings.length)] ?? '22'
      )
    }
    return ''
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
