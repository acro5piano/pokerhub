import WebSocket from 'ws'
import { PokerAction } from '@fastpoker/core'
import store from './store'
import http from 'http'
import fs from 'fs'
import path from 'path'

const server = http.createServer((req, res) => {
  const basePath = path.join(__dirname, '../../client/build')
  fs.readFile(`${basePath}${req.url}`, (err, data) => {
    res.writeHead(200)
    if (err) {
      fs.readFile(`${basePath}/index.html`, (err, data) => {
        if (err) {
          res.writeHead(404)
          res.end(JSON.stringify(err))
        } else {
          res.end(data)
        }
      })
      return
    }
    res.writeHead(200)
    res.end(data)
  })
})

const wss = new WebSocket.Server({ server })

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

server.listen(30762, () => {
  console.log('> Listening to http://localhost:30762')
})

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.\nClosing http server.')
  wss.clients.forEach(client => client.close())
  server.close(() => {
    console.log('Http server closed.')
  })
})
