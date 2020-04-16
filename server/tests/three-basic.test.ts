import test from 'ava'
import { times } from '@pokerhub/core'
import store from '../src/store'
import { Card, getSerializedCard, DEFALT_STACK } from '../src/entities'

test.beforeEach(() => {
  Card.setFixedCardSeed(getSerializedCard())
})

const roomId = 'foo'

test('Three player basic test', t => {
  times(5, () => {
    store.dispatch({
      type: 'CREATE_ROOM',
      payload: {
        roomId,
      },
    })
  })

  t.is(store.getState().findRoom(roomId).board.pot, 0)
  t.is(store.getState().findRoom(roomId).isGameStarted, false)
  t.is(store.getState().findRoom(roomId).board.turnPlayerId, '')
  t.is(store.getState().findRoom(roomId).board.dealerPlayerId, '')
  t.is(store.getState().findRoom(roomId).board.bigBlind, 100)
  t.is(store.getState().findRoom(roomId).board.showDown, false)
  t.is(store.getState().findRoom(roomId).board.anti, 0)
  t.deepEqual(store.getState().findRoom(roomId).players, [])

  const players = ['player1', 'player2', 'player3']

  times(5, () => {
    players.forEach(userId =>
      store.dispatch({
        type: 'JOIN_ROOM',
        payload: {
          roomId,
          userId,
        },
      }),
    )
  })

  t.is(store.getState().findRoom(roomId).players.length, 3)
  players.forEach((playerId, i) => {
    t.is(store.getState().findRoom(roomId).findOrCreatePlayer(playerId).stack, DEFALT_STACK)
    t.is(store.getState().findRoom(roomId).findOrCreatePlayer(playerId).betting, 0)
    t.is(store.getState().findRoom(roomId).findOrCreatePlayer(playerId).position, i)
  })

  store.dispatch({
    type: 'START_GAME',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).isGameStarted, true)
  t.is(store.getState().findRoom(roomId).board.dealerPlayerId, 'player1')
  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player1')
  players.forEach(playerId => {
    t.is(store.getState().findRoom(roomId).findOrCreatePlayer(playerId).hand.length, 2)
    t.is(
      store.getState().findRoom(roomId).findOrCreatePlayer(playerId).hand[0].sym,
      'spade' as const,
    )
  })
  t.is(store.getState().findRoom(roomId).players[0].betting, 0)
  t.is(store.getState().findRoom(roomId).players[1].betting, 50)
  t.is(store.getState().findRoom(roomId).players[2].betting, 100)

  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: 300,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player2')
  t.is(store.getState().findRoom(roomId).players[0].betting, 300)
  t.is(store.getState().findRoom(roomId).players[0].stack, DEFALT_STACK - 300)

  // Player 2 fold
  store.dispatch({
    type: 'FOLD',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player3')
  t.is(store.getState().findRoom(roomId).players[1].betting, 50)
  t.is(store.getState().findRoom(roomId).players[1].stack, DEFALT_STACK - 50)

  // Player 3 call
  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  // In Flop, starting from the smallBlind
  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player3')
  t.is(store.getState().findRoom(roomId).players[0].betting, 0)
  t.is(store.getState().findRoom(roomId).players[0].stack, DEFALT_STACK - 300)
  t.is(store.getState().findRoom(roomId).players[2].betting, 0)
  t.is(store.getState().findRoom(roomId).players[2].stack, DEFALT_STACK - 300)
  t.is(store.getState().findRoom(roomId).board.cards.length, 3)

  // FLOP

  // Player 3 check
  store.dispatch({
    type: 'CHECK',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player1')
  t.is(store.getState().findRoom(roomId).players[2].betting, 0)
  t.is(store.getState().findRoom(roomId).players[2].stack, DEFALT_STACK - 300)

  // player 1 also check.
  store.dispatch({
    type: 'CHECK',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player3')
  t.is(store.getState().findRoom(roomId).players[0].betting, 0)
  t.is(store.getState().findRoom(roomId).players[0].stack, DEFALT_STACK - 300)
  t.is(store.getState().findRoom(roomId).board.cards.length, 4)

  // TURN

  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: 300,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player1')
  t.is(store.getState().findRoom(roomId).board.pot, 950)
  t.is(store.getState().findRoom(roomId).players[2].betting, 300)
  t.is(store.getState().findRoom(roomId).players[2].stack, DEFALT_STACK - 600)

  // Player 1 Re-Raise
  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: 600,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player3')
  t.is(store.getState().findRoom(roomId).board.pot, 1550)
  t.is(store.getState().findRoom(roomId).players[0].betting, 600)
  t.is(store.getState().findRoom(roomId).players[0].stack, DEFALT_STACK - 300 - 600)
  t.is(store.getState().findRoom(roomId).players[2].betting, 300)
  t.is(store.getState().findRoom(roomId).players[2].stack, DEFALT_STACK - 600)

  // Player 3 Call to the Re-Raise
  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player3')
  t.is(store.getState().findRoom(roomId).board.pot, 1850)
  t.is(store.getState().findRoom(roomId).players[2].betting, 0)
  t.is(store.getState().findRoom(roomId).players[2].stack, DEFALT_STACK - 900)

  // RIVER

  // Both of them checked
  store.dispatch({
    type: 'CHECK',
    payload: {
      roomId,
    },
  })
  store.dispatch({
    type: 'CHECK',
    payload: {
      roomId,
    },
  })

  t.is(store.getState().findRoom(roomId).board.showDown, true)

  store.dispatch({
    type: 'END_SHOW_DOWN',
    payload: {
      roomId,
    },
  })

  // The result is "chop". Proceed to the next game.
  t.is(store.getState().findRoom(roomId).board.showDown, false)
  t.is(store.getState().findRoom(roomId).board.turnPlayerId, 'player2')
  t.is(store.getState().findRoom(roomId).board.pot, 150)
  t.is(store.getState().findRoom(roomId).players[0].betting, 100)
  t.is(store.getState().findRoom(roomId).players[0].stack, DEFALT_STACK + 25 - 100)
  t.is(store.getState().findRoom(roomId).players[1].betting, 0)
  t.is(store.getState().findRoom(roomId).players[1].stack, DEFALT_STACK - 50)
  t.is(store.getState().findRoom(roomId).players[2].betting, 50)
  t.is(store.getState().findRoom(roomId).players[2].stack, DEFALT_STACK + 25 - 50)
})
