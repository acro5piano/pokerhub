import anyTest, { TestInterface } from 'ava'
import { Store, makeStore } from '../src/store'
import { Card, getSerializedCard } from '../src/entities'

const roomId = 'foo'
const test = anyTest as TestInterface<Store>
const players = ['player1', 'player2', 'player3']

test.beforeEach(t => {
  Card.setFixedCardSeed(getSerializedCard())
  t.context = makeStore()

  const store = t.context
  store.dispatch({
    type: 'CREATE_ROOM',
    payload: {
      roomId,
    },
  })

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

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player1')
})

test('All In', t => {
  const store = t.context

  t.is(store.getState().findRoom(roomId).board.pot, 150)

  store.getState().findRoom(roomId).players[1].stack = 200
  t.is(store.getState().findRoom(roomId).players[1].stack, 200)

  // Player 1 stack is 5000
  // Player 2 stack is 200
  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: 500,
    },
  })

  t.is(store.getState().findRoom(roomId).board.pot, 150 + 500)

  // Player 2 call with all in
  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).players[1].stack, 0)
})
