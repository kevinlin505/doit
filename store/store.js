import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createWaitForState from 'redux-wait-for-state';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import rootReducer from '../providers/_index';
import crashReporter from '../helpers/crashReporter';

const { waitForState, setStore } = createWaitForState();
const enhancer = composeWithDevTools(applyMiddleware(thunk.withExtraArgument({ waitForState }), crashReporter));

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  setStore(store);
  return store;
}