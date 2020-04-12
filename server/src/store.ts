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

function getNextTurnPlayer(room: Room): Player {
  const currentPlayer = getPlayer(room, room.board.turnPlayerId)
  const nextPlayer = room.players.find(p => p.position === currentPlayer.position + 1)
  if (!nextPlayer) {
    return room.players[0]
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

function reducer(rooms: Room[] = [], action: PokerAction): Room[] {
  switch (action.type) {
    case 'CREATE_ROOM': {
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
          blind: 100,
          anti: 0,
        },
        players: [],
        isGameStarted: false,
      }
      return [...rooms, newRoom]
    }

    case 'JOIN_ROOM': {
      const room = getRoom(rooms, action.payload.roomId)
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
      })
      return rooms.map(r => (r.id === action.payload.roomId ? room : r))
    }

    case 'START_GAME': {
      const room = getRoom(rooms, action.payload.roomId)
      room.players.forEach(player => {
        player.hand = [createCard(), createCard()]
      })
      room.board.turnPlayerId = room.players[0].id
      room.board.dealerPlayerId = room.players[0].id
      room.isGameStarted = true
      return rooms.map(r => (r.id === action.payload.roomId ? room : r))
    }

    case 'BET': {
      const room = getRoom(rooms, action.payload.roomId)
      const player = getCurrentTurnPlayer(room)
      room.board.pot += action.payload.amount
      player.stack -= action.payload.amount
      player.betting += action.payload.amount
      room.players = room.players.map(p => (p.id === player.id ? player : p))
      room.board.turnPlayerId = getNextTurnPlayer(room).id
      return rooms.map(r => (r.id === action.payload.roomId ? room : r))
    }

    case 'CHECK': {
      const room = getRoom(rooms, action.payload.roomId)
      room.board.turnPlayerId = getNextTurnPlayer(room).id
      return rooms.map(r => (r.id === action.payload.roomId ? room : r))
    }

    default:
      return rooms
  }
}

const store = createStore(reducer)

if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => console.log(JSON.stringify(store.getState(), undefined, 2)))
}

export default store
