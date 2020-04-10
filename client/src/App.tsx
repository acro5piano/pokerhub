import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { useRoomDispatch } from './hooks'
import { Button } from './components/Button'

export function App() {
  const { room, roomId, userId, dispatch } = useRoomDispatch()

  if (!dispatch || !room || !roomId || !userId) {
    return <ActivityIndicator />
  }

  const start = () => {
    dispatch({
      type: 'START_GAME',
      payload: {
        roomId,
      },
    })
  }

  const bet = () => {
    dispatch({
      type: 'BET',
      payload: {
        roomId,
        amount: 100,
      },
    })
  }

  return (
    <View>
      {room.turnPlayerId === '' ? (
        <Button onPress={start}>Start</Button>
      ) : (
        <>
          <Text>{room.board.pot}</Text>
          <Text style={{ width: 100 }}>Name</Text>
          <Text style={{ width: 100 }}>Betting</Text>
          <Text style={{ width: 100 }}>Stack</Text>
          {room.players.map(player => (
            <View
              key={player.id}
              style={{
                flexDirection: 'row',
              }}
            >
              <View style={{ width: 100 }}>
                {room.turnPlayerId === player.id && <ActivityIndicator />}
              </View>
              <View
                style={{
                  backgroundColor: player.id === userId ? '#0275f2' : '#fff',
                  flexDirection: 'row',
                }}
              >
                <Text style={{ width: 100 }}>{player.id}</Text>
                <Text style={{ width: 100 }}>{player.betting}</Text>
                <Text style={{ width: 100 }}>{player.stack}</Text>
              </View>
            </View>
          ))}
          {room.turnPlayerId === userId && <Button onPress={bet}>Bet</Button>}
        </>
      )}
    </View>
  )
}
