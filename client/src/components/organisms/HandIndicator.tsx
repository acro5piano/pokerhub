import React from 'react'
import { Modal } from '~/components/atoms/Modal'

interface HandIndicatorProps {
  winningHand: string
}

export function HandIndicator({ winningHand }: HandIndicatorProps) {
  return (
    <Modal>
      <span>{winningHand}</span>
    </Modal>
  )
}
