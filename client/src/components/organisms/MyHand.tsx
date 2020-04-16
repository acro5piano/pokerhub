import * as React from 'react'
import styled from 'styled-components/native'
import { Player } from '@pokerhub/core'
import { Hand } from '../molecules/Hand'
import { Dollar } from '../molecules/Dollar'
import { DealerButton } from '../atoms/DealerButton'
import { Row } from '../atoms/Row'
import { Avatar } from '../atoms/Avatar'

const Container = styled.View`
  align-items: center;
  justify-content: center;
`

const HandWrap = styled.View`
  margin-top: 16px;
`

interface MyHandProps {
  me: Player
  isDealer: boolean
  isTurn: boolean
}

export function MyHand({ me, isDealer, isTurn }: MyHandProps) {
  return (
    <Container>
      <Dollar amount={me.betting} />
      <Row>
        <Avatar isTurn={isTurn} player={me} />
        {isDealer && <DealerButton />}
      </Row>
      <HandWrap>
        <Hand cards={me.hand} />
      </HandWrap>
    </Container>
  )
}
