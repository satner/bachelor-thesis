import React from 'react';
import { Button, Popconfirm, notification  } from 'antd';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const DELETE_USER = gql`
  mutation ($token: String!) {
    deleteUserInfo(token: $token)
  }
`;
const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg,
  });
};

const DeleteAccount = () => {
    return (
        <Mutation mutation={DELETE_USER}>
          {(deleteUserInfo, { data }) => (
              <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dignissimos distinctio dolorum expedita explicabo fugiat laudantium odit quis reprehenderit similique! Aspernatur beatae, blanditiis dolorem eaque libero natus nesciunt suscipit vel!</p>
                <Popconfirm title="Are you sure delete your account?" onConfirm={e => {
                  deleteUserInfo({variables: {token: localStorage.getItem('AUTH_TOKEN')}})
                      .then(d => {
                        if (d) {
                          localStorage.removeItem('AUTH_TOKEN')
                          openNotificationWithIcon('success', 'Success', 'Your account deleted successful')
                        } else {
                          openNotificationWithIcon('warning', 'Error', 'Your account has not deleted')
                        }
                      })
                      .catch(e => {
                        openNotificationWithIcon('error', 'Error', 'Please try again later')
                      })
                }} okText="Yes" cancelText="No" >
                  <Button type="danger">Delete</Button>
                </Popconfirm>
              </div>

          )}
        </Mutation>
    )
};

export default DeleteAccount
