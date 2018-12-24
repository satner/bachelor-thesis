import React from "react";
import gql from "graphql-tag";
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { Query } from "react-apollo";

const GET_XP_PER_MIN = gql`
  query($userId: String!) {
    getXpPerMinDeltas(userId: $userId) {
      type
      value
      gameCounter
    }
  }
`;
const scale = {
  value: { min: 0 }
};
const XpPerMinDeltas = props => {
  return (
    <Query query={GET_XP_PER_MIN} variables={{ userId: props.userId }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        return (
          <Chart
            height={400}
            data={data.getXpPerMinDeltas}
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

export default XpPerMinDeltas;
