import * as React from 'react'
import styled from 'styled-components/native'

const ButtonWrap = styled.TouchableOpacity`
  padding: 8px 16px;
  background: #333;
`

const ButtonText = styled.Text`
  color: #fff;
`

interface ButtonProps {
  children: string
  onPress: () => void
}

export function Button({ children, onPress }: ButtonProps) {
  return (
    <ButtonWrap onPress={onPress}>
      <ButtonText>{children}</ButtonText>
    </ButtonWrap>
  )
}
