import React from "react";
import { Progress } from "antd";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_WIN_RATIO = gql`
  query($userId: String!) {
    getWinRatio(userId: $userId)
  }
`;

const WinRatio = props => {
  return (
    <Query query={GET_WIN_RATIO} variables={{ userId: props.userId }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        return <Progress type="circle" percent={data.getWinRatio} />;
      }}
    </Query>
  );
};

export default WinRatio;
