import test from 'ava'
import store from '../src/store'
import { Card, getSerializedCard } from '../src/entities'

test.beforeEach(() => {
  Card.setFixedCardSeed(getSerializedCard())
})

test('Three players limping test', t => {
  const roomId = 'foo'

  store.dispatch({
    type: 'CREATE_ROOM',
    payload: {
      roomId,
    },
  })

  const players = ['player1', 'player2', 'player3']

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

  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
      amount: 300,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player2')

  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
      amount: 300,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player3')
})
