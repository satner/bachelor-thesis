import React from "react";
import {Query} from "react-apollo";
import {Avatar, Card, Icon, Skeleton} from "antd";
import gql from "graphql-tag";

const { Meta } = Card;
const SummonerCard = () => (
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
        if (loading) return <Skeleton avatar active paragraph={{ rows: 4 , width: '200px'}} />;

        return (
            <Card
                hoverable={true}
                className={'summoner-card'}
                style={{ width: 300 }}
                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
            >
              <Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={data.getAllUsers[0].summoner}
                  description="This is the description"
              />
            </Card>
        );
      }}
    </Query>
);

export default SummonerCard