import { generalSaga, usersSaga, certificatesSaga, devicesSaga } from '@energyweb/origin-ui-core';
import {
    ordersSaga,
    bundlesSaga,
    exchangeGeneralSaga,
    supplySaga
} from '@energyweb/exchange-ui-core';
import { iRecDevicesSaga, iRecGeneralSaga } from '@energyweb/origin-ui-irec-core';
import { SagaIterator } from '@redux-saga/types';

export const originSagas: { [sagaName: string]: () => SagaIterator } = {
    generalSaga,
    usersSaga,
    certificatesSaga,
    devicesSaga,
    // exchangeGeneralSaga,
    // ordersSaga,
    // bundlesSaga,
    // supplySaga,
    // iRecDevicesSaga,
    // iRecGeneralSaga
};