import styled from 'styled-components/native'
import * as React from 'react'
import { Text } from 'react-native'

const Container = styled.View`
  padding: 4px;
  border: solid 1px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
`

interface DealerButtonProps {}

export function DealerButton({}: DealerButtonProps) {
  return (
    <Container>
      <Text>D</Text>
    </Container>
  )
}
