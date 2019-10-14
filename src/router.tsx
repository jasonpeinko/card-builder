import React from 'react'
import { useRoutes } from 'hookrouter'
import Cards from './cards'
import Constants from './constants'
import Collection from './collection'

const routes = {
  '/': () => <Cards />,
  '/cards': () => <Cards />,
  '/constants': () => <Constants />,
  '/collection/:id': ({ id }: any) => <Collection id={parseInt(id, 10)} />
}

type Props = {}
const Router: React.FC<Props> = () => {
  const match = useRoutes(routes)
  return match
}

export default Router
