import test from 'ava'
import store from '../src/store'
import { Card, getSerializedCard, DEFALT_STACK } from '../src/entities'

test.beforeEach(() => {
  Card.setFixedCardSeed(getSerializedCard())
})

const roomId = 'foo'

test('Headsup test - aggressive dealer', t => {
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

  t.is(store.getState().findRoom(roomId).board.pot, 150)
  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player1')
  t.is(store.getState().findRoom(roomId).players[0].stack, DEFALT_STACK - 50)
  t.is(store.getState().findRoom(roomId).players[1].stack, DEFALT_STACK - 100)

  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: 300,
    },
  })

  t.is(store.getState().findRoom(roomId).board.pot, 450)
  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player2')
  t.is(store.getState().findRoom(roomId).players[0].stack, DEFALT_STACK - 350)
  t.is(store.getState().findRoom(roomId).players[1].stack, DEFALT_STACK - 100)

  // Player 2 fold, and player 1 gets the bot
  store.dispatch({
    type: 'FOLD',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.pot, 150)
  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player2')
  t.is(store.getState().findRoom(roomId).players[0].stack, DEFALT_STACK + 100 - 100)
  t.is(store.getState().findRoom(roomId).players[1].stack, DEFALT_STACK - 100 - 50)
})
