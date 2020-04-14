import * as React from 'react'
import styled from 'styled-components/native'
import { Dimensions, View } from 'react-native'
import { Board } from '@fastpoker/core'
import { PlayingCard } from '../atoms/PlayingCard'

const Container = styled.View`
  justify-content: center;
  align-items: center;
`

const Pot = styled.Text`
  font-size: 24px;
  margin: 16px;
`

export const BREAKPOINT = 768

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
      <Pot>{board.pot - bettingAmountSum}</Pot>
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
