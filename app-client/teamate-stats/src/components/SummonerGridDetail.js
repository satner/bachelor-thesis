import React from "react";
import { Query } from "react-apollo";
import {Avatar, Card, Icon, Spin} from "antd";
import gql from "graphql-tag";

// TODO: Add skeleton instead of spinner
const { Meta } = Card;
export default () => (
    <Query
        query={gql`
          query {
            getAllUsers {
              summoner
              server
              languages {
                lang
              }
            }
          }
        `}
        errorPolicy="all"
    >
      {({ loading, error, data }) => {
        if (loading) return <Spin size="large" />;
        if (error) return <p>{`Error: ${error}`}</p>;

        return (
            data.getAllUsers.map(u => {
              return <Card
                  hoverable={true}
                  className={'summoner-card'}
                  style={{ width: 300 }}
                  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                  actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
              >
                <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={u.summoner}
                    description={u.server}
                />
              </Card>
            })
        )
      }}
    </Query>
);
