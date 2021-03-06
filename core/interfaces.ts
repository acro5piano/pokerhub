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
  | PokerActionCall
  | PokerActionEndShowDown

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

export interface PokerActionCall {
  type: 'CALL'
  payload: PokerActionPayload<{}>
}

export interface PokerActionEndShowDown {
  type: 'END_SHOW_DOWN'
  payload: PokerActionPayload<{}>
}

/*
 * Entities
 */

export const CardSymbol = ['spade', 'heart', 'diamond', 'clover'] as const
export type CardSym = typeof CardSymbol[number]
export type CardNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

export interface Card {
  num: CardNum
  sym: CardSym
}

export interface Player {
  id: string
  stack: number
  betting: number
  hand: [Card, Card] | Card[]
  position: number
  isActive: boolean
  isDead: boolean
  checed: boolean
  avatarImageUrl: string
}

export interface Board {
  cards: Card[]
  pot: number
  turnPlayerId: string
  dealerPlayerId: string
  bigBlind: number
  anti: number
  showDown: boolean
  winningHand: string
}

export interface Room {
  id: string
  board: Board
  players: Player[]
  isGameStarted: boolean
}
