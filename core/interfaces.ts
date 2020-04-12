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

export const CardSymbol = ['heart', 'diamond', 'clover', 'spade'] as const
export type CardSymbol = typeof CardSymbol[number]
export type CardNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

export interface Card {
  num: CardNum
  sym: CardSymbol
}

export interface Player {
  id: string
  stack: number
  betting: number
  hand: [Card, Card] | Card[]
  position: number
  isActive: boolean
}

export interface Board {
  cards: Card[]
  pot: number
  turnPlayerId: string
  dealerPlayerId: string
  blind: number
  anti: number
}

export interface Room {
  id: string
  board: Board
  players: Player[]
  isGameStarted: boolean
}
