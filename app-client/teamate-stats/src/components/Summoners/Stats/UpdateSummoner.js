import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Button, Popover } from "antd";
import "./graphs.css";

const ADD_TODO = gql`
  mutation($summonerName: String!, $server: String!) {
    updateSummonerInfo(summonerName: $summonerName, server: $server)
  }
`;

const UpdateSummoner = props => {
  return (
    <Mutation mutation={ADD_TODO}>
      {(updateSummonerInfo, { data }) => (
        <Popover content={"Maybe take a few minutes"}>
          <Button
            style={{ display: "inline", marginLeft: 25 }}
            icon={"redo"}
            size={"large"}
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
        </Popover>
      )}
    </Mutation>
  );
};

export default UpdateSummoner;
