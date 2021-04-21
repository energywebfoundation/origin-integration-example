import { render } from 'react-dom';
import React from 'react';
import './styles/app.scss';
import createSagaMiddleware from 'redux-saga';
import { OriginConfigurationProvider, IOriginConfiguration, UiCoreAdapter, LoginPage } from '@energyweb/origin-ui-core';
import { allOriginFeatures, OriginFeature } from '@energyweb/utils-general';
import { createMaterialThemeForOrigin } from './theme';
import { Provider } from 'react-redux';
import { makeRootReducer } from './features/store';
import { createBrowserHistory, History } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { runSaga, setSagaRunner } from '@vmw/queue-for-redux-saga';
import { Route } from 'react-router-dom';
import { sagas } from './features/sagas';
import { ORIGIN_LANGUAGE, ORIGIN_LANGUAGES } from '@energyweb/localization';
import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

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

const sagaMiddleware = createSagaMiddleware({
    context: config
});

const browserHistory: History = createBrowserHistory();
const store = makeRootReducer({ history: browserHistory, sagaMiddleware });

setSagaRunner(sagaMiddleware);

setTimeout(() => {
    Object.values(sagas).forEach((saga) => runSaga(saga));
});

const initializeI18N = (
    language: ORIGIN_LANGUAGE = 'en',
    fallbackLanguage: ORIGIN_LANGUAGE = 'en'
) => {
    i18n.use(new ICU())
        .use(initReactI18next)
        .init({
            resources: ORIGIN_LANGUAGES,
            lng: language,
            fallbackLng: fallbackLanguage,

            interpolation: {
                escapeValue: false
            }
        });

    return i18n;
};

initializeI18N(config.language);

render(
    <OriginConfigurationProvider value={config}>
        <Provider store={store}>
            <ConnectedRouter history={browserHistory}>
                    <Route path='/'>
                        <UiCoreAdapter
                            store={store as any}
                            configuration={config}
                            history={browserHistory}
                            component={<LoginPage />}
                        />
                    </Route>
            </ConnectedRouter>
        </Provider>
    </OriginConfigurationProvider>,
    document.getElementById('root')
);
