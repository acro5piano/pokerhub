import React from 'react'
import { Modal } from '~/components/atoms/Modal'
import { Typography } from '~/components/atoms/Typography'

interface HandIndicatorProps {
  winningHand: string
}

export function HandIndicator({ winningHand }: HandIndicatorProps) {
  return (
    <Modal>
      <Typography>{winningHand}</Typography>
    </Modal>
  )
}
