import { createStore } from 'redux'
import { PokerAction, Room } from '@fastpoker/core'

function reducer(rooms: Room[] = [], action: PokerAction): Room[] {
  switch (action.type) {
    case 'CREATE_ROOM':
      if (rooms.find(r => action.payload.roomId === r.id)) {
        return rooms
      }
      const newRoom: Room = {
        id: action.payload.roomId,
        board: {
          cards: [],
          pot: 0,
        },
        players: [],
      }
      return [...rooms, newRoom]
    case 'JOIN_ROOM':
      const room = rooms.find(r => r.id === action.payload.roomId)
      if (!room) {
        return rooms
      }
      if (room.players.find(p => p.id === action.payload.name)) {
        return rooms
      }
      room.players.push({
        id: action.payload.name,
        stack: 0,
        hand: [],
        position: room.players.length + 1,
        isActive: false,
      })
      return rooms.map(r => (r.id === action.payload.roomId ? room : r))
    default:
      return rooms
  }
}

const store = createStore(reducer)

store.subscribe(() => console.log(JSON.stringify(store.getState(), undefined, 2)))

export default store
