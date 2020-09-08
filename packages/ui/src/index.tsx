import { render } from 'react-dom';
import React from 'react';

import {
    Origin,
    OriginConfigurationProvider,
    createOriginConfiguration
} from '@energyweb/origin-ui-core';

const originConfiguration = createOriginConfiguration({
    /* 
        Override the Origin configuration here
    */
});

render(
    <OriginConfigurationProvider value={originConfiguration}>
        <Origin />
    </OriginConfigurationProvider>,
    document.getElementById('root')
);
