import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { getRandomString } from '@fastpoker/core'
import { useRoomDispatch } from './hooks'
import { Button } from './components/Button'
import { Hand } from './components/Hand'
import { BetWindow } from './components/BetWindow'
import { PlayingCard } from './components/PlayingCard'

export function App() {
  const { room, roomId, userId, dispatch } = useRoomDispatch()

  React.useEffect(() => {
    if (!roomId) {
      location.href = `/${getRandomString()}`
    }
  }, [])

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

  const bet = (amount: number) => {
    dispatch({
      type: 'BET',
      payload: {
        roomId,
        amount,
      },
    })
  }

  const check = () => {
    dispatch({
      type: 'CHECK',
      payload: {
        roomId,
      },
    })
  }

  const call = () => {
    dispatch({
      type: 'CALL',
      payload: {
        roomId,
      },
    })
  }

  const fold = () => {
    dispatch({
      type: 'FOLD',
      payload: {
        roomId,
      },
    })
  }

  const isMyTurn = room.board.turnPlayerId === userId
  const me = room.players.find(p => p.id === userId)

  if (!room.isGameStarted || !me) {
    return (
      <View>
        <Button onPress={start}>Start</Button>
      </View>
    )
  }

  const getCurrentMaximumBet = () => {
    const bets = room.players.map(player => player.betting)
    return Math.max(...bets)
  }

  return (
    <View>
      <Text>{room.board.pot}</Text>
      <View style={{ flexDirection: 'row' }}>
        {room.board.cards.map((card, i) => (
          <View key={i}>
            <PlayingCard card={card} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ width: 100 }}></Text>
        <Text style={{ width: 100 }}>Name</Text>
        <Text style={{ width: 100 }}>Dealer</Text>
        <Text style={{ width: 100 }}>Betting</Text>
        <Text style={{ width: 100 }}>Stack</Text>
      </View>
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
          <Text style={{ width: 100 }}>
            {player.id}
            {player.id === userId && '(You)'}
          </Text>
          <View style={{ width: 100 }}>
            {room.board.dealerPlayerId === player.id && <Text>●</Text>}
          </View>
          <Text style={{ width: 100 }}>{player.betting}</Text>
          <Text style={{ width: 100 }}>{player.stack}</Text>
        </View>
      ))}
      <Hand cards={me.hand} />
      {isMyTurn && (
        <View>
          <BetWindow onBet={bet} />
          {getCurrentMaximumBet() > 0 && getCurrentMaximumBet() > me.betting ? (
            <Button onPress={call}>CALL</Button>
          ) : (
            <Button onPress={check}>Check</Button>
          )}
          <Button onPress={fold}>FOLD</Button>
        </View>
      )}
    </View>
  )
}
