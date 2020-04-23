import React from 'react';
import './App.css';
import { Route, Router, Switch } from 'react-router';
import { ClientList, ClientPage, Login } from './pages';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function App() {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/cliente" component={ClientList} />
                <Route exact path="/cliente/:id" component={ClientPage} />
            </Switch>
        </Router>
    );
}

export default App;
