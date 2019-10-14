import React from 'react'
import ConstantsProvider from './data/project'
import SocketProvider from './hooks/use-socket'
import ImageCacheProvider from './hooks/use-image-cache'
import AppProvider from './data/app'

type Props = {}
const Providers: React.FC<Props> = ({ children }) => {
  return (
    <AppProvider>
      <ConstantsProvider>
        <SocketProvider>
          <ImageCacheProvider>{children}</ImageCacheProvider>
        </SocketProvider>
      </ConstantsProvider>
    </AppProvider>
  )
}

export default Providers
