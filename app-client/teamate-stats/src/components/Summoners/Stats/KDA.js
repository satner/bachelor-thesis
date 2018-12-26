import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Chart, Geom, Axis, Tooltip } from "bizcharts";

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
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        return (
          <Chart height={400} data={data.getKDAPerGame} scale={scale} forceFit>
            <Axis name="gameCounter" title />
            <Axis name="kda" title />
            <Tooltip crosshairs={{ type: "y" }} />
            <Geom type="line" position="gameCounter*kda" size={2} />
            <Geom
              type="point"
              position="gameCounter*kda"
              size={4}
              shape={"circle"}
              style={{ stroke: "#fff", lineWidth: 1 }}
            />
          </Chart>
        );
      }}
    </Query>
  );
};

export default KDA;
