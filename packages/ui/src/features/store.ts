import { configureStore, Middleware } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import {
  certificatesState,
  devicesState,
  configurationState,
  generalState,
  usersState,
  web3State
} from '@energyweb/origin-ui-core';
import {
  bundlesState,
  ordersState,
  exchangeGeneralState,
  supplyState
} from '@energyweb/exchange-ui-core';
import { iRecDevicesState, iRecGeneralState } from '@energyweb/origin-ui-irec-core';
import { History } from 'history';

interface Config {
  history: History;
  sagaMiddleware: Middleware;
}

export const makeRootReducer = ({ history, sagaMiddleware }: Config) => configureStore({
  reducer: {
    router: connectRouter(history),
    // certificatesState,
    // devicesState,
    configurationState,
    generalState,
    usersState,
    // web3State,
    // bundlesState,
    // ordersState,
    // exchangeGeneralState,
    // supplyState,
    // iRecDevicesState,
    // iRecGeneralState,
  },
  middleware: [
    routerMiddleware(history),
    sagaMiddleware,
  ]
})