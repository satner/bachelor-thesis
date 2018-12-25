import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import LiquidGraph from "./AvgStats/LiquidGraph";

const GET_AVG_STATS = gql`
  query($userId: String!) {
    getAvgStats(userId: $userId) {
      winRatio
      goldAvg
      damageAvg
    }
  }
`;

const AvgStats = props => {
  return (
    <Query query={GET_AVG_STATS} variables={{ userId: props.userId }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;

        return (
          <div>
            <LiquidGraph value={data.getAvgStats.winRatio} />
            <LiquidGraph value={data.getAvgStats.goldAvg} />
            <LiquidGraph value={data.getAvgStats.damageAvg} />
          </div>
        );
      }}
    </Query>
  );
};

export default AvgStats;
