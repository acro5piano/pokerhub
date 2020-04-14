import * as React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

export const Container = styled.View<{ isTurn: boolean; isFolded: boolean }>`
  width: 100px
  height: 100px
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  border: solid ${p => (p.isTurn ? '3px red' : '1px #aaa')};
  background: ${p => (p.isFolded ? '#aaa' : '#fff')};
`

interface AvatarProps {
  name: string
  stack: number
  isTurn: boolean
  isFolded: boolean
}

export function Avatar({ isTurn, name, stack, isFolded }: AvatarProps) {
  return (
    <Container isTurn={isTurn} isFolded={isFolded}>
      <Text>{name}</Text>
      <Text>{stack}</Text>
    </Container>
  )
}
