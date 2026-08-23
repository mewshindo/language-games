export type LanguageInstruction = {
  id: string
  label: string
  maxNumber: number
  translate(number: number): string
  acceptedAnswers(number: number): string[]
  getNumber(number: number): LanguageNumber | undefined
}
export type LanguageNumber = {
  number: number
  name: string
  readings: string[]
  romajis: string[]
}
import { japanese } from './ja/ja'

export const languages = {
  japanese,
}
