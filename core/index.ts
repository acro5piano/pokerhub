export type PokerAction = PokerActionJoinRoom | PokerActionCreateRoom

export interface PokerActionJoinRoom {
  type: 'JOIN_ROOM'
  payload: {
    roomId: string
    name: string
  }
}

export interface PokerActionCreateRoom {
  type: 'CREATE_ROOM'
  payload: {
    roomId: string
  }
}

export type CardSymbol = 'heart' | 'diamond' | 'clover' | 'spade'

export interface Card {
  num: number
  sym: CardSymbol
}

export interface Player {
  id: string
  stack: number
  hand: [Card, Card] | []
  position: number
  isActive: boolean
}

export interface Board {
  cards: Card[]
  pot: number
}

export interface Room {
  id: string
  board: Board
  players: Player[]
}
