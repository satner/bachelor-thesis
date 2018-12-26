import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Button } from "antd";

const ADD_TODO = gql`
  mutation($summonerName: String!, $server: String!) {
    updateSummonerInfo(summonerName: $summonerName, server: $server)
  }
`;

const UpdateSummoner = props => {
  return (
    <Mutation mutation={ADD_TODO}>
      {(updateSummonerInfo, { data }) => (
        <div>
          <Button
            type="primary"
            onClick={e => {
              e.preventDefault();
              updateSummonerInfo({
                variables: {
                  summonerName: props.summonerName,
                  server: props.server
                }
              });
            }}
          >
            Update
          </Button>
        </div>
      )}
    </Mutation>
  );
};

export default UpdateSummoner;
