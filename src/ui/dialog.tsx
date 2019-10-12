import React, { ReactNode, useState } from 'react'

export const useDataModal = <T extends {}>(reset: () => T) => {
  const [isOpen, setOpen] = useState(false)
  const [data, setData] = useState<T>(reset())

  const openModal = (data: T | null) => {
    setData(data ? data : reset())
    setOpen(true)
  }

  const closeModal = () => {
    setData(reset())
    setOpen(false)
  }
  return {
    open: openModal,
    close: closeModal,
    isOpen,
    data,
    reset: reset
  }
}

type Props<T> = {
  open: boolean
  className?: string
  children: ReactNode
  onPaste?: (e: React.ClipboardEvent<HTMLDivElement>) => void
}
const Modal = <T extends {}>({
  className = '',
  onPaste,
  open,
  children
}: Props<T>) => {
  if (!open) {
    return null
  }
  return (
    <div
      className={`dialog-container ${className}`}
      onPaste={e => (onPaste ? onPaste(e) : null)}
    >
      <div className='dialog'>{children}</div>
    </div>
  )
}

type BodyProps = {}
const Body: React.FC<BodyProps> = ({ children }) => {
  return <div className='dialog-body'>{children}</div>
}

type HeaderProps = {}
const Header: React.FC<HeaderProps> = ({ children }) => {
  return <div className='dialog-header'>{children}</div>
}

type FooterProps = {}
const Footer: React.FC<FooterProps> = ({ children }) => {
  return <div className='dialog-footer'>{children}</div>
}

export default {
  Dialog: Modal,
  Body,
  Footer,
  Header
}
