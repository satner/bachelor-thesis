import React from "react";
import gql from "graphql-tag";
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { Query } from "react-apollo";

const GET_DAMAGE_DEALT = gql`
  query($userId: String!) {
    getDamageDealtToChampions(userId: $userId) {
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
    <Query query={GET_DAMAGE_DEALT} variables={{ userId: props.userId }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
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

export default DamageDealtToChampions;
