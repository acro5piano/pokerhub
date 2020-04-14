import React from 'react'
import styled from 'styled-components/native'
import { ActivityIndicator, View } from 'react-native'
import { getRandomString } from '@fastpoker/core'
import { useRoomDispatch } from './hooks'
import { Button } from './components/atoms/Button'
import { ActionWindow } from './components/organisms/ActionWindow'
import { MyHand } from './components/organisms/MyHand'
import { Board } from './components/organisms/Board'
import { Players } from './components/organisms/Players'

const AppContainer = styled.View`
  padding: 16px;
  height: 100%;
  justify-content: space-between;
`

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
      <AppContainer>
        <Button onPress={start}>Start</Button>
      </AppContainer>
    )
  }

  const getCurrentMaximumBet = () => {
    const bets = room.players.map(player => player.betting)
    return Math.max(...bets)
  }

  const otherPlayers = room.players.filter(p => p.id !== userId)
  const bettingAmountSum = room.players.reduce((sum, p) => sum + p.betting, 0)

  return (
    <AppContainer>
      <Players players={otherPlayers} board={room.board} userPosition={me.position} />
      <Board board={room.board} bettingAmountSum={bettingAmountSum} />
      <View>
        <MyHand me={me} isDealer={room.board.dealerPlayerId === me.id} />
        {isMyTurn && (
          <ActionWindow
            onBet={bet}
            onCall={call}
            onCheck={check}
            onFold={fold}
            isRaised={getCurrentMaximumBet() > 0 && getCurrentMaximumBet() > me.betting}
            maximumBetting={getCurrentMaximumBet()}
          />
        )}
      </View>
    </AppContainer>
  )
}
