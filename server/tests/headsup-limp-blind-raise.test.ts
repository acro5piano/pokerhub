import test from 'ava'
import store from '../src/store'
import { Card, getSerializedCard, DEFALT_STACK } from '../src/entities'

test.beforeEach(() => {
  Card.setFixedCardSeed(getSerializedCard())
})

const roomId = 'foo'

test('Headsup test - limping dealer, aggressive blind', t => {
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
        pot: 500,
        turnPlayerId: 'player1',
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK - 100,
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
          stack: DEFALT_STACK - 400,
          betting: 400,
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
