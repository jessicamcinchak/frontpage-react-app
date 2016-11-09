import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

// NO LONGER USED. See OrgResults.js
// Simple example component, connect to Ledger gnl-graphql server
// see https://github.com/apollostack/frontpage-react-app
// and https://github.com/apollostack/frontpage-server/blob/master/server.js

// Component to handle search and store its value as state
class SearchEin extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log('Ein search value is: ' + this.state.value);
  }

  render() {
    return <div>
      <input type='text' 
        placeholder='Search by EIN' 
        onChange={this.handleChange} />
      <button onClick={this.handleSubmit}>
        Search
      </button>
    </div>
  }
}

// The data prop, which is provided by the wrapper below contains,
// a `loading` key while the query is in flight and posts when it is ready
function Organization({ data: { loading, organization } }) {
  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        <SearchEin />
        <li>{'Search value: '}{}</li>
        <li>{'Returned EIN: '}{organization.ein}</li>
        <li>{'Total revenue: $'}{organization.total_revenue}</li>
        <li>{'Total expenses: $'}{organization.total_expenses}</li>
        <li>{'Net assets: $'}{organization.net_assets}</li>
      </ul>
    );
  }
}

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component
export default graphql(gql`
  query getOrg {
    organization(ein:"200877805") {
      ein,
      id,
      subsccd,
      pdf,
      filing_type,
      start_year,
      end_year,
      irs_year,
      filing_date,
      tax_period,
      contributions_and_grants,
      program_service_revenue,
      investment_income,
      other_revenue,
      total_revenue,
      grants_paid,
      benefits_paid,
      compensation,
      fundraising_fees,
      total_fundraising_expenses,
      other_expenses,
      total_expenses,
      revenue_less_expenses,
      total_assets,
      total_liabilities,
      net_assets,
      data
    }
  }
`)(Organization);
