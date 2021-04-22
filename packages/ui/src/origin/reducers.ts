
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
import { Reducer } from 'redux';

export const originReducers = {
  certificatesState,
  devicesState,
  configurationState,
  generalState,
  usersState,
  web3State,
  // bundlesState,
  // ordersState,
  // exchangeGeneralState,
  // supplyState,
  // iRecDevicesState,
  // iRecGeneralState,
}


