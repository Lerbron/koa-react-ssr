import {
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import {
  createLogger
} from 'redux-logger'
import {
  composeWithDevTools
} from 'redux-devtools-extension';
let middleware = [thunk]

const IS_DEV = process.env.NODE_ENV == 'development'

// 如果是在客户端环境，并且是开发模式，那么打印redux日志
if (IS_DEV && __CLIENT__) middleware.push(createLogger())

export default function configureStore(initialState) {
  const store = IS_DEV == 'development' ? createStore(rootReducer, initialState, composeWithDevTools(compose(applyMiddleware(...middleware)))) : createStore(rootReducer, initialState, compose(applyMiddleware(...middleware)))

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers/index')
      store.replaceReducer(nextRootReducer)
      return true
    })
  }

  return store
}