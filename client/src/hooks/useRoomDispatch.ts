import React from 'react'
import { Room } from '@pokerhub/core'
import { useSocket } from './useWebSocket'
import { AppContext } from '../services/initializeApp'

export function useRoomDispatch({ userId, roomId, webSocketUrl }: AppContext) {
  if (!userId) {
    throw new Error()
  }
  const [room, setRoom] = React.useState<Room | undefined>()

  const dispatch = useSocket(webSocketUrl, room => {
    setRoom(room)
  })

  React.useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'CREATE_ROOM',
        payload: {
          roomId,
        },
      })
    }
  }, [dispatch === undefined])

  React.useEffect(() => {
    if (room && dispatch) {
      dispatch({
        type: 'JOIN_ROOM',
        payload: {
          roomId,
          userId,
        },
      })
    }
  }, [room === undefined])

  return { roomId, room, userId, dispatch }
}
