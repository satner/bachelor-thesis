import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { ResponsiveBar } from "@nivo/bar";
const GET_MOST_PLAYED = gql`
  query($userId: String!) {
    getFiveMostPlayedChampions(userId: $userId) {
      name
      wins
      winsColor
      losses
      lossesColor
    }
  }
`;

const MostPlayedChampions = props => {
  return (
    <Query query={GET_MOST_PLAYED} variables={{ userId: props.userId }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;

        return (
          <div style={{ height: 600 }}>
            <ResponsiveBar
              width={900}
              height={500}
              margin={{
                top: 60,
                right: 80,
                bottom: 60,
                left: 80
              }}
              data={data.getFiveMostPlayedChampions}
              indexBy="name"
              keys={["wins", "losses"]}
              padding={0.2}
              labelTextColor="inherit:darker(1.4)"
              labelSkipWidth={16}
              labelSkipHeight={16}
              groupMode="grouped"
            />
          </div>
        );
      }}
    </Query>
  );
};

export default MostPlayedChampions;
