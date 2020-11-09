import { render } from 'react-dom';
import React from 'react';

import {
    Origin,
    OriginConfigurationProvider,
    createOriginConfiguration
} from '@energyweb/origin-ui-core';
import { allOriginFeatures, OriginFeature } from '@energyweb/utils-general';

import './styles/app.scss';

const originConfiguration = createOriginConfiguration({
    enabledFeatures: allOriginFeatures.filter(feature => feature !== OriginFeature.IRec && feature !== OriginFeature.IRecConnect)
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
