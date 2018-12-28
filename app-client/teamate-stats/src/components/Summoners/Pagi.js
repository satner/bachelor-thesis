import React from "react";
import { Pagination } from "antd";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const PAGINATION_NUMBER = gql`
  query(
    $tier: [String]
    $roles: [String]
    $server: String
    $languages: [String]
    $winRatio: Int
    $avgDamage: Int
    $avgGold: Int
    $champions: [String]
  ) {
    getPaginationNumber(
      tier: $tier
      roles: $roles
      server: $server
      languages: $languages
      winRatio: $winRatio
      avgDamage: $avgDamage
      avgGold: $avgGold
      champions: $champions
    )
  }
`;

const Pagi = props => (
  <Query
    query={PAGINATION_NUMBER}
    variables={{
      tier: props.data.tier,
      roles: props.data.roles,
      server: props.data.server,
      languages: props.data.languages,
      winRatio: props.data.winRatio,
      avgDamage: props.data.avgDamage,
      avgGold: props.data.avgGold,
      champions: props.data.champions
    }}
    errorPolicy="all"
  >
    {({ loading, error, data }) => {
      if (error) return <p>{`Error: ${error}`}</p>;
      return data.getPaginationNumber ? (
        <Pagination
          defaultPageSize={6}
          total={data.getPaginationNumber}
          onChange={(page, pageSize) => {
            props.onChange(page, pageSize);
          }}
        />
      ) : null;
    }}
  </Query>
);

export default Pagi;
