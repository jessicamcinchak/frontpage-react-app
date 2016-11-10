import React, {Component} from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import numeral from 'numeral';

// Child component to display query results
class Results extends Component {
  render() {
  	const thisOrg = this.props.data.organization;

    if (this.props.data.loading) {
    	return <div>Loading...</div>;
   	} else {
      // Use map to return arrays in single React item
      const forms990Years = thisOrg.forms990.map(function(form990) {
        return <div>
          {form990.tax_period}
        </div>;
      });

      const grantAmounts = thisOrg.ledgerGrants.map(function(grant) {
        return <div>{numeral(grant.amount).format('$0,0[.]00')}</div>;
      });

     	return (
        <div>
       		<ul>
         		<li>{'Returned EIN: '}{thisOrg.ein}</li>
         		<li>{'Total revenue: '}{numeral(thisOrg.total_revenue).format('$0,0[.]00')}</li>
         		<li>{'Total expenses: '}{numeral(thisOrg.total_expenses).format('$0,0[.]00')}</li>
         		<li>{'Net assets: '}{numeral(thisOrg.net_assets).format('$0,0[.]00')}</li>
            <li>{'990s available for tax periods ending: '}{forms990Years}</li>
            <li>{'Sample grant amounts: '}{grantAmounts}</li>
       		</ul>
        </div>
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
      data,
      forms990 {
        id,
        ein,
        tax_period,
        total_assets
      },
      ledgerOrganizations {
        ein
      },
      ledgerGrants {
        id,
        ein,
        amount,
        start,
        end
      },
      ledgerNewsArticles {
        id,
        link,
        date,
        desc
      }
  	}
   }
`;

// Child component to run query and set ein as props on Results wrapper component
const OrgWithResults = graphql(getOrg, {
  options: ({ ein }) => ({ variables: { ein } }),
})(Results);

export default OrgWithResults;
