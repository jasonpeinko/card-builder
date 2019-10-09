import React from 'react'
import ConstantsProvider from './data/constants'

type Props = {}
const Providers: React.FC<Props> = ({ children }) => {
  return (
    <ConstantsProvider>
      {children}
    </ConstantsProvider>)
}

export default Providers
