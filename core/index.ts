export type PokerPayload = PokerPayloadJoin

export interface PokerPayloadJoin {
  type: 'join'
  payload: {
    room: string
    name: string
  }
}
