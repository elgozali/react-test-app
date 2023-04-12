import './App.scss';
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import PrivateRoute from './components/Utils/PrivateRoute';
import PublicRoute from './components/Utils/PublicRoute';
import AppHeader from './components/Header/Header';
import Login from './containers/Login/Login';
import Home from './containers/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Switch>
        <PrivateRoute exact path="/" name="Home" component={Home} />
        <PrivateRoute exact path="/home" name="Home" component={Home} />
        <PublicRoute path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
