import React from "react";
import gql from "graphql-tag";
import { Axis, Chart, Geom, Coord, Tooltip } from "bizcharts";
import { Query } from "react-apollo";

const GET_KILLS = gql`
  query($userId: String!) {
    getKillsStats(userId: $userId) {
      killType
      value
    }
  }
`;

const Kills = props => {
  return (
    <Query query={GET_KILLS} variables={{ userId: props.userId }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
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
