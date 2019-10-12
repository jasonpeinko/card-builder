import React, { useContext, useEffect, useState, useReducer } from 'react'
import { useSocket } from './use-socket'
import { useProjectContext } from '../data/project'

type State = {
  images: {
    [s: string]: string
  }
  loading: {
    [s: string]: boolean
  }
}
type Context = {
  storeImage: (img: string, data: string) => void
  getImage: (img: string) => void
  dispatch: (a: Action) => void
  state: State
}
export const ImageCacheContext = React.createContext<Context | undefined>(
  undefined
)
export const useImageCache = () => {
  const c = useContext(ImageCacheContext)
  if (!c) {
    throw new Error('data context not in provider')
  }
  return c
}

type Action =
  | { type: 'loading'; image: string }
  | { type: 'loaded'; image: string; data: string }
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.image]: true
        }
      }
    case 'loaded':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.image]: false
        },
        images: {
          ...state.images,
          [action.image]: action.data
        }
      }
  }
  return state
}
const Provider: React.FC = ({ children }) => {
  const ws = useSocket()
  const {
    state: {
      meta: { projectFile }
    }
  } = useProjectContext()
  const [state, dispatch] = useReducer(reducer, {
    images: {},
    loading: {}
  })
  useEffect(() => {
    return ws.on(action => {
      switch (action.type) {
        case 'image':
          console.log('image loaded')
          dispatch({
            type: 'loaded',
            image: action.image,
            data: action.data
          })
          break
      }
    })
  }, [])

  const storeImage = (image: string, data: string) => {
    ws.send({ type: 'store-image', image, data, project: projectFile })
  }

  const getImage = (image: string) => {
    console.log('get image')
    if (state.images.hasOwnProperty(image)) {
      console.log('cache hit')
      return state.images[image]
    } else if (!state.loading.hasOwnProperty(image)) {
      console.log('request load')
      ws.send({ type: 'load-image', image, project: projectFile })
      return 'loading'
    }
    console.log('miss')
    return 'miss'
  }

  const context = { state, dispatch, getImage, storeImage }
  console.log('cache', context)
  return (
    <ImageCacheContext.Provider value={context}>
      {children}
    </ImageCacheContext.Provider>
  )
}
export default Provider
