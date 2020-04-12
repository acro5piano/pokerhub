import { createStore } from 'redux'
import { PokerAction, Room, Player, createCard } from '@fastpoker/core'

function getRoomMaybe(rooms: Room[], roomId: string): Room | undefined {
  return rooms.find(r => r.id === roomId)
}

function getRoom(rooms: Room[], roomId: string): Room {
  const room = getRoomMaybe(rooms, roomId)
  if (!room) {
    throw new Error('rooms is missing')
  }
  return room
}

function getPlayerMaybe(room: Room, playerId: string): Player | undefined {
  return room.players.find(p => p.id === playerId)
}

function getPlayer(room: Room, playerId: string): Player {
  const player = getPlayerMaybe(room, playerId)
  if (!player) {
    throw new Error('player is missing')
  }
  return player
}

// function isActivePlayer(player: Player): boolean {
//   return player.isActive
// }

function getDealerInRoom(room: Room): Player {
  return getPlayer(room, room.board.dealerPlayerId)
}

function getSmallBlindInRoom(room: Room): Player {
  const nextPosition = (getDealerInRoom(room).position % room.players.length) + 1
  const player = room.players.find(p => p.position === nextPosition)
  if (!player) {
    throw new Error('smallBlind is missing. this is a bug')
  }
  return player
}

function getBigBlindInRoom(room: Room): Player {
  const nextPosition = (getDealerInRoom(room).position % room.players.length) + 2
  const player = room.players.find(p => p.position === nextPosition)
  if (!player) {
    throw new Error('bigBlind is missing. this is a bug')
  }
  return player
}

function getNextTurnPlayer(room: Room, player?: Player): Player {
  const currentPlayer = player || getPlayer(room, room.board.turnPlayerId)
  const nextPosition =
    room.board.cards.length === 0 && getBigBlindInRoom(room).id === room.board.turnPlayerId
      ? getSmallBlindInRoom(room).position
      : currentPlayer.position
  const nextPlayer = room.players.find(p => p.position === (nextPosition % room.players.length) + 1)
  if (!nextPlayer) {
    throw new Error('Logic error: there is only 0 or 1 active player')
  }
  if (!nextPlayer.isActive) {
    return getNextTurnPlayer(room, nextPlayer)
  }
  return nextPlayer
}

function getCurrentTurnPlayer(room: Room): Player {
  const currentPlayer = getPlayer(room, room.board.turnPlayerId)
  if (!currentPlayer) {
    throw new Error('current player is missing')
  }
  return currentPlayer
}

function getCurrentMaximumBet(room: Room): number {
  const bets = room.players.map(player => player.betting)
  return Math.max(...bets)
}

function replaceRoom(rooms: Room[], room: Room): Room[] {
  return rooms.map(r => (r.id === room.id ? room : r))
}

function replacePlayerInRoom(room: Room, player: Player): Room {
  room.players = room.players.map(p => (p.id === player.id ? player : p))
  return room
}

function bet(player: Player, amount: number): Player {
  player.stack -= amount
  player.betting += amount
  return player
}

function addCardIfBetAdjusted(room: Room): Room {
  const maxBetAmount = getCurrentMaximumBet(room)
  if (
    (maxBetAmount > 0 &&
      room.players
        .filter(player => player.isActive)
        .every(player => player.betting === maxBetAmount)) ||
    (maxBetAmount === 0 &&
      room.players.filter(player => player.isActive).every(player => player.checed))
  ) {
    room.players.forEach(player => {
      player.betting = 0
    })
    if (room.board.cards.length === 0) {
      room.board.cards = [createCard(), createCard(), createCard()]
    } else {
      room.board.cards.push(createCard())
    }
  }
  return room
}

function reducer(rooms: Room[] = [], action: PokerAction): Room[] {
  if (!action || !action.payload) {
    return rooms
  }

  // TODO: use "JOIN_ROOM" instead
  if (action.type === 'CREATE_ROOM') {
    if (getRoomMaybe(rooms, action.payload.roomId)) {
      return rooms
    }
    const newRoom: Room = {
      id: action.payload.roomId,
      board: {
        cards: [],
        pot: 0,
        turnPlayerId: '',
        dealerPlayerId: '',
        bigBlind: 100,
        anti: 0,
      },
      players: [],
      isGameStarted: false,
    }
    return [...rooms, newRoom]
  }

  const room = getRoom(rooms, action.payload.roomId)

  if (action.type === 'JOIN_ROOM') {
    if (getPlayerMaybe(room, action.payload.userId)) {
      return rooms
    }
    room.players.push({
      id: action.payload.userId,
      stack: 1500,
      betting: 0,
      hand: [],
      position: room.players.length + 1,
      isActive: true,
      checed: false,
    })
    return replaceRoom(rooms, room)
  }

  if (action.type === 'START_GAME') {
    room.players.forEach(player => {
      player.hand = [createCard(), createCard()]
    })
    room.board.dealerPlayerId = room.players[0].id

    const { bigBlind } = room.board
    room.board.pot += bigBlind * 1.5

    const smallBlindPlayer = getSmallBlindInRoom(room)
    bet(smallBlindPlayer, bigBlind / 2)

    const bigBlindPlayer = getNextTurnPlayer(room, smallBlindPlayer)
    bet(bigBlindPlayer, bigBlind)

    const underTheGun = getNextTurnPlayer(room, bigBlindPlayer)
    room.board.turnPlayerId = underTheGun.id

    replacePlayerInRoom(room, smallBlindPlayer)
    replacePlayerInRoom(room, bigBlindPlayer)

    room.isGameStarted = true
    return replaceRoom(rooms, room)
  }

  const currentPlayer = getCurrentTurnPlayer(room)
  room.board.turnPlayerId = getNextTurnPlayer(room).id

  switch (action.type) {
    case 'BET': {
      room.board.pot += action.payload.amount
      bet(currentPlayer, action.payload.amount)
      replacePlayerInRoom(room, currentPlayer)
      return replaceRoom(rooms, room)
    }

    case 'CHECK': {
      currentPlayer.checed = true
      replacePlayerInRoom(room, currentPlayer)
      addCardIfBetAdjusted(room)
      return replaceRoom(rooms, room)
    }

    case 'CALL': {
      room.board.pot += getCurrentMaximumBet(room) - currentPlayer.betting
      bet(currentPlayer, getCurrentMaximumBet(room) - currentPlayer.betting)
      replacePlayerInRoom(room, currentPlayer)
      addCardIfBetAdjusted(room)
      return replaceRoom(rooms, room)
    }

    case 'FOLD': {
      currentPlayer.isActive = false
      replacePlayerInRoom(room, currentPlayer)
      addCardIfBetAdjusted(room)
      return replaceRoom(rooms, room)
    }
  }
  return rooms
}

const store = createStore(reducer)

if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => console.log(JSON.stringify(store.getState(), undefined, 2)))
}

export default store
