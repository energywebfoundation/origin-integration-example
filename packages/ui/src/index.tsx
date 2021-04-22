import { render } from 'react-dom';
import React from 'react';
import './styles/app.scss';
import { OriginConfigurationProvider } from '@energyweb/origin-ui-core';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { initializeApp } from './initialization';
import { App } from './components/App';

const { history, store, originConfig } = initializeApp();
 
render(
    <OriginConfigurationProvider value={originConfig}>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App history={history} />
            </ConnectedRouter>
        </Provider>
    </OriginConfigurationProvider>,
    document.getElementById('root')
);
