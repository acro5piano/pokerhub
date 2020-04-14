import * as React from 'react'
import styled from 'styled-components/native'
import { Player } from '@fastpoker/core'
import { Hand } from '../molecules/Hand'
import { DealerButton } from '../atoms/DealerButton'

const Container = styled.View`
  align-items: center;
  justify-content: center;
`

const Num = styled.Text`
  margin: 16px;
`

interface MyHandProps {
  me: Player
  isDealer: boolean
}

export function MyHand({ me, isDealer }: MyHandProps) {
  return (
    <Container>
      {me.betting > 0 && <Num>{me.betting}</Num>}
      {isDealer && <DealerButton />}
      <Hand cards={me.hand} />
      <Num>{me.stack}</Num>
    </Container>
  )
}
