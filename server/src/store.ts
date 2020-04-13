import { createStore } from 'redux'
import { PokerAction } from '@fastpoker/core'
import { Repository } from './repositories'

// function addCardIfBetAdjusted(room: Room): Room {
//   const maxBetAmount = getCurrentMaximumBet(room)
//   if (
//     (maxBetAmount > 0 &&
//       room.players
//         .filter(player => player.isActive)
//         .every(player => player.betting === maxBetAmount)) ||
//     (maxBetAmount === 0 &&
//       room.players.filter(player => player.isActive).every(player => player.checed))
//   ) {
//     room.players.forEach(player => {
//       player.betting = 0
//     })
//     if (room.board.cards.length === 0) {
//       room.board.cards = [createCard(), createCard(), createCard()]
//     } else {
//       room.board.cards.push(createCard())
//     }
//   }
//   return room
// }

function reducer(repository: Repository = new Repository(), action: PokerAction): Repository {
  if (!action || !action.payload) {
    return repository
  }

  // TODO: use "JOIN_ROOM" instead
  if (action.type === 'CREATE_ROOM') {
    repository.findOrCreateRoom(action.payload.roomId)
    return repository
  }

  const room = repository.findRoom(action.payload.roomId)

  if (action.type === 'JOIN_ROOM') {
    room.findOrCreatePlayer(action.payload.userId)
    return repository
  }

  if (action.type === 'START_GAME') {
    room.startGame()
    return repository
  }

  switch (action.type) {
    case 'BET': {
      room.onCurrentPlayerBet(action.payload.amount)
      return repository
    }

    case 'CHECK': {
      room.onCurrentPlayerCheck()
      return repository
    }

    case 'CALL': {
      room.onCurrentPlayerCall()
      return repository
    }

    case 'FOLD': {
      room.onCurrentPlayerFold()
      return repository
    }
  }
  return repository
}

const store = createStore(reducer)

if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => console.log(JSON.stringify(store.getState(), undefined, 2)))
}

export default store
