import WebSocket from 'ws'
import { PokerAction } from '@fastpoker/core'
import store from './store'

const wss = new WebSocket.Server({ port: 30762 })

function getRoom(ws: any): string {
  return ws.room
}

wss.on('connection', (ws, { url }) => {
  Object.assign(ws, { room: url!.slice(1) })

  ws.on('message', data => {
    if (!data) {
      return
    }
    console.log(`message received: ${String(data)}`)
    const message: PokerAction = JSON.parse(String(data))
    store.dispatch(message)
    wss.clients.forEach(client => {
      const roomId = getRoom(client)
      if (roomId !== message?.payload?.roomId) {
        return
      }
      const room = store.getState().find(r => r.id === roomId)
      if (room) {
        client.send(JSON.stringify(room))
      }
    })
  })
})
