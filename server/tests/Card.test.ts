import test from 'ava'
import { Card } from '../src/entities'
import { times } from '@pokerhub/core'

// To ensure card generation
test('randomizeSeed', t => {
  Card.randomizeSeed()
  times(50, () => {
    new Card()
  })

  Card.randomizeSeed()
  times(50, () => {
    new Card()
  })

  t.truthy(new Card())
})
