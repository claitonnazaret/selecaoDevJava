import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from './App';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { ptBR } from '@material-ui/core/locale';

const history = createBrowserHistory();

const theme = createMuiTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
    },
    ptBR,
);

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Router history={history}>
            <Switch>
                <Route path="/" component={App} />
            </Switch>
        </Router>
    </ThemeProvider>,
    document.getElementById('root'),
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
