import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { useRoomDispatch } from './hooks'
import { Button } from './components/Button'
import { Hand } from './components/Hand'

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

  const isMyTurn = room.board.turnPlayerId === userId

  if (!room.isGameStarted) {
    return (
      <View>
        <Button onPress={start}>Start</Button>
      </View>
    )
  }

  return (
    <View>
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
            {room.board.turnPlayerId === player.id && <ActivityIndicator />}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ width: 100 }}>
              {player.id}
              {player.id === userId && '(You)'}
            </Text>
            <Text style={{ width: 100 }}>{player.betting}</Text>
            <Text style={{ width: 100 }}>{player.stack}</Text>
          </View>
          {player.id === userId && <Hand cards={player.hand} />}
        </View>
      ))}
      {isMyTurn && <Button onPress={bet}>Bet</Button>}
    </View>
  )
}
