import anyTest, { TestInterface } from 'ava'
import { Store, makeStore } from '../src/store'
import { Card, getSerializedCard } from '../src/entities'

const roomId = 'foo'
const test = anyTest as TestInterface<Store>
const players = ['player1', 'player2', 'player3', 'player4']

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

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player4')
})

test('For players limping', t => {
  const store = t.context

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player4')

  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player1')

  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player2')

  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player3')
})

test('For players limping, dealer fold', t => {
  const store = t.context

  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player1')

  store.dispatch({
    type: 'FOLD',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player2')

  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player3')

  store.dispatch({
    type: 'CHECK',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player2')
})
