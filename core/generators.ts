import { Card, CardNum, CardSymbol } from './interfaces'

const CardNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

export function createCard(): Card {
  const num = (Math.floor((Math.random() * 100) % 13) + 1) as CardNum
  const sym = CardSymbol[Math.floor((Math.random() * 100) % 4)]
  return { num, sym }
}
