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

test('CREATE_ROOM', t => {
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
          blind: 100,
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
          blind: 100,
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
          },
          {
            id: 'player2',
            stack: 1500,
            betting: 0,
            hand: [],
            position: 2,
            isActive: true,
          },
          {
            id: 'player3',
            stack: 1500,
            betting: 0,
            hand: [],
            position: 3,
            isActive: true,
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
          cards: [],
          pot: 0,
          dealerPlayerId: 'player1',
          turnPlayerId: 'player1',
          blind: 100,
          anti: 0,
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
          },
          {
            id: 'player2',
            stack: 1500,
            betting: 0,
            hand: [
              { num: 3, sym: 'spade' },
              { num: 4, sym: 'spade' },
            ],
            position: 2,
            isActive: true,
          },
          {
            id: 'player3',
            stack: 1500,
            betting: 0,
            hand: [
              { num: 5, sym: 'spade' },
              { num: 6, sym: 'spade' },
            ],
            position: 3,
            isActive: true,
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
      amount: 100,
    },
  })

  t.deepEqual(
    [
      {
        id: 'foo',
        isGameStarted: true,
        board: {
          cards: [],
          pot: 100,
          turnPlayerId: 'player2',
          dealerPlayerId: 'player1',
          blind: 100,
          anti: 0,
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
            position: 1,
            isActive: true,
          },
          {
            id: 'player2',
            stack: 1500,
            betting: 0,
            hand: [
              { num: 3, sym: 'spade' },
              { num: 4, sym: 'spade' },
            ],
            position: 2,
            isActive: true,
          },
          {
            id: 'player3',
            stack: 1500,
            betting: 0,
            hand: [
              { num: 5, sym: 'spade' },
              { num: 6, sym: 'spade' },
            ],
            position: 3,
            isActive: true,
          },
        ],
      },
    ] as Room[],
    store.getState(),
  )
})
