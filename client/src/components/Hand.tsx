import React from 'react'
import { Text, View } from 'react-native'
import { Card } from '@fastpoker/core'

interface HandProps {
  cards: Card[]
}

export function Hand({ cards }: HandProps) {
  return (
    <View>
      {cards.map(card => (
        <View key={`${card.sym}${card.num}`}>
          <Text>
            {card.sym} / {card.num}
          </Text>
        </View>
      ))}
    </View>
  )
}
