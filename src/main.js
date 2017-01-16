import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { Router, Route, Link, browserHistory,IndexRoute,Redirect } from 'react-router'
import store from "./store";
import AddItem from "./components/additem.jsx";
import ModifyItem from "./components/modfiyitem.jsx";
import Login from "./components/loginview.jsx";
import User from "./components/userview.jsx";
import App from './App.jsx';

const requireAuth = (nextState,replace,next) => {
    if (store.getState().login === "None"){
        replace({
            pathname:'/cp/login'
        })
        next();
    }else{
        next();
    }
    
}

ReactDOM.render((
    <Provider store={store}>
        <Router history= { browserHistory }>
            <Route path="/" component={App}>
                <Redirect from='/cp' to="/cp/add" />
                <Route path="/cp/add" component= { AddItem } onEnter={ requireAuth }/>
                <Route path="/cp/modify" component = { ModifyItem }  onEnter={ requireAuth }/>
                <Route path="/cp/user" component = { User }  onEnter={ requireAuth } />
                <Route path='/cp/login' component= { Login }/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));