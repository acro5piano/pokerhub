import test from 'ava'
import store from '../src/store'
import { Card, getSerializedCard, DEFALT_STACK } from '../src/entities'

test.beforeEach(() => {
  Card.setFixedCardSeed(getSerializedCard())
})

const roomId = 'foo'

test('Headsup test - limping dealer, aggressive blind', t => {
  store.dispatch({
    type: 'CREATE_ROOM',
    payload: {
      roomId,
    },
  })

  const players = ['player1', 'player2']

  players.forEach(userId =>
    store.dispatch({
      type: 'JOIN_ROOM',
      payload: {
        roomId,
        userId,
      },
    }),
  )

  store.dispatch({
    type: 'START_GAME',
    payload: {
      roomId,
    },
  })

  // Limping dealer
  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  // Aggressive Blind
  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: 300,
    },
  })

  t.is(store.getState().findRoom(roomId).board.pot, 500)
  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player1')

  t.is(store.getState().findRoom(roomId).players[0].betting, 100)
  t.is(store.getState().findRoom(roomId).players[0].stack, DEFALT_STACK - 100)

  t.deepEqual(store.getState().findRoom(roomId).players[0].serialize().hand, [
    { num: 1 as const, sym: 'spade' as const },
    { num: 2 as const, sym: 'spade' as const },
  ] as any)

  t.is(store.getState().findRoom(roomId).players[1].betting, 400)
  t.is(store.getState().findRoom(roomId).players[1].stack, DEFALT_STACK - 400)

  // Limping dealer
  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  // ...then, go to flop
  t.is(store.getState().rooms[0].board.cards.length, 3)
  t.is(store.getState().rooms[0].board.turnPlayerId, 'player2')
})
