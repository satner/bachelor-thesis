import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from "react-apollo";

import './App.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Summoners from './components/Summoners';
import Footer from './components/Footer';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import AccountDetails from './components/AccountDetails';
import Error from './components/Error';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

// TODO: override ant-design font-family
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <div>
            <Navigation />
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/summoners" component={Summoners} />
              <Route path="/login" component={LogIn}/>
              <Route path="/signup" component={SignUp}/>
              <Route path="/account-details" component={AccountDetails}/>
              <Route component={Error} />
            </Switch>
            <Footer />
          </div>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export default App;
