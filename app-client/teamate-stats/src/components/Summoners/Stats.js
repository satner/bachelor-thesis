import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Chart, Axis, Geom, Tooltip } from "bizcharts";

const GET_USER_SUMMONER_INFO = gql`
  query($userId: String!) {
    getVisionScore(userId: $userId) {
      visionScore
      gameCounter
    }
  }
`;
const scale = {
  value: { min: 0 },
  year: { range: [0, 1] }
};
class Stats extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <Query
          query={GET_USER_SUMMONER_INFO}
          variables={{ userId: this.props.location.state.userId }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            return (
              <Chart
                height={400}
                data={data.getVisionScore}
                scale={scale}
                forceFit
              >
                <Axis name="gameCounter" />
                <Axis name="visionScore" />
                <Tooltip crosshairs={{ type: "y" }} />
                <Geom type="area" position="gameCounter*visionScore" size={2} />
                <Geom
                  type="point"
                  position="gameCounter*visionScore"
                  size={4}
                  shape={"circle"}
                  style={{ stroke: "#fff", lineWidth: 1 }}
                />
              </Chart>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Stats;
