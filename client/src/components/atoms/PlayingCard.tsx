import * as React from 'react'
import { Card } from '@pokerhub/core'

interface PlayingCardProps {
  card: Card
}

const rankMap = new Map([
  [1, 'a'],
  [11, 'j'],
  [12, 'q'],
  [13, 'k'],
])

const suitMap = new Map([
  ['heart', 'hearts'],
  ['diamond', 'diams'],
  ['clover', 'clubs'],
  ['spade', 'spades'],
])

export function PlayingCard({ card }: PlayingCardProps) {
  return (
    <div className="playingCards faceImages">
      <span className={`card rank-${rankMap.get(card.num) || card.num} ${suitMap.get(card.sym)}`}>
        <span className="rank">{rankMap.get(card.num)?.toUpperCase() || card.num}</span>
        <span className="suit" dangerouslySetInnerHTML={{ __html: `&${suitMap.get(card.sym)};` }} />
      </span>
    </div>
  )
}
