//https://redux.js.org/tutorials/fundamentals/part-1-overview
//https://redux.js.org/tutorials/fundamentals/part-4-store
//create store instance by calling redux library createStore API
//define reducer in reducers.js and pass as argument in createStore

import { createStore } from 'redux';
import reducer from './reducers';

export default createStore(reducer);