import * as React from 'react'
import styled from 'styled-components/native'
import { Player } from '@fastpoker/core'
import { Hand } from '../molecules/Hand'

const Container = styled.View`
  align-items: center;
  justify-content: center;
`

const Num = styled.Text`
  margin: 16px;
`

interface MyHandProps {
  me: Player
}

export function MyHand({ me }: MyHandProps) {
  return (
    <Container>
      {me.betting > 0 && <Num>{me.betting}</Num>}
      <Hand cards={me.hand} />
      <Num>{me.stack}</Num>
    </Container>
  )
}
