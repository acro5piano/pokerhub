import { Card as ICard, CardNum, CardSymbol } from '@fastpoker/core'

export class Card implements ICard {
  num: CardNum
  sym: CardSymbol
  static cardSeed: ICard[] = []

  static setCardSeed(cardSeed: ICard[]) {
    Card.cardSeed = cardSeed
  }

  constructor() {
    if (Card.cardSeed.length > 0) {
      const { num, sym } = Card.cardSeed.shift()!
      this.num = num
      this.sym = sym
    } else {
      this.num = (Math.floor((Math.random() * 100) % 13) + 1) as CardNum
      this.sym = CardSymbol[Math.floor((Math.random() * 100) % 4)]
    }
  }

  serialize() {
    return {
      ...this,
    }
  }
}
