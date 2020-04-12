import { Card, CardNum, CardSymbol } from './interfaces'

let cardSeed: Card[] = []

export function setCardSeed(seed: Card[]) {
  cardSeed = seed
}

export function createCard(): Card {
  if (cardSeed.length > 0) {
    return cardSeed.shift()
  }
  const num = (Math.floor((Math.random() * 100) % 13) + 1) as CardNum
  const sym = CardSymbol[Math.floor((Math.random() * 100) % 4)]
  return { num, sym }
}
