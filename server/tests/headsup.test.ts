import test from 'ava'
import store from '../src/store'
import { Card, getSerializedCard, DEFALT_STACK } from '../src/entities'

test.beforeEach(() => {
  Card.setFixedCardSeed(getSerializedCard())
})

const roomId = 'foo'

test('Headsup test - aggressive dealer', t => {
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
        pot: 150,
        turnPlayerId: 'player1',
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK - 50,
          betting: 50,
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
          stack: DEFALT_STACK - 100,
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
        pot: 450,
        turnPlayerId: 'player2',
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK - 350,
          betting: 350,
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
          stack: DEFALT_STACK - 100,
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

  // Player 2 fold, and player 1 gets the bot
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
          stack: DEFALT_STACK,
          betting: 100,
          hand: [
            { num: 5, sym: 'spade' },
            { num: 6, sym: 'spade' },
          ],
          position: 0,
          isActive: true,
          checed: false,
        },
        {
          id: 'player2',
          stack: DEFALT_STACK - 150,
          betting: 50,
          hand: [
            { num: 7, sym: 'spade' },
            { num: 8, sym: 'spade' },
          ],
          position: 1,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])
})
