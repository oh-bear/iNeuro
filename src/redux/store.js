import {AsyncStorage} from 'react-native'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './reducers'
import thunk from 'redux-thunk'

const enhancer = composeWithDevTools({})(
  applyMiddleware(thunk)
)

const store = createStore(rootReducer, enhancer)

export default store
