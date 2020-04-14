import test from 'ava'
import store from '../src/store'
import { Card, getSerializedCard } from '../src/entities'

test.beforeEach(() => {
  Card.setFixedCardSeed(getSerializedCard())
})

const roomId = 'foo'

test('Headsup test - limping dealer', t => {
  const assertState = (s: any) => {
    t.deepEqual(s, store.getState().serialize())
  }

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

  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  assertState([
    {
      id: 'foo',
      isGameStarted: true,
      board: {
        dealerPlayerId: 'player1',
        bigBlind: 100,
        anti: 0,
        showDown: false,
        cards: [],
        pot: 200,
        turnPlayerId: 'player2',
      },
      players: [
        {
          id: 'player1',
          stack: 1400,
          betting: 100,
          hand: [
            { num: 1, sym: 'spade' },
            { num: 2, sym: 'spade' },
          ],
          position: 0,
          isActive: true,
          checed: false,
        },
        {
          id: 'player2',
          stack: 1400,
          betting: 100,
          hand: [
            { num: 3, sym: 'spade' },
            { num: 4, sym: 'spade' },
          ],
          position: 1,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])

  // Player 2
  store.dispatch({
    type: 'CHECK',
    payload: {
      roomId,
    },
  })

  // FLOP

  // Player 2
  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: 300,
    },
  })

  // Player 1
  store.dispatch({
    type: 'FOLD',
    payload: {
      roomId,
    },
  })

  assertState([
    {
      id: 'foo',
      isGameStarted: true,
      board: {
        dealerPlayerId: 'player2',
        bigBlind: 100,
        anti: 0,
        showDown: false,
        cards: [],
        pot: 150,
        turnPlayerId: 'player2',
      },
      players: [
        {
          id: 'player1',
          stack: 1300,
          betting: 100,
          hand: [
            { num: 8, sym: 'spade' },
            { num: 9, sym: 'spade' },
          ],
          position: 0,
          isActive: true,
          checed: false,
        },
        {
          id: 'player2',
          stack: 1550,
          betting: 50,
          hand: [
            { num: 10, sym: 'spade' },
            { num: 11, sym: 'spade' },
          ],
          position: 1,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])
})
