import { createStore } from 'redux'
import { PokerAction } from '@pokerhub/core'
import { Repository } from './repositories'

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

    case 'END_SHOW_DOWN': {
      // When showDown, all players will send 'END_SHOW_DOWN' request
      // so guard here
      if (!room.board.showDown) {
        return repository
      }
      room.calculateShowDownResult()
      return repository
    }
  }
  return repository
}

export function makeStore() {
  return createStore(reducer)
}

const store = makeStore()

if (process.env.NODE_ENV !== 'test') {
  store.subscribe(() => console.log(JSON.stringify(store.getState(), undefined, 2)))
}

export default store

export type Store = typeof store
