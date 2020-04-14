import test from 'ava'
import { Player, Card, getWinners } from '../src/entities'

function makePlayer(id: string, hand: Card[]) {
  const player = new Player(id, 0)
  player.hand = hand
  return player
}

test('getWinners', t => {
  // prettier-ignore
  const communityCards = [
    new Card(1, 'spade'),
    new Card(3, 'diamond'),
    new Card(7, 'clover'),
    new Card(11, 'clover'),
    new Card(12, 'clover'),
  ]

  // prettier-ignore
  const player1 = makePlayer('player1', [
    new Card(1, 'clover'),
    new Card(2, 'clover'),
  ])

  // prettier-ignore
  const player2 = makePlayer('player2', [
    new Card(6, 'heart'),
    new Card(6, 'heart'),
  ])

  const winners = getWinners(communityCards, [player1, player2])
  t.is(winners.length, 1)
  t.is(winners[0].id, 'player1')
})
