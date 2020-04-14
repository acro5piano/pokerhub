import * as React from 'react'
import { Board, Player } from '@fastpoker/core'
import styled from 'styled-components/native'
import { DealerButton } from '../atoms/DealerButton'
import { Dollar } from '../molecules/Dollar'
import { Avatar } from '../atoms/Avatar'
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

const Betting = styled.View`
  margin-left: 16px;
`

interface PlayersProps {
  board: Board
  players: Player[]
  userPosition: number
  showDown: boolean
}

export function Players({ board, showDown, players, userPosition }: PlayersProps) {
  return (
    <Container>
      {players.map(player => (
        <PlayerWrap
          key={player.id}
          relativePosition={(player.position - userPosition) % players.length}
        >
          {board.dealerPlayerId === player.id && <DealerButton />}
          <Avatar
            isTurn={board.turnPlayerId === player.id}
            name={player.id}
            stack={player.stack}
            isFolded={!player.isActive}
          />
          <Betting>{player.betting > 0 && <Dollar amount={player.betting} />}</Betting>
          {showDown && player.isActive && <Hand cards={player.hand} />}
        </PlayerWrap>
      ))}
    </Container>
  )
}
