import WebSocket from 'ws'
import { PokerAction } from '@pokerhub/core'
import store from './store'

const port = Number(process.env.PORT) || 30762

const wss = new WebSocket.Server({ port })

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
      const room = store.getState().findRoom(roomId)
      if (room) {
        client.send(JSON.stringify(room))
      }
    })
  })
})

console.log(`> Listening to http://localhost:${port}`)
