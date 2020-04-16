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
  isDead = false
  checed = false

  constructor(playerId: string, position: number) {
    this.id = playerId
    this.position = position
  }

  canHasTurn() {
    return this.isActive && this.hand.length > 0 && !this.isDead
  }

  setHand() {
    this.hand = [new Card(), new Card()]
  }

  bet(amount: number): void {
    if (this.isDead) {
      return
    }
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
