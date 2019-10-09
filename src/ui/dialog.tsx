import React, { useState, useImperativeHandle, ReactNode } from 'react'
import useForm from 'react-hook-form'
import Button from './button'

export const useDataModal = <T extends {}>(reset: () => T) => {
  const [isOpen, setOpen] = useState(false)
  const [data, setData] = useState<T>(reset())

  const openModal = (data: T | null) => {
    setData(data ? data : reset())
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    reset()
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
  children: ReactNode
}
const Modal = <T extends {}>({ open, children }: Props<T>) => {
  if (!open) {
    return null
  }
  return (<div className="dialog-container">
    <div className="dialog">
      {children}
    </div>
  </div>)
}

type BodyProps = {}
const Body: React.FC<BodyProps> = ({ children }) => {
  return (<div className="dialog-body">
    {children}
  </div>)
}

type HeaderProps = {}
const Header: React.FC<HeaderProps> = ({ children }) => {
  return (<div className="dialog-header">
    {children}
  </div>)
}

type FooterProps = {}
const Footer: React.FC<FooterProps> = ({ children }) => {
  return (<div className="dialog-footer">
    {children}
  </div>)
}

export default {
  Dialog: Modal,
  Body,
  Footer,
  Header
}
