import createSagaMiddleware from 'redux-saga';
import { IOriginConfiguration } from '@energyweb/origin-ui-core';
import { createStore } from './store';
import { createBrowserHistory, History } from 'history';
import { runSaga, setSagaRunner } from '@vmw/queue-for-redux-saga';
import { originSagas } from '../origin/sagas';
import { originConfig } from '../origin/config';
import { initializeI18N } from './i18n';

const initializeState = (config: IOriginConfiguration) => {
  const history: History = createBrowserHistory();
  const sagaMiddleware = createSagaMiddleware({
    context: config
  });
  
  const store = createStore({
    history,
    sagaMiddleware,
  });

  setSagaRunner(sagaMiddleware);

  setTimeout(() => {
    Object.values(originSagas).forEach((saga) => runSaga(saga));
  });

  return {
    store,
    history,
  };
}

export const initializeApp = () => {
  const { store, history } = initializeState(originConfig);

  initializeI18N(originConfig.language, 'en');

  return {
    store,
    history,
    originConfig,
  }
}