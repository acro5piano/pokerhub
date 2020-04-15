import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { getRandomString } from '@fastpoker/core'
import { useRoomDispatch } from './hooks'
import { Button } from './components/atoms/Button'
import { ActionWindow } from './components/organisms/ActionWindow'
import { MyHand } from './components/organisms/MyHand'
import { Board } from './components/organisms/Board'
import { Players } from './components/organisms/Players'
import { AppContainer } from './components/atoms/AppContainer'
import { GlobalStyle } from './GlobalStyle'
import { initializeApp } from './services/initializeApp'

const appContext = initializeApp()

export function App() {
  const { room, roomId, userId, dispatch } = useRoomDispatch(appContext)

  React.useEffect(() => {
    if (!roomId) {
      location.href = `/${getRandomString()}`
    }
  }, [])

  React.useEffect(() => {
    if (room?.board.showDown) {
      setTimeout(() => {
        dispatch?.({
          type: 'END_SHOW_DOWN',
          payload: {
            roomId,
          },
        })
      }, 3000)
    }
  }, [room?.board.showDown])

  if (!dispatch || !room || !roomId || !userId) {
    return (
      <AppContainer>
        <ActivityIndicator />
      </AppContainer>
    )
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
        <GlobalStyle />
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
      <GlobalStyle />
      <Players
        showDown={room.board.showDown}
        players={otherPlayers}
        board={room.board}
        userPosition={me.position}
      />
      <Board board={room.board} bettingAmountSum={bettingAmountSum} />
      <View>
        <MyHand me={me} isDealer={room.board.dealerPlayerId === me.id} isTurn={isMyTurn} />
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
