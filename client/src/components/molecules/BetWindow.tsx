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
  color: #fff;
`

interface BetWindowProps {
  onBet: (a: number) => void
  maximumBetting: number
  stack: number
}

export function BetWindow({ onBet, maximumBetting = 0, stack }: BetWindowProps) {
  const [amount, setAmount] = React.useState('')
  const [show, setShow] = React.useState(false)

  const onChange = React.useCallback(
    (amount: string) => {
      const _amount = Number(amount)
      setAmount(String(Math.min(_amount, stack)))
    },
    [stack],
  )

  const onPress = React.useCallback(() => {
    if (!show) {
      setShow(true)
    } else {
      onBet(Number(amount))
    }
  }, [show, amount])

  const disabled = React.useMemo(() => {
    if (!show) {
      return false
    }
    const _amount = Number(amount)
    if (amount === '' || Number.isNaN(_amount)) {
      return true
    }
    return (_amount === 0 && _amount < maximumBetting) || stack < _amount
  }, [show, amount, maximumBetting, stack])

  return (
    <Container>
      {show && <Input autoFocus value={amount} keyboardType="numeric" onChangeText={onChange} />}
      <Button disabled={disabled} danger={show} onPress={onPress}>
        BET
      </Button>
    </Container>
  )
}
