import React, {Component} from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

// Child component to display query results
class Results extends Component {
  render() {
  	const thisOrg = this.props.data.organization;
  	
    if (this.props.data.loading) {
    	return <div>Loading...</div>;
   	} else {
     	return (
       		<ul>
         		<li>{'Returned EIN: '}{thisOrg.ein}</li>
         		<li>{'Total revenue: $'}{thisOrg.total_revenue}</li>
         		<li>{'Total expenses: $'}{thisOrg.total_expenses}</li>
         		<li>{'Net assets: $'}{thisOrg.net_assets}</li>
       		</ul>
     	);
   	}
  }
}

// Define query with ein search parameter
const getOrg = gql`
  query getOrg($ein: String!) {
  	organization(ein: $ein) {
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
`;

// Child component to run query and set ein as props on Results wrapper component
const OrgWithResults = graphql(getOrg, {
  options: ({ ein }) => ({ variables: { ein } }),
})(Results);

export default OrgWithResults;
