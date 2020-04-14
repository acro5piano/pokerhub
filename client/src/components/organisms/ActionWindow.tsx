import * as React from 'react'
import styled from 'styled-components/native'
import { BetWindow } from '../molecules/BetWindow'
import { Button } from '../atoms/Button'

const Container = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  position: absolute;
  bottom: 0;
  width: 100%;
`

const Col = styled.View`
  margin-left: 16px;
`

interface ActionWindowProps {
  onBet: (a: number) => void
  onCall: () => void
  onFold: () => void
  onCheck: () => void
  isRaised: boolean
  maximumBetting: number
}

export function ActionWindow({
  maximumBetting,
  isRaised,
  onBet,
  onCall,
  onFold,
  onCheck,
}: ActionWindowProps) {
  return (
    <Container>
      <Col>
        <Button onPress={onFold}>FOLD</Button>
      </Col>
      <Col>
        {isRaised ? (
          <Button onPress={onCall}>CALL</Button>
        ) : (
          <Button onPress={onCheck}>Check</Button>
        )}
      </Col>
      <Col>
        <BetWindow onBet={onBet} maximumBetting={maximumBetting} />
      </Col>
    </Container>
  )
}
