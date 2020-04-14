import * as React from 'react'
import styled from 'styled-components/native'
import { Typography } from '../atoms/Typography'

const Num = styled(Typography)`
  margin: 16px;
  font-size: 24px;
`

interface DollarProps {
  amount: number
}

export function Dollar({ amount }: DollarProps) {
  if (amount === 0) {
    return null
  }
  return <Num>${amount.toLocaleString()}</Num>
}
