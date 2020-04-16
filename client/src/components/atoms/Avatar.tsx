import * as React from 'react'
import { Player } from '@fastpoker/core'
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

const Container = styled.View<{ isFolded: boolean; avatarImageUrl: string }>`
  width: 100px
  height: 100px
  border-radius: 50%;
  background-image: url(${p => p.avatarImageUrl});
  background-size: cover;
  border: solid 2px ${p => (p.isFolded ? '#666' : '#ccc')};
  transform: scale(${p => (p.isFolded ? 0.8 : 1)});
`

const Mask = styled.View<{ isFolded: boolean }>`
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
  align-items: center;
`

interface AvatarProps {
  player: Player
  isTurn: boolean
}

export function Avatar({ isTurn, player }: AvatarProps) {
  const isFolded = !player.isActive || player.hand.length === 0
  return (
    <View>
      <OpacityWrapper isTurn={isTurn}>
        <Container isFolded={isFolded} avatarImageUrl={player.avatarImageUrl}>
          <Mask isFolded={isFolded}>
            <StackWrap>
              <Typography>{player.id}</Typography>
              <Typography>${player.stack.toLocaleString()}</Typography>
            </StackWrap>
          </Mask>
        </Container>
      </OpacityWrapper>
    </View>
  )
}
