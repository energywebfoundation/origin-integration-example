import { configureStore } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { Middleware } from 'redux';
import { History } from 'history';
import { originReducers } from '../origin/reducers';

interface Config {
  history: History;
  sagaMiddleware: Middleware;
}

export const createStore = ({ history, sagaMiddleware }: Config) => configureStore({
  reducer: {
    router: connectRouter(history),
    ...originReducers,
  },
  middleware: [
    routerMiddleware(history),
    sagaMiddleware,
  ]
});