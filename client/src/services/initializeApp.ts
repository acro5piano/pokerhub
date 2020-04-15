export interface AppContext {
  webSocketUrl: string
  roomId: string
  userId: string
}

export function initializeApp(): AppContext {
  const userId = localStorage.getItem('userId') || window.prompt('Please set your userId')
  if (!userId) {
    location.href = location.href
    return null as any
  }

  const roomId = window.location.pathname.split('/')[1]

  const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws'
  const webSocketUrl =
    process.env.NODE_ENV === 'production'
      ? `${protocol}://${process.env.PRODUCTION_WS_HOST}/${roomId}`
      : `${protocol}://${window.location.hostname}:30762/${roomId}`

  return {
    webSocketUrl,
    roomId,
    userId,
  }
}
