import { Board as IBoard } from '@fastpoker/core'
import { Card } from './Card'

export class Board implements IBoard {
  cards: Card[] = []
  pot = 0
  turnPlayerId = ''
  dealerPlayerId = ''
  bigBlind = 100
  anti = 0

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
