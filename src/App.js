import React, { Component } from 'react';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import _ from 'lodash';

import './App.css';

import OrgWithResults from './OrgResults.js';

// Highest level component
class App extends Component {
  constructor(...args) {
    super(...args);

    // Create server connection
    const networkInterface = createNetworkInterface('http://detroitledger.org:8081/graphql');
    this.client = new ApolloClient({
      networkInterface,
      dataIdFromObject: r => r.id,
    });

    // Set initial ein search value as empty string, handle input change
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);

    // Delay invoking query until full ein value is input
    // Run in constructor to create a debounced func for each component instance 
    // Ref https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.delaySearch = _.debounce(this.handleChange, 50, {
      'leading': false,
      'trailing': true
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <div>
          <input type='text' 
            placeholder='Search by EIN' 
            onChange={this.handleChange} />
          <OrgWithResults ein={this.state.value} />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
