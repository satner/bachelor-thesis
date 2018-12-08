import React from "react";
import {Pagination} from "antd";
import {Query} from "react-apollo";
import gql from "graphql-tag";


const TotalPages = (props) => (
    <Query
        query={gql`
          query {
            getTotalNumberUsers
          }
        `}
        errorPolicy="all"
    >
      {({ loading, error, data }) => {
        if (error) return <p>{`Error: ${error}`}</p>;
          return <Pagination defaultPageSize={6} total={data.getTotalNumberUsers} onChange={(page, pageSize) => {props.onChange(page, pageSize)} } />
      }}
    </Query>
);

export default TotalPages