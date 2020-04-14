import React from 'react'
import { View } from 'react-native'
import { Card } from '@fastpoker/core'
import { PlayingCard } from '../atoms/PlayingCard'

interface HandProps {
  cards: Card[]
}

export function Hand({ cards }: HandProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {cards.map(card => (
        <View key={`${card.sym}${card.num}`}>
          <PlayingCard card={card} />
        </View>
      ))}
    </View>
  )
}
