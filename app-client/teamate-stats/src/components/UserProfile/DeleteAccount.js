import React, { Component } from "react";
import { Button, Popconfirm, notification } from "antd";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const DELETE_USER = gql`
  mutation($token: String!) {
    deleteUserInfo(token: $token)
  }
`;
const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg
  });
};

class DeleteAccount extends Component {
  render() {
    return (
      <Mutation mutation={DELETE_USER}>
        {(deleteUserInfo, { data }) => (
          <div>
            <p style={{ marginLeft: 0, marginBottom: 10 }}>
              Delete your account and all of current linked accounts
            </p>
            <Popconfirm
              title="Are you sure delete your account?"
              onConfirm={e => {
                deleteUserInfo({
                  variables: { token: localStorage.getItem("AUTH_TOKEN") }
                })
                  .then(d => {
                    console.log(d.data.deleteUserInfo);
                    if (d.data.deleteUserInfo) {
                      localStorage.removeItem("AUTH_TOKEN");
                      openNotificationWithIcon(
                        "success",
                        "Success",
                        "Your account deleted successful"
                      );
                      this.props.history.push("/");
                    } else {
                      openNotificationWithIcon(
                        "warning",
                        "Error",
                        "Your account has not deleted"
                      );
                    }
                  })
                  .catch(err => {
                    openNotificationWithIcon(
                      "error",
                      "Error",
                      "Please try again later!"
                    );
                    console.log(err);
                  });
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger">Delete</Button>
            </Popconfirm>
          </div>
        )}
      </Mutation>
    );
  }
}
export default DeleteAccount;
