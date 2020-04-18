import React from 'react'
import styled from 'styled-components/native'

const ModalContainer = styled.View`
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 4px 12px;
  margin-bottom: -8px;
  position: fixed;
  top: 50%;
  left: 0;
  width: 100%;
`

interface ModalProps {
  children: React.ReactNode
}

export function Modal({ children }: ModalProps) {
  return <ModalContainer>{children}</ModalContainer>
}
