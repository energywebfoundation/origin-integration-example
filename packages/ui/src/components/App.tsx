import React, { useContext } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UiCoreAdapter, LoginPage, Admin, Organization, useLinks, OriginConfigurationContext, Device, Account, Certificates, DeviceDataLayers } from '@energyweb/origin-ui-core';
import { useStore } from 'react-redux';
import { History } from 'history';
import { ExchangeAdapter, ExchangeApp } from '@energyweb/exchange-ui-core';

interface IProps {
  history: History;
}

export const App = ({ history }: IProps) => {
  const {
      getAdminLink,
      getOrganizationLink,
      getDevicesLink,
      getAccountLink,
      getExchangeLink,
      getCertificatesLink,
  } = useLinks();

  const store = useStore();
  const originConfig = useContext(OriginConfigurationContext);

  const { t } = useTranslation();
  
  return (
      <Switch>
      <Route path='/login'>
          <UiCoreAdapter
            store={store}
            configuration={originConfig}
            history={history}
            component={<LoginPage />}
          />
      </Route>
      <Route>
        <NavLink to={getAdminLink()}>{t('header.admin')}</NavLink>
        <NavLink to={getOrganizationLink()}>{t('header.organization')}</NavLink>
        <NavLink to={getDevicesLink()}>{t('header.devices')}</NavLink>
        <NavLink to={getAccountLink()}>{t('header.account')}</NavLink>
        <NavLink to={getCertificatesLink()}>{t('header.certificates')}</NavLink>
        <NavLink to={getExchangeLink()}>{t('header.exchange')}</NavLink>
        <Switch>
          <Route path={getAdminLink()}>
            <UiCoreAdapter
              store={store}
              configuration={originConfig}
              history={history}
              component={<Admin />}
            />
          </Route>
          <Route path={getOrganizationLink()}>
            <UiCoreAdapter
              store={store}
              configuration={originConfig}
              history={history}
              component={<Organization />}
            />
          </Route>
          <Route path={getDevicesLink()}>
            <UiCoreAdapter
              store={store}
              configuration={originConfig}
              history={history}
              component={<Device />}
            />
          </Route>
          <Route path={getAccountLink()}>
            <UiCoreAdapter
              store={store}
              configuration={originConfig}
              history={history}
              component={<Account />}
            />
          </Route>
          <Route path={getCertificatesLink()}>
            <UiCoreAdapter
              store={store}
              configuration={originConfig}
              history={history}
              component={<Certificates/>}
            />
          </Route>
          <Route path={getExchangeLink()}>
            <ExchangeAdapter
              store={store}
              configuration={originConfig}
              history={history}
              component={<ExchangeApp />}
              deviceDataLayer={DeviceDataLayers.OriginFormDevice}
            />
          </Route>
        </Switch>
      </Route>
  </Switch>
  );
}
