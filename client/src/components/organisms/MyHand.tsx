import * as React from 'react'
import styled from 'styled-components/native'
import { Player } from '@fastpoker/core'
import { Hand } from '../molecules/Hand'
import { DealerButton } from '../atoms/DealerButton'
import { Avatar } from '../atoms/Avatar'
import { Typography } from '../atoms/Typography'

const Container = styled.View`
  align-items: center;
  justify-content: center;
`

const Num = styled(Typography)`
  margin: 16px;
`

interface MyHandProps {
  me: Player
  isDealer: boolean
  isTurn: boolean
}

export function MyHand({ me, isDealer, isTurn }: MyHandProps) {
  return (
    <Container>
      {me.betting > 0 && <Num>{me.betting}</Num>}
      {isDealer && <DealerButton />}
      <Avatar isTurn={isTurn} name={me.id} stack={me.stack} isFolded={!me.isActive} />

      <Hand cards={me.hand} />
    </Container>
  )
}
