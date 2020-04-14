import * as React from 'react'
import styled from 'styled-components/native'
import { Button } from '../atoms/Button'

const Container = styled.View`
  flex-direction: row;
`

const Input = styled.TextInput`
  padding: 8px;
  border: solid 1px #ccc;
  margin-right: 8px;
  border-radius: 3px;
`

interface BetWindowProps {
  onBet: (a: number) => void
  maximumBetting: number
}

export function BetWindow({ onBet, maximumBetting = 0 }: BetWindowProps) {
  const [amount, setAmount] = React.useState('')
  const [show, setShow] = React.useState(false)

  const onPress = () => {
    if (!show) {
      setShow(true)
    } else {
      onBet(Number(amount))
    }
  }

  const disabled = React.useMemo(() => show && (amount === '' || Number(amount) < maximumBetting), [
    show,
    amount,
    maximumBetting,
  ])

  return (
    <Container>
      {show && <Input autoFocus value={amount} keyboardType="numeric" onChangeText={setAmount} />}
      <Button disabled={disabled} danger={show} onPress={onPress}>
        BET
      </Button>
    </Container>
  )
}
