import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import stores from './stores';
import Routes from './routes';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './less/public.less';
import './less/glitch.less';
import './less/component.less';
import './less/overrides.less';


ReactDOM.render(
    <Provider {...stores}>
        {Routes}
    </Provider>,
    document.getElementById('root'),
);
