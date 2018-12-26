import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { ResponsiveBar } from "@nivo/bar";
import ReactLoading from "react-loading";
import "./graphs.css";

const GET_MOST_PLAYED = gql`
  query($userId: String!, $summonerName: String!, $server: String!) {
    getFiveMostPlayedChampions(
      userId: $userId
      summonerName: $summonerName
      server: $server
    ) {
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
    <Query
      query={GET_MOST_PLAYED}
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
          <div style={{ height: 600 }}>
            <ResponsiveBar
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
