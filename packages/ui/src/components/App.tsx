import React, { useContext } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UiCoreAdapter, LoginPage, Admin, Organization, useLinks, OriginConfigurationContext } from '@energyweb/origin-ui-core';
import { useStore } from 'react-redux';
import { History } from 'history';

interface IProps {
  history: History;
}

export const App = ({ history }: IProps) => {
  const {
      getAdminLink,
      getOrganizationLink,
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
        </Switch>
      </Route>
  </Switch>
  );
}
