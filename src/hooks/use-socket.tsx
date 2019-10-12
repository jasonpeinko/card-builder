import React, { useContext, useEffect, useState } from 'react'
const ws = new WebSocket('ws://localhost:61111')

type Context = {
  loading: boolean
  connected: boolean
  send: (action: SocketServerAction) => void
  on: (callback: (action: SocketClientAction) => void) => () => void
}
export const SocketContext = React.createContext<Context | undefined>(undefined)
export const useSocket = () => {
  const c = useContext(SocketContext)
  if (!c) {
    throw new Error('data context not in provider')
  }
  return c
}
type Listener = (action: SocketClientAction) => void
let listeners: Listener[] = []

const Provider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  useEffect(() => {
    ws.addEventListener('open', () => {
      setLoading(false)
      setConnected(true)
    })
    ws.addEventListener('close', () => {
      setLoading(false)
      setConnected(false)
    })
    ws.addEventListener('message', event => {
      const action = JSON.parse(event.data) as SocketClientAction
      console.log(JSON.parse(event.data))
      listeners.forEach(l => l(action))
      setLoading(false)
      setConnected(true)
    })
    return () => {}
  }, [ws])

  const send = (action: SocketServerAction) => {
    ws.send(JSON.stringify(action))
  }

  const on = (callback: (action: SocketClientAction) => void) => {
    console.log('add listener')
    const listener = (action: SocketClientAction) => {
      callback(action)
    }
    listeners.push(listener)
    return () => {
      console.log('remove listener')
      listeners = listeners.filter(l => l !== listener)
    }
  }

  const context = { loading, connected, send, on }
  console.log('provider')
  if (!connected) return null
  return (
    <SocketContext.Provider value={context}>{children}</SocketContext.Provider>
  )
}
export default Provider
