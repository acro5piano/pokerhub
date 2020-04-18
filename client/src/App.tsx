import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { getRandomString } from '@pokerhub/core'
import { useRoomDispatch } from './hooks'
import { Button } from './components/atoms/Button'
import { ActionWindow } from './components/organisms/ActionWindow'
import { MyHand } from './components/organisms/MyHand'
import { Board } from './components/organisms/Board'
import { Players } from './components/organisms/Players'
import { HandIndicator } from './components/organisms/HandIndicator'
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

  const start = React.useCallback(() => {
    dispatch &&
      dispatch({
        type: 'START_GAME',
        payload: {
          roomId,
        },
      })
  }, [dispatch, roomId])

  const bet = React.useCallback(
    (amount: number) => {
      dispatch &&
        dispatch({
          type: 'BET',
          payload: {
            roomId,
            amount,
          },
        })
    },
    [dispatch, roomId],
  )

  const check = React.useCallback(() => {
    dispatch &&
      dispatch({
        type: 'CHECK',
        payload: {
          roomId,
        },
      })
  }, [dispatch, roomId])

  const call = React.useCallback(() => {
    dispatch &&
      dispatch({
        type: 'CALL',
        payload: {
          roomId,
        },
      })
  }, [dispatch, roomId])

  const fold = React.useCallback(() => {
    dispatch &&
      dispatch({
        type: 'FOLD',
        payload: {
          roomId,
        },
      })
  }, [dispatch, roomId])

  const isMyTurn = React.useMemo(() => room?.board.turnPlayerId === userId, [
    room?.board.turnPlayerId,
    userId,
  ])
  const me = React.useMemo(() => room?.players.find(p => p.id === userId), [room?.players, userId])

  if (!dispatch || !room || !roomId || !userId) {
    return (
      <AppContainer>
        <ActivityIndicator />
      </AppContainer>
    )
  }

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
            stack={me.stack}
            isRaised={getCurrentMaximumBet() > 0 && getCurrentMaximumBet() > me.betting}
            maximumBetting={getCurrentMaximumBet()}
          />
        )}
      </View>
      {room.board.showDown && <HandIndicator winningHand={room.board.winningHand} />}
    </AppContainer>
  )
}
