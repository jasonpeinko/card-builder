import React from 'react'
import ConstantsProvider from './data/project'
import SocketProvider from './hooks/use-socket'
import ImageCacheProvider from './hooks/use-image-cache'

type Props = {}
const Providers: React.FC<Props> = ({ children }) => {
  return (
    <ConstantsProvider>
      <SocketProvider>
        <ImageCacheProvider>{children}</ImageCacheProvider>
      </SocketProvider>
    </ConstantsProvider>
  )
}

export default Providers
