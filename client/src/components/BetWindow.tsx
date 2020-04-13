import * as React from 'react'
import { TextInput, View } from 'react-native'
import { Button } from './Button'

interface BetWindowProps {
  onBet: (a: number) => void
}

export function BetWindow({ onBet }: BetWindowProps) {
  const [amount, setAmount] = React.useState('0')

  const _onBet = () => {
    onBet(Number(amount))
  }

  return (
    <View>
      <TextInput value={amount} keyboardType="numeric" onChange={t => setAmount(t.target) as any} />
      <Button onPress={_onBet}>Bet</Button>
    </View>
  )
}
