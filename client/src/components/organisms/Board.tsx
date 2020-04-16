import * as React from 'react'
import styled from 'styled-components/native'
import { Dimensions, View } from 'react-native'
import { Board } from '@pokerhub/core'
import { PlayingCard } from '../atoms/PlayingCard'
import { Typography } from '../atoms/Typography'
import { Dollar } from '../molecules/Dollar'

const Container = styled.View`
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  top: 18%;
  left: 0;
`

const PotContainer = styled.View`
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 4px 12px;
  margin-bottom: -8px;
`

const PotTitle = styled(Typography)`
  font-size: 24px;
`

export const BREAKPOINT = 378

const scale = Dimensions.get('window').width < BREAKPOINT ? '0.5' : '1'

const CardsWrap = styled.View`
  height: 200px;
  flex-direction: row;
  transform: scale(${scale});
`

interface BoardProps {
  board: Board
  bettingAmountSum: number
}

export function Board({ board, bettingAmountSum }: BoardProps) {
  return (
    <Container>
      <PotContainer>
        <PotTitle>POT</PotTitle>
      </PotContainer>
      <Dollar amount={board.pot - bettingAmountSum} />
      <CardsWrap>
        {board.cards.map((card, i) => (
          <View key={i}>
            <PlayingCard card={card} />
          </View>
        ))}
      </CardsWrap>
    </Container>
  )
}
