import React, { Component } from 'react';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import './App.css';

import OrgWithResults from './OrgResults.js';

class App extends Component {
  constructor(...args) {
    super(...args);

    const networkInterface = createNetworkInterface('http://detroitledger.org:8081/graphql');
    this.client = new ApolloClient({
      networkInterface,
      dataIdFromObject: r => r.id,
    });

      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    // add throttle so only run query on full ein after done typing
    // lodash method debounce for trailing https://lodash.com/docs/4.16.6#debounce
  }
  
  handleSubmit(event) {
    console.log('Ein search value is: ' + this.state.value);
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <div>
        <input type='text' 
            placeholder='Search by EIN' 
            onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>
            Search
        </button>
        <OrgWithResults ein={this.state.value} />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
