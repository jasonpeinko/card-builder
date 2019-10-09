import React from 'react'
import { useRoutes } from 'hookrouter'
import Cards from './cards'
import Constants from './constants'

const routes = {
  '/': () => <Cards />,
  '/cards': () => <Cards />,
  '/constants': () => <Constants />,
}

type Props = {}
const Router: React.FC<Props> = () => {
  const match = useRoutes(routes)
  return match
}

export default Router
