import React from "react";
import gql from "graphql-tag";
import { Axis, Chart, Geom, Tooltip, Coord } from "bizcharts";
import { Query } from "react-apollo";
import ReactLoading from "react-loading";
import "./graphs.css";

const GET_RADAR_sTATS = gql`
  query($userId: String!, $summonerName: String!, $server: String!) {
    getRadarStats(
      userId: $userId
      summonerName: $summonerName
      server: $server
    ) {
      type
      value
    }
  }
`;

const RadarStats = props => {
  return (
    <Query
      query={GET_RADAR_sTATS}
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
          <Chart height={500} data={data.getRadarStats} forceFit>
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
