import WebSocket from 'ws'
import { PokerPayload } from '@fastpoker/core'

const wss = new WebSocket.Server({ port: 30762 })

function getRoom(ws: any): string {
  return ws.room
}

wss.on('connection', (ws, { url }) => {
  Object.assign(ws, { room: url!.slice(1) })

  ws.on('message', data => {
    const message: PokerPayload = JSON.parse(String(data))
    wss.clients.forEach(client => {
      if (getRoom(client) === message.payload.room) {
        client.send(data)
      }
    })
  })
})
