import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Chart, Geom, Axis, Tooltip } from "bizcharts";
import ReactLoading from "react-loading";
import "./graphs.css";
import { Alert } from "antd";

const GET_KDA = gql`
  query($userId: String!, $summonerName: String!, $server: String!) {
    getKDAPerGame(
      userId: $userId
      summonerName: $summonerName
      server: $server
    ) {
      kda
      gameCounter
    }
  }
`;
const scale = {
  kda: { min: 0, alias: "KDA per Game" },
  gameCounter: { alias: "Number of Game" }
};
const KDA = props => {
  return (
    <Query
      query={GET_KDA}
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
              height={100}
              width={100}
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
          <Chart height={400} data={data.getKDAPerGame} scale={scale} forceFit>
            <Axis name="gameCounter" title />
            <Axis name="kda" title />
            <Tooltip crosshairs={{ type: "y" }} />
            <Geom type="line" position="gameCounter*kda" size={2} />
          </Chart>
        );
      }}
    </Query>
  );
};

export default KDA;
