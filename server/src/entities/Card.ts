import { times, Card as ICard, CardNum, CardSymbol } from '@fastpoker/core'

export const serializedCard = [
  ...times(13, (i: any) => {
    return {
      sym: 'spade' as const,
      num: i + 1,
    }
  }),
  ...times(13, (i: any) => {
    return {
      sym: 'heart' as const,
      num: i + 1,
    }
  }),
  ...times(13, (i: any) => {
    return {
      sym: 'clover' as const,
      num: i + 1,
    }
  }),
  ...times(13, (i: any) => {
    return {
      sym: 'diamond' as const,
      num: i + 1,
    }
  }),
]

export class Card implements ICard {
  num: CardNum
  sym: CardSymbol
  private static fixedCardSeed: ICard[] = [] // For testing
  private static cardSeed: ICard[] = []

  static setFixedCardSeed(cardSeed: ICard[]) {
    Card.fixedCardSeed = cardSeed
  }

  static randomizeSeed() {
    if (Card.fixedCardSeed.length > 0) {
      Card.cardSeed = Card.fixedCardSeed
    } else {
      Card.cardSeed = serializedCard.sort(() => Math.random() - Math.random())
    }
  }

  getId() {
    return `${this.num}/${this.sym}`
  }

  constructor() {
    if (Card.cardSeed.length === 0) {
      throw new Error('Card.cardSeed is empty. this is a bug')
    }
    const { num, sym } = Card.cardSeed.shift()!
    this.num = num
    this.sym = sym
  }

  serialize() {
    return {
      ...this,
    }
  }
}
