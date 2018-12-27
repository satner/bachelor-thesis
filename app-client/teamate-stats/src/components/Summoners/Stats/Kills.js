import React from "react";
import gql from "graphql-tag";
import { Axis, Chart, Geom, Coord, Tooltip } from "bizcharts";
import { Query } from "react-apollo";
import ReactLoading from "react-loading";
import "./graphs.css";
import { Alert } from "antd";

const GET_KILLS = gql`
  query($userId: String!, $summonerName: String!, $server: String!) {
    getKillsStats(
      userId: $userId
      summonerName: $summonerName
      server: $server
    ) {
      killType
      value
    }
  }
`;

const Kills = props => {
  return (
    <Query
      query={GET_KILLS}
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
          <Chart height={400} data={data.getKillsStats} forceFit>
            <Coord transpose />
            <Axis name="killType" label={{ offset: 12 }} />
            <Axis name="value" />
            <Tooltip />
            <Geom type="interval" position="killType*value" />
          </Chart>
        );
      }}
    </Query>
  );
};

export default Kills;
