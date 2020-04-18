import test from 'ava'
import store from '../src/store'
import { Card, DEFALT_STACK } from '../src/entities'

const cardSeed = [
  // player1
  { sym: 'spade' as const, num: 1 },
  { sym: 'spade' as const, num: 2 },
  // player2
  { sym: 'heart' as const, num: 3 },
  { sym: 'heart' as const, num: 4 },
  // board
  { sym: 'heart' as const, num: 3 },
  { sym: 'heart' as const, num: 4 },
  { sym: 'heart' as const, num: 5 },
  { sym: 'clover' as const, num: 3 },
  { sym: 'clover' as const, num: 4 },
]

test.beforeEach(() => {
  Card.setFixedCardSeed(cardSeed as any)
})

const roomId = 'foo'

test('Player death', t => {
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

  // Player 1 all in!
  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: DEFALT_STACK - 50,
    },
  })

  t.is(store.getState().findRoom(roomId).board.pot, 100 + DEFALT_STACK)
  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player2')
  t.is(store.getState().findRoom(roomId).players[0].stack, 0)
  t.is(store.getState().findRoom(roomId).players[0].betting, DEFALT_STACK)
  t.is(store.getState().findRoom(roomId).players[0].isDead, false)
  t.is(store.getState().findRoom(roomId).players[1].stack, DEFALT_STACK - 100)

  // Player 2 Call!
  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.pot, DEFALT_STACK * 2)
  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player2')
  t.is(store.getState().findRoom(roomId).players[0].stack, 0)
  t.is(store.getState().findRoom(roomId).players[1].stack, 0)
  t.is(store.getState().findRoom(roomId).players[1].isDead, false)

  t.is(store.getState().findRoom(roomId).board.showDown, true)

  store.dispatch({
    type: 'END_SHOW_DOWN',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).players[0].stack, 0)
  t.is(store.getState().findRoom(roomId).players[0].isDead, true)
  t.is(store.getState().findRoom(roomId).players[1].stack, 10000)
  t.is(store.getState().findRoom(roomId).players[1].isDead, false)
})
