/*
 * Actions
 */

export type PokerAction =
  | PokerActionCreateRoom
  | PokerActionJoinRoom
  | PokerActionStartGame
  | PokerActionBet
  | PokerActionFold
  | PokerActionCheck

export type PokerActionPayload<T> = T & {
  roomId: string
}

export interface PokerActionCreateRoom {
  type: 'CREATE_ROOM'
  payload: PokerActionPayload<{}>
}

export interface PokerActionJoinRoom {
  type: 'JOIN_ROOM'
  payload: PokerActionPayload<{ userId: string }>
}

export interface PokerActionStartGame {
  type: 'START_GAME'
  payload: PokerActionPayload<{}>
}

export interface PokerActionBet {
  type: 'BET'

  payload: PokerActionPayload<{ amount: number }>
}

export interface PokerActionFold {
  type: 'FOLD'
  payload: PokerActionPayload<{}>
}

export interface PokerActionCheck {
  type: 'CHECK'
  payload: PokerActionPayload<{}>
}

/*
 * Entities
 */

export type CardSymbol = 'heart' | 'diamond' | 'clover' | 'spade'

export interface Card {
  num: number
  sym: CardSymbol
}

export interface Player {
  id: string
  stack: number
  betting: number
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
  turnPlayerId: string
}
