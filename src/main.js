import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import store from "./store";
import { Router, Route, Link, browserHistory,IndexRoute,Redirect } from 'react-router'
import AddItem from "./components/additem.jsx";
import ModifyItem from "./components/modfiyitem.jsx";
import App from './App.jsx';
import { switchPage } from "./actions/items";

ReactDOM.render((
    <Provider store={store}>
        <Router history= { browserHistory }>
            <Route path="/" component={App}>
                <Redirect from='/cp' to="/cp/add" />
                <Route path="/cp/add" component= { AddItem } />
                <Route path="/cp/modify" component = { ModifyItem } />
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));