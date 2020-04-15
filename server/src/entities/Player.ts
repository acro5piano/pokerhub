import { Player as IPlayer } from '@fastpoker/core'
import { Card } from './Card'

export const DEFALT_STACK = 5000

export class Player implements IPlayer {
  id: string
  stack = DEFALT_STACK
  betting = 0
  hand: Card[] = []
  position: number
  isActive = true
  checed = false

  constructor(playerId: string, position: number) {
    this.id = playerId
    this.position = position
  }

  setHand() {
    this.hand = [new Card(), new Card()]
  }

  bet(amount: number): void {
    this.stack -= amount
    this.betting += amount
  }

  serialize() {
    return {
      ...this,
      hand: this.hand.map(h => h.serialize()),
    }
  }
}
