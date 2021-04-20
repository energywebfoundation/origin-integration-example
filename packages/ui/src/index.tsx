import { render } from 'react-dom';
import React from 'react';
import './styles/app.scss';
import { OriginConfigurationProvider, IOriginConfiguration } from '@energyweb/origin-ui-core';
import { allOriginFeatures, OriginFeature } from '@energyweb/utils-general';
import { createMaterialThemeForOrigin } from './theme';

const styleConfig = {
    PRIMARY_COLOR: '#F00',
    PRIMARY_COLOR_DARK: '#F00',
    PRIMARY_COLOR_DIM: '#F00',
    TEXT_COLOR_DEFAULT: '#000',
    SIMPLE_TEXT_COLOR: '#000',
    MAIN_BACKGROUND_COLOR: '#FFF',
    FIELD_ICON_COLOR: '#0F0',
    WHITE: '#FFF',
}

const config: IOriginConfiguration = {
    customSliderStyle: [],
    defaultLanguage: 'en',
    enabledFeatures: allOriginFeatures.filter(feature => feature !== OriginFeature.IRec && feature !== OriginFeature.IRecConnect),
    language: 'en',
    loginPageBg: () => (<>BG</>),
    logo: () => (<>Logo</>),
    materialTheme: createMaterialThemeForOrigin(styleConfig, 'en'),
    styleConfig,
};

render(
    <OriginConfigurationProvider value={config}>
        Origin Integration Example
    </OriginConfigurationProvider>,
    document.getElementById('root')
);
