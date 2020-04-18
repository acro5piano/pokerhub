import test from 'ava'
import { Player, Card, getWinners } from '../src/entities'

function makePlayer(id: string, hand: Card[]) {
  const player = new Player(id, 0)
  player.hand = hand
  return player
}

test('flush', t => {
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

  const { winners, hand } = getWinners(communityCards, [player1, player2])
  t.is(winners.length, 1)
  t.is(winners[0].id, 'player1')
  t.is(hand, 'Flush, Ac High')
})

test('chop', t => {
  // prettier-ignore
  const communityCards = [
    new Card ( 7, 'spade' ),
    new Card ( 8, 'spade' ),
    new Card ( 9, 'spade' ),
    new Card ( 10, 'spade'),
    new Card ( 11, 'spade'),
  ]

  // prettier-ignore
  const player1 = makePlayer('player1', [
    new Card(1, 'spade'),
    new Card(2, 'spade'),
  ])

  // prettier-ignore
  const player2 = makePlayer('player2', [
    new Card(5, 'spade'),
    new Card(6, 'spade'),
  ])

  const { winners, hand } = getWinners(communityCards, [player1, player2])

  t.is(hand, 'Straight Flush, Js High')
  t.is(winners.length, 2)
})
