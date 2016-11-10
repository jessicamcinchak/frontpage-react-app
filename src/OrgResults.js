import React, {Component} from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import numeral from 'numeral';
import moment from 'moment';

// Child component to display query results
class Results extends Component {
  render() {
  	const thisOrg = this.props.data.organization;

    if (this.props.data.loading) {
    	return <div>Loading...</div>;
   	} else {
      // Use map to return arrays in single React item
      const orgName = thisOrg.ledgerOrganizations.map(function(org) {
        return <div>{org.name}</div>;
      });

      const orgDesc = thisOrg.ledgerOrganizations.map(function(org) {
        return <div>{org.description}</div>;
      });

     	return (
        <div>
          <h1>{orgName}</h1>
          <p>{orgDesc}</p>
          <h2>{'Financials'}</h2>
          <table>
            <thead>
              <tr>
                <th>IRS tax period ending {moment(thisOrg.tax_period,'YYYYMM').format('MMM YYYY')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total revenue</td>
                <td>{numeral(thisOrg.total_revenue).format('$0,0[.]00')}</td>
              </tr>
              <tr>
                <td>Total expenses</td>
                <td>{numeral(thisOrg.total_expenses).format('$0,0[.]00')}</td>
              </tr>
              <tr>
                <td>Net assets</td>
                <td>{numeral(thisOrg.net_assets).format('$0,0[.]00')}</td>
              </tr>
              <tr>
                <td>Total liabilities</td>
                <td>{numeral(thisOrg.total_liabilities).format('$0,0[.]00')}</td>
              </tr>
            </tbody>
          </table>
          <h2>News</h2>
          <h2>Grants</h2>
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
        name,
        description,
        id,
        ein,
        stateCorpId,
        funded,
        received,
        start,
        end,
        ntees {
          id,
          name
        }
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
