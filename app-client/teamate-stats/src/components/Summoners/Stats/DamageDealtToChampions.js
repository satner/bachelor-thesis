import React from "react";
import gql from "graphql-tag";
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { Query } from "react-apollo";
import ReactLoading from "react-loading";
import "./graphs.css";
import { Alert } from "antd";

const GET_DAMAGE_DEALT = gql`
  query($userId: String!, $summonerName: String!, $server: String!) {
    getDamageDealtToChampions(
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

const DamageDealtToChampions = props => {
  return (
    <Query
      query={GET_DAMAGE_DEALT}
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
          <Chart
            height={400}
            data={data.getDamageDealtToChampions}
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
              size={2}
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

export default DamageDealtToChampions;
