import * as React from 'react'
import styled from 'styled-components/native'

const ButtonWrap = styled.TouchableOpacity<{ danger: boolean; disabled: boolean }>`
  padding: 8px 16px;
  background: ${p => (p.disabled ? '#ccc' : p.danger ? 'red' : '#333')};
  border-radius: 3px;
`

const ButtonText = styled.Text`
  color: #fff;
`

interface ButtonProps {
  children: string
  onPress: () => void
  danger?: boolean
  disabled?: boolean
}

export function Button({ danger, disabled, children, onPress }: ButtonProps) {
  return (
    <ButtonWrap onPress={onPress} danger={Boolean(danger)} disabled={Boolean(disabled)}>
      <ButtonText>{children}</ButtonText>
    </ButtonWrap>
  )
}
