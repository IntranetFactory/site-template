import { combineReducers } from 'redux';


import rx from '../../rx/reducers';

export default combineReducers({
  
  health: combineReducers({
    rx,   
  })
  
});
