import React from "react";
import { Query } from "react-apollo";
import {Avatar, Card, Icon, Spin} from "antd";
import gql from "graphql-tag";

// TODO: Add skeleton instead of spinner
const LIMIT = 6;
const { Meta } = Card;
const SummonerGridDetail = (props) => (
    <Query
        query={gql`
          query {
            getAllUsers(skip: ${(props.page - 1) * LIMIT}, limit: ${LIMIT}) {
              summoner
              email
              server
              languages
            }
            getTotalNumberUsers
          }
        `}
        errorPolicy="all"
    >
      {({ loading, error, data }) => {
        if (loading) return <Spin size="large" />;
        if (error) return <p>{`Error: ${error}`}</p>;
        return (
            data.getAllUsers.map((u, i) => {
              return (
                  <Card
                      key={u.summoner + i}
                      hoverable={true}
                      className={'summoner-card'}
                      style={{ width: 300 }}
                      cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                      actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                  >
                      <Meta
                          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                          title={u.summoner}
                          description={u.email}
                      />
                  </Card>

                  )
            })
        )
      }}
    </Query>
);
export default SummonerGridDetail