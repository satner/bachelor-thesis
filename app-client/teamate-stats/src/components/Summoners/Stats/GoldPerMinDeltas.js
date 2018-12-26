import React from "react";
import gql from "graphql-tag";
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { Query } from "react-apollo";
import ReactLoading from "react-loading";
import "./graphs.css";

const GET_GOLD_PER_MIN = gql`
  query($userId: String!, $summonerName: String!, $server: String!) {
    getGoldPerMinDeltas(
      userId: $userId
      summonerName: $summonerName
      server: $server
    ) {
      type
      value
      gameCounter
    }
  }
`;
const scale = {
  value: { min: 0 }
};
const GoldPerMinDeltas = props => {
  return (
    <Query
      query={GET_GOLD_PER_MIN}
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
        if (error) return `Error! ${error.message}`;
        return (
          <Chart
            height={400}
            data={data.getGoldPerMinDeltas}
            scale={scale}
            forceFit
          >
            <Axis name="gameCounter" />
            <Axis name="value" />
            <Legend />
            <Tooltip crosshairs={{ type: "line" }} />
            <Geom
              type="area"
              position="gameCounter*value"
              color="type"
              size={2}
            />
            <Geom
              type="point"
              position="gameCounter*value"
              size={4}
              shape={"circle"}
              style={{ stroke: "#fff", lineWidth: 1 }}
              color="type"
            />
          </Chart>
        );
      }}
    </Query>
  );
};

export default GoldPerMinDeltas;
