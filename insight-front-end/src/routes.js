import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Loadable from 'react-dynamic-loadable';
import App from './containers/App';

import Home from './containers/Home';
import Login from './containers/Login';
import Register from './containers/Register';
import NotMatch from './containers/NotMatch';


// 路由配置一级
const routeMap = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/home',
    component: Home,
    exact: true,
  },
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/register',
    component: Register,
    exact: true,
  },
  {
    path: undefined,
    component: NotMatch,
    exact: false,
  },
];

export default (
  <BrowserRouter>
    <App>
      <Switch>
        {
          routeMap.map((item, index) => {
            return (
              <Route
                key={index}
                path={item.path}
                exact={item.exact}
                component={
                  Loadable({
                    component: () => item.component,
                    LoadingComponent: () => <span>loading....</span>,
                  })
                }
              />
            );
          })
        }
      </Switch>
    </App>
  </BrowserRouter>
);
