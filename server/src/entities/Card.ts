import { times, Card as ICard, CardNum, CardSym } from '@fastpoker/core'

export const getSerializedCard = () => [
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

const rankMap = new Map<CardNum, string>([
  [1, 'A'],
  [2, '2'],
  [3, '3'],
  [4, '4'],
  [5, '5'],
  [6, '6'],
  [7, '7'],
  [8, '8'],
  [9, '9'],
  [10, 'T'],
  [11, 'J'],
  [12, 'Q'],
  [13, 'K'],
])

const suitMap = new Map<CardSym, string>([
  ['diamond', 'd'],
  ['heart', 'h'],
  ['clover', 'c'],
  ['spade', 's'],
])

export class Card implements ICard {
  num: CardNum
  sym: CardSym
  private static fixedCardSeed: ICard[] = [] // For testing
  private static cardSeed: ICard[] = []

  static setFixedCardSeed(cardSeed: ICard[]) {
    Card.fixedCardSeed = cardSeed
  }

  static randomizeSeed() {
    if (Card.fixedCardSeed.length > 0) {
      Card.cardSeed = Card.fixedCardSeed
    } else {
      Card.cardSeed = getSerializedCard().sort(() => Math.random() - Math.random())
    }
  }

  constructor(givenNum?: CardNum, givenSym?: CardSym) {
    if (givenNum && givenSym) {
      this.num = givenNum
      this.sym = givenSym
    } else {
      if (Card.cardSeed.length === 0) {
        throw new Error('Card.cardSeed is empty. this is a bug')
      }
      const { num, sym } = Card.cardSeed.shift()!
      this.num = num
      this.sym = sym
    }
  }

  getId() {
    return `${this.num}/${this.sym}`
  }

  toSolverValue() {
    const r = rankMap.get(this.num)
    const s = suitMap.get(this.sym)
    if (!r || !s) {
      throw new Error('rank or suit not found. this is a bug')
    }
    return `${r}${s}`
  }

  serialize() {
    return {
      ...this,
    }
  }
}
