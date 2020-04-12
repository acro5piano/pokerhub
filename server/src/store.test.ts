import test from 'ava'
import store from './store'
import { times, setCardSeed, Room } from '@fastpoker/core'

test.beforeEach(() => {
  setCardSeed(
    times(13, (i: any) => {
      return {
        sym: 'spade' as const,
        num: i + 1,
      }
    }),
  )
})

test('GAME', t => {
  const roomId = 'foo'

  times(5, () => {
    store.dispatch({
      type: 'CREATE_ROOM',
      payload: {
        roomId,
      },
    })
    return 1
  })

  t.deepEqual(
    [
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
        },
        players: [],
      },
    ],
    store.getState(),
  )

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

  t.deepEqual(
    [
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
        },
        players: [
          {
            id: 'player1',
            stack: 1500,
            betting: 0,
            hand: [],
            position: 1,
            isActive: true,
            checed: false,
          },
          {
            id: 'player2',
            stack: 1500,
            betting: 0,
            hand: [],
            position: 2,
            isActive: true,
            checed: false,
          },
          {
            id: 'player3',
            stack: 1500,
            betting: 0,
            hand: [],
            position: 3,
            isActive: true,
            checed: false,
          },
        ],
      },
    ],
    store.getState(),
  )

  store.dispatch({
    type: 'START_GAME',
    payload: {
      roomId,
    },
  })

  t.deepEqual(
    [
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
        },
        players: [
          {
            id: 'player1',
            stack: 1500,
            betting: 0,
            hand: [
              { num: 1, sym: 'spade' },
              { num: 2, sym: 'spade' },
            ],
            position: 1,
            isActive: true,
            checed: false,
          },
          {
            id: 'player2',
            stack: 1450,
            betting: 50,
            hand: [
              { num: 3, sym: 'spade' },
              { num: 4, sym: 'spade' },
            ],
            position: 2,
            isActive: true,
            checed: false,
          },
          {
            id: 'player3',
            stack: 1400,
            betting: 100,
            hand: [
              { num: 5, sym: 'spade' },
              { num: 6, sym: 'spade' },
            ],
            position: 3,
            isActive: true,
            checed: false,
          },
        ],
      },
    ] as Room[],
    store.getState(),
  )

  store.dispatch({
    type: 'BET',
    payload: {
      roomId,
      amount: 300,
    },
  })

  t.deepEqual(
    [
      {
        id: 'foo',
        isGameStarted: true,
        board: {
          dealerPlayerId: 'player1',
          bigBlind: 100,
          anti: 0,
          cards: [],
          pot: 450,
          turnPlayerId: 'player2',
        },
        players: [
          {
            id: 'player1',
            stack: 1200,
            betting: 300,
            hand: [
              { num: 1, sym: 'spade' },
              { num: 2, sym: 'spade' },
            ],
            position: 1,
            isActive: true,
            checed: false,
          },
          {
            id: 'player2',
            stack: 1450,
            betting: 50,
            hand: [
              { num: 3, sym: 'spade' },
              { num: 4, sym: 'spade' },
            ],
            position: 2,
            isActive: true,
            checed: false,
          },
          {
            id: 'player3',
            stack: 1400,
            betting: 100,
            hand: [
              { num: 5, sym: 'spade' },
              { num: 6, sym: 'spade' },
            ],
            position: 3,
            isActive: true,
            checed: false,
          },
        ],
      },
    ],
    store.getState(),
  )

  // Player 2 fold
  store.dispatch({
    type: 'FOLD',
    payload: {
      roomId,
    },
  })

  t.deepEqual(
    [
      {
        id: 'foo',
        isGameStarted: true,
        board: {
          dealerPlayerId: 'player1',
          bigBlind: 100,
          anti: 0,
          cards: [],
          pot: 450,
          turnPlayerId: 'player3',
        },
        players: [
          {
            id: 'player1',
            stack: 1200,
            betting: 300,
            hand: [
              { num: 1, sym: 'spade' },
              { num: 2, sym: 'spade' },
            ],
            position: 1,
            isActive: true,
            checed: false,
          },
          {
            id: 'player2',
            stack: 1450,
            betting: 50,
            hand: [
              { num: 3, sym: 'spade' },
              { num: 4, sym: 'spade' },
            ],
            position: 2,
            isActive: false,
            checed: false,
          },
          {
            id: 'player3',
            stack: 1400,
            betting: 100,
            hand: [
              { num: 5, sym: 'spade' },
              { num: 6, sym: 'spade' },
            ],
            position: 3,
            isActive: true,
            checed: false,
          },
        ],
      },
    ],
    store.getState(),
  )

  // Player 3 call
  store.dispatch({
    type: 'CALL',
    payload: {
      roomId,
    },
  })

  t.deepEqual(
    [
      {
        id: 'foo',
        isGameStarted: true,
        board: {
          dealerPlayerId: 'player1',
          bigBlind: 100,
          anti: 0,
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
            stack: 1200,
            betting: 0,
            hand: [
              { num: 1, sym: 'spade' },
              { num: 2, sym: 'spade' },
            ],
            position: 1,
            isActive: true,
            checed: false,
          },
          {
            id: 'player2',
            stack: 1450,
            betting: 0,
            hand: [
              { num: 3, sym: 'spade' },
              { num: 4, sym: 'spade' },
            ],
            position: 2,
            isActive: false,
            checed: false,
          },
          {
            id: 'player3',
            stack: 1200,
            betting: 0,
            hand: [
              { num: 5, sym: 'spade' },
              { num: 6, sym: 'spade' },
            ],
            position: 3,
            isActive: true,
            checed: false,
          },
        ],
      },
    ],
    store.getState(),
  )

  // Player 3 check
  store.dispatch({
    type: 'CHECK',
    payload: {
      roomId,
    },
  })

  t.deepEqual(
    [
      {
        id: 'foo',
        isGameStarted: true,
        board: {
          dealerPlayerId: 'player1',
          bigBlind: 100,
          anti: 0,
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
            stack: 1200,
            betting: 0,
            hand: [
              { num: 1, sym: 'spade' },
              { num: 2, sym: 'spade' },
            ],
            position: 1,
            isActive: true,
            checed: false,
          },
          {
            id: 'player2',
            stack: 1450,
            betting: 0,
            hand: [
              { num: 3, sym: 'spade' },
              { num: 4, sym: 'spade' },
            ],
            position: 2,
            isActive: false,
            checed: false,
          },
          {
            id: 'player3',
            stack: 1200,
            betting: 0,
            hand: [
              { num: 5, sym: 'spade' },
              { num: 6, sym: 'spade' },
            ],
            position: 3,
            isActive: true,
            checed: true,
          },
        ],
      },
    ],
    store.getState(),
  )

  // player 1 also check.
  store.dispatch({
    type: 'CHECK',
    payload: {
      roomId,
    },
  })

  t.deepEqual(
    [
      {
        id: 'foo',
        isGameStarted: true,
        board: {
          dealerPlayerId: 'player1',
          bigBlind: 100,
          anti: 0,
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
            stack: 1200,
            betting: 0,
            hand: [
              { num: 1, sym: 'spade' },
              { num: 2, sym: 'spade' },
            ],
            position: 1,
            isActive: true,
            checed: true,
          },
          {
            id: 'player2',
            stack: 1450,
            betting: 0,
            hand: [
              { num: 3, sym: 'spade' },
              { num: 4, sym: 'spade' },
            ],
            position: 2,
            isActive: false,
            checed: false,
          },
          {
            id: 'player3',
            stack: 1200,
            betting: 0,
            hand: [
              { num: 5, sym: 'spade' },
              { num: 6, sym: 'spade' },
            ],
            position: 3,
            isActive: true,
            checed: true,
          },
        ],
      },
    ],
    store.getState(),
  )
})
