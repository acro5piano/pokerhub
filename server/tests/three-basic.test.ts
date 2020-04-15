import test from 'ava'
import { times, Room } from '@fastpoker/core'
import store from '../src/store'
import { Card, getSerializedCard, DEFALT_STACK } from '../src/entities'

test.beforeEach(() => {
  Card.setFixedCardSeed(getSerializedCard())
})

test('Three player basic test', t => {
  const roomId = 'foo'

  const assertState = (s: any) => {
    t.deepEqual(s, store.getState().serialize())
  }

  times(5, () => {
    store.dispatch({
      type: 'CREATE_ROOM',
      payload: {
        roomId,
      },
    })
  })

  assertState([
    {
      id: roomId,
      isGameStarted: false,
      board: {
        cards: [],
        pot: 0,
        dealerPlayerId: '',
        turnPlayerId: '',
        bigBlind: 100,
        anti: 0,
        showDown: false,
      },
      players: [],
    },
  ])

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

  assertState([
    {
      id: 'foo',
      isGameStarted: false,
      board: {
        cards: [],
        pot: 0,
        dealerPlayerId: '',
        turnPlayerId: '',
        bigBlind: 100,
        anti: 0,
        showDown: false,
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK,
          betting: 0,
          hand: [],
          position: 0,
          isActive: true,
          checed: false,
        },
        {
          id: 'player2',
          stack: DEFALT_STACK,
          betting: 0,
          hand: [],
          position: 1,
          isActive: true,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK,
          betting: 0,
          hand: [],
          position: 2,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])

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
        cards: [],
        pot: 150,
        turnPlayerId: 'player1',
        showDown: false,
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK,
          betting: 0,
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
          stack: DEFALT_STACK - 50,
          betting: 50,
          hand: [
            { num: 3, sym: 'spade' },
            { num: 4, sym: 'spade' },
          ],
          position: 1,
          isActive: true,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK - 100,
          betting: 100,
          hand: [
            { num: 5, sym: 'spade' },
            { num: 6, sym: 'spade' },
          ],
          position: 2,
          isActive: true,
          checed: false,
        },
      ],
    },
  ] as Room[])

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
          stack: DEFALT_STACK - 300,
          betting: 300,
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
          stack: DEFALT_STACK - 50,
          betting: 50,
          hand: [
            { num: 3, sym: 'spade' },
            { num: 4, sym: 'spade' },
          ],
          position: 1,
          isActive: true,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK - 100,
          betting: 100,
          hand: [
            { num: 5, sym: 'spade' },
            { num: 6, sym: 'spade' },
          ],
          position: 2,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])

  // Player 2 fold
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
        dealerPlayerId: 'player1',
        bigBlind: 100,
        anti: 0,
        showDown: false,
        cards: [],
        pot: 450,
        turnPlayerId: 'player3',
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK - 300,
          betting: 300,
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
          stack: DEFALT_STACK - 50,
          betting: 50,
          hand: [
            { num: 3, sym: 'spade' },
            { num: 4, sym: 'spade' },
          ],
          position: 1,
          isActive: false,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK - 100,
          betting: 100,
          hand: [
            { num: 5, sym: 'spade' },
            { num: 6, sym: 'spade' },
          ],
          position: 2,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])

  // Player 3 call
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
        cards: [
          { num: 7, sym: 'spade' },
          { num: 8, sym: 'spade' },
          { num: 9, sym: 'spade' },
        ],
        pot: 650,
        turnPlayerId: 'player3', // In Flop, starting from smallBlind
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK - 300,
          betting: 0,
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
          stack: DEFALT_STACK - 50,
          betting: 0,
          hand: [
            { num: 3, sym: 'spade' },
            { num: 4, sym: 'spade' },
          ],
          position: 1,
          isActive: false,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK - 300,
          betting: 0,
          hand: [
            { num: 5, sym: 'spade' },
            { num: 6, sym: 'spade' },
          ],
          position: 2,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])

  // FLOP

  // Player 3 check
  store.dispatch({
    type: 'CHECK',
    payload: {
      roomId,
    },
  })

  assertState([
    {
      id: roomId,
      isGameStarted: true,
      board: {
        dealerPlayerId: 'player1',
        bigBlind: 100,
        anti: 0,
        showDown: false,
        cards: [
          { num: 7, sym: 'spade' },
          { num: 8, sym: 'spade' },
          { num: 9, sym: 'spade' },
        ],
        pot: 650,
        turnPlayerId: 'player1',
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK - 300,
          betting: 0,
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
          stack: DEFALT_STACK - 50,
          betting: 0,
          hand: [
            { num: 3, sym: 'spade' },
            { num: 4, sym: 'spade' },
          ],
          position: 1,
          isActive: false,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK - 300,
          betting: 0,
          hand: [
            { num: 5, sym: 'spade' },
            { num: 6, sym: 'spade' },
          ],
          position: 2,
          isActive: true,
          checed: true,
        },
      ],
    },
  ])

  // player 1 also check.
  store.dispatch({
    type: 'CHECK',
    payload: {
      roomId,
    },
  })

  assertState([
    {
      id: roomId,
      isGameStarted: true,
      board: {
        dealerPlayerId: 'player1',
        bigBlind: 100,
        anti: 0,
        showDown: false,
        cards: [
          { num: 7, sym: 'spade' },
          { num: 8, sym: 'spade' },
          { num: 9, sym: 'spade' },
          { num: 10, sym: 'spade' },
        ],
        pot: 650,
        turnPlayerId: 'player3',
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK - 300,
          betting: 0,
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
          stack: DEFALT_STACK - 50,
          betting: 0,
          hand: [
            { num: 3, sym: 'spade' },
            { num: 4, sym: 'spade' },
          ],
          position: 1,
          isActive: false,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK - 300,
          betting: 0,
          hand: [
            { num: 5, sym: 'spade' },
            { num: 6, sym: 'spade' },
          ],
          position: 2,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])

  // TURN

  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: 300,
    },
  })

  assertState([
    {
      id: roomId,
      isGameStarted: true,
      board: {
        dealerPlayerId: 'player1',
        bigBlind: 100,
        anti: 0,
        showDown: false,
        cards: [
          { num: 7, sym: 'spade' },
          { num: 8, sym: 'spade' },
          { num: 9, sym: 'spade' },
          { num: 10, sym: 'spade' },
        ],
        pot: 950,
        turnPlayerId: 'player1',
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK - 300,
          betting: 0,
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
          stack: DEFALT_STACK - 50,
          betting: 0,
          hand: [
            { num: 3, sym: 'spade' },
            { num: 4, sym: 'spade' },
          ],
          position: 1,
          isActive: false,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK - 600,
          betting: 300,
          hand: [
            { num: 5, sym: 'spade' },
            { num: 6, sym: 'spade' },
          ],
          position: 2,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])

  // Player 1 Re-Raise
  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: 600,
    },
  })

  assertState([
    {
      id: roomId,
      isGameStarted: true,
      board: {
        dealerPlayerId: 'player1',
        bigBlind: 100,
        anti: 0,
        showDown: false,
        cards: [
          { num: 7, sym: 'spade' },
          { num: 8, sym: 'spade' },
          { num: 9, sym: 'spade' },
          { num: 10, sym: 'spade' },
        ],
        pot: 1550,
        turnPlayerId: 'player3',
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK - 900,
          betting: 600,
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
          stack: DEFALT_STACK - 50,
          betting: 0,
          hand: [
            { num: 3, sym: 'spade' },
            { num: 4, sym: 'spade' },
          ],
          position: 1,
          isActive: false,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK - 600,
          betting: 300,
          hand: [
            { num: 5, sym: 'spade' },
            { num: 6, sym: 'spade' },
          ],
          position: 2,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])

  // Player 3 Call to the Re-Raise
  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  assertState([
    {
      id: roomId,
      isGameStarted: true,
      board: {
        dealerPlayerId: 'player1',
        bigBlind: 100,
        anti: 0,
        showDown: false,
        cards: [
          { num: 7, sym: 'spade' },
          { num: 8, sym: 'spade' },
          { num: 9, sym: 'spade' },
          { num: 10, sym: 'spade' },
          { num: 11, sym: 'spade' },
        ],
        pot: 1850,
        turnPlayerId: 'player3',
      },
      players: [
        {
          id: 'player1',
          stack: DEFALT_STACK - 900,
          betting: 0,
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
          stack: DEFALT_STACK - 50,
          betting: 0,
          hand: [
            { num: 3, sym: 'spade' },
            { num: 4, sym: 'spade' },
          ],
          position: 1,
          isActive: false,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK - 900,
          betting: 0,
          hand: [
            { num: 5, sym: 'spade' },
            { num: 6, sym: 'spade' },
          ],
          position: 2,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])

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

  assertState([
    {
      id: roomId,
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
          stack: DEFALT_STACK - 75,
          betting: 100,
          hand: [
            { num: 12, sym: 'spade' },
            { num: 13, sym: 'spade' },
          ],
          position: 0,
          isActive: true,
          checed: false,
        },
        {
          id: 'player2',
          stack: DEFALT_STACK - 50,
          betting: 0,
          hand: [
            { num: 1, sym: 'heart' },
            { num: 2, sym: 'heart' },
          ],
          position: 1,
          isActive: true,
          checed: false,
        },
        {
          id: 'player3',
          stack: DEFALT_STACK - 25,
          betting: 50,
          hand: [
            { num: 3, sym: 'heart' },
            { num: 4, sym: 'heart' },
          ],
          position: 2,
          isActive: true,
          checed: false,
        },
      ],
    },
  ])
})
