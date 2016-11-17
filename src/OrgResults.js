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
      // Ref https://stackoverflow.com/questions/32157286/rendering-react-components-from-array-of-objects
      const orgName = thisOrg.ledgerOrganizations.map(org =>
        <h1>{org.name}</h1>
      );

      const orgDesc = thisOrg.ledgerOrganizations.map(org => 
        <p>{org.description}</p>
      );

      const grantSummary = thisOrg.ledgerOrganizations.map(org =>
        <p>{'Received '}{numeral(org.received).format('$0,0[.]00')}{' and funded '}{numeral(org.funded).format('$0,0[.]00')}{' since '}{org.start}</p>
      );

      const grantRecord = thisOrg.ledgerGrants.map(grant => 
        <ul>
          <li key={grant.id}>
            {numeral(grant.amount).format('$0,0[.]00')}
            {' from '}{moment(grant.start).format('YYYY')}{' to '}{moment(grant.end).format('YYYY')}
          </li>
        </ul>
      );

      const newsItem = thisOrg.ledgerNewsArticles.map(article =>
        <ul>
          <li key={article.id}>
            {article.desc}
            <a href={article.link}>{' Read more.'}</a>
          </li>
        </ul>
      );

     	return (
        <div>
          {orgName}
          {orgDesc}
          <h2>Financials</h2>
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
          <h2>Grants</h2>
            {grantSummary}
          <h3>Sample grants</h3>
            {grantRecord}
          <h2>News</h2>
            {newsItem}
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
