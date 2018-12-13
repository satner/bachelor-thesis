import React from "react";
import {Query} from "react-apollo";
import {Avatar, Card, Icon, Spin} from "antd";
import gql from "graphql-tag";

// TODO: Add skeleton instead of spinner
const LIMIT = 6;
const {Meta} = Card;
const PAGINATION_USERS = gql`
          query ($limit: Int, $skip: Int, $tier: String, $roles: [String], $server: String, $languages: [String]){
            getPaginationUsers(limit: $limit, skip: $skip, tier: $tier, roles: $roles, server: $server, languages: $languages) {
                _id
                summoner{
                  name
                  server
                }
                languages
                roles
            }
          }
        `;
const Grid = (props) => (
    <Query
        query={PAGINATION_USERS}
        variables={{
          limit: LIMIT,
          skip: (props.page - 1) * LIMIT,
          tier: props.data.tier,
          roles: props.data.roles,
          server: props.data.server,
          languages: props.data.languages
        }}
        errorPolicy="all"
    >
      {({loading, error, data}) => {
        if (loading) return <Spin size="large"/>;
        if (error) return <p>{`Error: ${error}`}</p>;

        return (
            data.getPaginationUsers.map((u, i) => {
              return (
                  <Card
                      key={'test' + i}
                      hoverable={true}
                      className={'summoner-card'}
                      style={{width: 300}}
                      cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
                      actions={[<Icon type="setting"/>, <Icon type="edit"/>, <Icon type="ellipsis"/>]}
                  >
                    <Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                        title={u.summoner.length > 0 ? u.summoner[0].name : " "}
                        description={u.summoner.length > 0 ? u.summoner[0].server : " "}
                    />
                  </Card>
              )
            })
        )
      }}
    </Query>
);
export default Grid