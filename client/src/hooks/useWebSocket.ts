import React from 'react'
import { PokerAction, Room } from '@fastpoker/core'

type Handler = (p: Room) => void
type Send = (p: PokerAction) => void

export function useSocket(webSocketUrl: string, handler: Handler) {
  const [send, setSend] = React.useState<undefined | Send>()
  const [ws, setWs] = React.useState<WebSocket>()

  const init = () => {
    const _ws = new WebSocket(webSocketUrl)

    _ws.onclose = e => {
      console.log('Socket is closed. Reconnect will be attempted in 500 millisecond.', e.reason)
      setTimeout(init, 500)
    }
    setWs(_ws)
  }

  React.useEffect(() => {
    init()
  }, [])

  React.useEffect(() => {
    if (!ws) {
      return
    }
    ws.addEventListener('open', () => {
      setSend(() => (p: PokerAction) => ws.send(JSON.stringify(p)))
      ws.onmessage = ({ data }) => {
        handler(JSON.parse(String(data)))
      }
    })
  }, [ws?.CONNECTING, ws])

  return send
}
