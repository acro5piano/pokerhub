import React from 'react'
import { PokerAction, Room } from '@fastpoker/core'

const userId = localStorage.getItem('userId') || window.prompt('Please set your userId')

if (!userId) {
  location.href = location.href
} else {
  localStorage.setItem('userId', userId)
}

const roomId = window.location.hash.slice(1)

const ws = new WebSocket(`ws://localhost:30762/${roomId}`)

ws.onclose = e => {
  console.log('Socket is closed. Reconnect will be attempted in 10 millisecond.', e.reason)
}

export function useRoomDispatch() {
  if (!userId) {
    throw new Error()
  }
  const [room, setRoom] = React.useState<Room | undefined>()

  const dispatch = useSocket(room => {
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

type Handler = (p: Room) => void
type Send = (p: PokerAction) => void

export function useSocket(handler: Handler) {
  const [send, setSend] = React.useState<undefined | Send>()

  React.useEffect(() => {
    ws.addEventListener('open', () => {
      setSend(() => (p: PokerAction) => ws.send(JSON.stringify(p)))
      ws.onmessage = ({ data }) => {
        handler(JSON.parse(String(data)))
      }
    })
  }, [ws.CONNECTING, ws])

  return send
}
