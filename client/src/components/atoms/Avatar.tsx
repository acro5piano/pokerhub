import * as React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import webStyled from 'styled-components'
import { css, keyframes } from 'styled-components'
import { Typography } from '../atoms/Typography'

const pulse = keyframes`
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
`

const animation = (props: any) =>
  css`
    ${pulse} ${props.animationLength} infinite alternate;
  `

const OpacityWrapper = webStyled.div<{ isTurn: boolean }>`
  width: 100px;
  height: 100px;
  ${p =>
    p.isTurn &&
    css`
      animation: 0.5s ${animation};
    `}
`

const Container = styled.View<{ isFolded: boolean }>`
  width: 100px
  height: 100px
  border-radius: 50%;
  background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTX-3KzGUJNm5E5QrbHxRaCCPVqC2axFXJO1ztwEY7IKEkjKP3f&usqp=CAU');
  background-size: cover;
  border: solid 2px ${p => (p.isFolded ? '#666' : '#ccc')};
  transform: scale(${p => (p.isFolded ? 0.8 : 1)});
`

const Fold = styled.View<{ isFolded: boolean }>`
  ${p =>
    p.isFolded &&
    css`
      background: rgba(0, 0, 0, 0.6);
    `}
  width: 100%;
  height: 100%;
  border-radius: 50%;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 8px;
`

const StackWrap = styled.View`
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 6px;
  border-radius: 4px;
`

interface AvatarProps {
  name: string
  stack: number
  isTurn: boolean
  isFolded: boolean
}

export function Avatar({ isTurn, stack, isFolded }: AvatarProps) {
  return (
    <View>
      <OpacityWrapper isTurn={isTurn}>
        <Container isFolded={isFolded}>
          <Fold isFolded={isFolded}>
            <StackWrap>
              <Typography>${stack.toLocaleString()}</Typography>
            </StackWrap>
          </Fold>
        </Container>
      </OpacityWrapper>
    </View>
  )
}
