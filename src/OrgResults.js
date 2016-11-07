import React, {Component} from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Results extends Component {
  render() {
  	if (this.props.data.loading) {
    	return <div>Loading...</div>;
   	} else {
     	return (
       		<ul>
         		<li>{'Returned EIN: '}{this.props.data.organization.ein}</li>
         		<li>{'Total revenue: $'}{this.props.data.organization.total_revenue}</li>
         		<li>{'Total expenses: $'}{this.props.data.organization.total_expenses}</li>
         		<li>{'Net assets: $'}{this.props.data.organization.net_assets}</li>
       		</ul>
     	);
   	}
  }
}

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

const OrgWithResults = graphql(getOrg, {
  options: ({ ein }) => ({ variables: { ein } }),
})(Results);

export default OrgWithResults;
