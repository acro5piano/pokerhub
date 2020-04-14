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

const ButtonWrap = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 4px;
  background: #fff;
`

const Button = styled.View`
  background-image: url('https://cdn4.vectorstock.com/i/1000x1000/74/33/spades-suit-flat-icon-vector-19617433.jpg');
  background-size: cover;
  width: 16px;
  height: 16px;
  border-radius: 50%;
`

interface DealerButtonProps {}

export function DealerButton({}: DealerButtonProps) {
  return (
    <ButtonWrap>
      <Button />
    </ButtonWrap>
  )
  return (
    <Container>
      <Text>D</Text>
    </Container>
  )
}
