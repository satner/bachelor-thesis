import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import LiquidGraph from "./AvgStats/LiquidGraph";
import ReactLoading from "react-loading";
import { Alert } from "antd";
import "./graphs.css";

const GET_AVG_STATS = gql`
  query($userId: String!, $summonerName: String!, $server: String!) {
    getAvgStats(userId: $userId, summonerName: $summonerName, server: $server) {
      winRatio
      goldAvg
      damageAvg
    }
  }
`;

const AvgStats = props => {
  return (
    <Query
      query={GET_AVG_STATS}
      variables={{
        userId: props.userId,
        summonerName: props.summonerName,
        server: props.server
      }}
    >
      {({ loading, error, data }) => {
        if (loading)
          return (
            <ReactLoading
              type={"bubbles"}
              color={"#0a253e"}
              height={"10%"}
              width={"20%"}
              className="loader-graph"
            />
          );
        if (error)
          return (
            <Alert
              message=" An Error Occurred"
              description="Please refresh the page"
              type="error"
            />
          );

        return (
          <div id="liquid-graph">
            <div>
              <h3 style={{ textAlign: "center" }}>Win Ratio</h3>
              <LiquidGraph value={data.getAvgStats.winRatio} />
            </div>
            <div>
              <h3 style={{ textAlign: "center" }}>Average Gold</h3>
              <LiquidGraph value={data.getAvgStats.goldAvg} />
            </div>
            <div>
              <h3 style={{ textAlign: "center" }}>Average Damage</h3>
              <LiquidGraph value={data.getAvgStats.damageAvg} />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default AvgStats;
