export function start(roomId: string) {
  const ws = new WebSocket(`ws://localhost:30762/${roomId}`)

  ws.addEventListener('open', () => {
    ws.onmessage = ({ data }) => {
      console.log(data)
    }
    ws.onclose = e => {
      console.log('Socket is closed. Reconnect will be attempted in 10 millisecond.', e.reason)
      setTimeout(() => {
        start(roomId)
      }, 10)
    }

    ws.send('hoge')
  })
}

start(window.location.hash.slice(1))
