import { Player as IPlayer } from '@pokerhub/core'
import { Card } from './Card'

export const DEFALT_STACK = 5000

function getAvatarImageUrl() {
  return `/avatars/${(Math.floor(Math.random() * 100) % 11) + 1}.jpg`
}

export class Player implements IPlayer {
  id: string
  stack = DEFALT_STACK
  betting = 0
  hand: Card[] = []
  position: number
  isActive = true
  isDead = false
  checed = false
  avatarImageUrl = getAvatarImageUrl()

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
    if (this.isDead || this.stack <= 0) {
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
