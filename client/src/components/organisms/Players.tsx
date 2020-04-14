import * as React from 'react'
import { Board, Player } from '@fastpoker/core'
import { Text } from 'react-native'
import styled from 'styled-components/native'
import { DealerButton } from '../atoms/DealerButton'
import { Hand } from '../molecules/Hand'

const Container = styled.View``

const PlayerWrap = styled.View<{ relativePosition: number }>`
  position: absolute;
  align-items: center;
  flex-direction: ${p => (p.relativePosition < 0 ? 'row-reverse' : 'row')};
  right: ${p => (p.relativePosition < 0 ? 0 : 'unset')};
  left: ${p => (p.relativePosition > 0 ? 0 : 'unset')};
  top: ${p => Math.abs(p.relativePosition) * 100}px;
  margin-top: 24px;
`

const AvatarLike = styled.View<{ isTurn: boolean }>`
  width: 80px
  height: 80px
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  border: solid ${p => (p.isTurn ? '3px red' : '1px #333')};
`

const Betting = styled.View`
  margin-left: 16px;
`

interface PlayersProps {
  board: Board
  players: Player[]
  userPosition: number
  showDown?: boolean
}

export function Players({ board, showDown = false, players, userPosition }: PlayersProps) {
  return (
    <Container>
      {players.map(player => (
        <PlayerWrap
          key={player.id}
          relativePosition={(player.position - userPosition) % players.length}
        >
          {board.dealerPlayerId === player.id && <DealerButton />}
          <AvatarLike isTurn={board.turnPlayerId === player.id}>
            <Text>{player.id}</Text>
            <Text>{player.stack}</Text>
          </AvatarLike>
          <Betting>{player.betting > 0 && <Text>{player.betting}</Text>}</Betting>
          {showDown && <Hand cards={player.hand} />}
        </PlayerWrap>
      ))}
    </Container>
  )
}
