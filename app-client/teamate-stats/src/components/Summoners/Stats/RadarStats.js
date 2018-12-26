import React from "react";
import gql from "graphql-tag";
import { Axis, Chart, Geom, Tooltip, Coord } from "bizcharts";
import { Query } from "react-apollo";

const GET_RADAR_sTATS = gql`
  query($userId: String!) {
    getRadarStats(userId: $userId) {
      type
      value
    }
  }
`;

const RadarStats = props => {
  return (
    <Query query={GET_RADAR_sTATS} variables={{ userId: props.userId }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        return (
          <Chart
            height={500}
            data={data.getRadarStats}
            padding={[20, 20, 95, 20]}
            forceFit
          >
            <Coord type="polar" radius={0.8} />
            <Axis
              name="type"
              line={null}
              tickLine={null}
              grid={{
                lineStyle: {
                  lineDash: null
                },
                hideFirstLine: false
              }}
            />
            <Tooltip />
            <Axis
              name="value"
              line={null}
              tickLine={null}
              grid={{
                type: "polygon",
                lineStyle: {
                  lineDash: null
                },
                alternateColor: "rgba(0, 0, 0, 0.04)"
              }}
            />
            <Geom type="line" position="type*value" size={2} />
            <Geom
              type="point"
              position="type*value"
              shape="circle"
              size={4}
              style={{ stroke: "#fff", lineWidth: 1, fillOpacity: 1 }}
            />
          </Chart>
        );
      }}
    </Query>
  );
};

export default RadarStats;
