import WebSocket from 'ws'

interface PokerPayloadJoin {
  type: 'join'
  payload: {
    room: string
    name: string
  }
}

type PokerPayload = PokerPayloadJoin

const wss = new WebSocket.Server({ port: 30762 })

wss.on('connection', (ws, { url }) => {
  ws.on('message', (data: PokerPayload) => {
    wss.clients.forEach(client => {
      console.log(data)
      console.log(client)
      // if (client && (client as any).room === data.payload.room) {
      //   client.send(data)
      // }
    })
  })
})
