import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_USER_SUMMONER_INFO = gql`
  query($userId: String!) {
    getSummonerInfo(userId: $userId) {
      summonerLeagueInfo {
        tier
        rank
        leaguePoints
        wins
        losses
      }
    }
  }
`;

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
            console.log("haHA", data.getSummonerInfo);
            return <p>kappa reality</p>;
          }}
        </Query>
      </div>
    );
  }
}

export default Stats;
