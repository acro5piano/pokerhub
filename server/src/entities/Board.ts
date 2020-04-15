import { Board as IBoard } from '@fastpoker/core'
import { Card } from './Card'

export const DEFAULT_BIG_BLIND = 100

export class Board implements IBoard {
  cards: Card[] = []
  pot = 0
  turnPlayerId = ''
  dealerPlayerId = ''
  bigBlind = DEFAULT_BIG_BLIND
  anti = 0
  showDown = false

  openCard() {
    this.cards.push(new Card())
  }

  serialize() {
    return {
      ...this,
      cards: this.cards.map(c => c.serialize()),
    }
  }
}
