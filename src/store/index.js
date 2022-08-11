import {
    legacy_createStore as createStore
} from 'redux'
import reducer from './recucers'

const store = createStore(reducer)
export default store