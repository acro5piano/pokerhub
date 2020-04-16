import * as React from 'react'
import { Board, Player } from '@fastpoker/core'
import styled from 'styled-components/native'
import { DealerButton } from '../atoms/DealerButton'
import { Dollar } from '../molecules/Dollar'
import { Avatar } from '../atoms/Avatar'
import { Hand } from '../molecules/Hand'

const Container = styled.View``

interface WithRelativePosition {
  relativePosition: number
}

function getTop({ relativePosition }: WithRelativePosition) {
  if (relativePosition <= 7) {
    return (7 - relativePosition) * 50
  } else {
    return (relativePosition - 8) * 50
  }
}

const PlayerWrap = styled.View<WithRelativePosition>`
  position: absolute;
  align-items: center;
  flex-direction: ${p => (p.relativePosition <= 7 ? 'row' : 'row-reverse')};
  right: ${p => (p.relativePosition <= 7 ? 'unset' : 0)};
  left: ${p => (p.relativePosition <= 7 ? 0 : 'unset')};
  top: ${getTop}px;
`

const Betting = styled.View`
  margin: 0 16px;
`

interface PlayersProps {
  board: Board
  players: Player[]
  userPosition: number
  showDown: boolean
}

export function Players({ board, showDown, players, userPosition }: PlayersProps) {
  const getRelativePosition = React.useCallback(theirPosition => {
    const allPlayers = players.length + 1 // including me
    return (
      ((allPlayers + theirPosition - userPosition) % allPlayers) * Math.floor(1 + 12 / allPlayers)
    )
  }, [])

  return (
    <Container>
      {players.map(player => (
        <PlayerWrap key={player.id} relativePosition={getRelativePosition(player.position)}>
          {board.dealerPlayerId === player.id && <DealerButton />}
          <Avatar isTurn={board.turnPlayerId === player.id} player={player} />
          <div>position: {player.position}</div>
          <div>relativePosition: {getRelativePosition(player.position)}</div>
          <Betting>{player.betting > 0 && <Dollar amount={player.betting} />}</Betting>
          {showDown && player.isActive && <Hand cards={player.hand} />}
        </PlayerWrap>
      ))}
    </Container>
  )
}
