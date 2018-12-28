import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Form, Button, Input, Layout, notification, Divider } from "antd";
import queryString from "query-string";

const FormItem = Form.Item;
const { Content } = Layout;
const RESET_PASSWORD = gql`
  mutation($password: String!, $token: String!) {
    resetPassword(password: $password, token: $token)
  }
`;

const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg
  });
};

class ResetPassword extends Component {
  state = {
    confirmDirty: false,
    token: ""
  };

  componentDidMount() {
    const value = queryString.parse(this.props.location.search);
    this.setState({
      token: value.token
    });
  }

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = null;
    const buttonItemLayout = null;

    return (
      <Mutation mutation={RESET_PASSWORD}>
        {(resetPassword, { data }) => (
          <div>
            <div
              className="illo"
              style={{
                position: "absolute",
                top: "0",
                zIndex: "-1",
                width: "100%"
              }}
            >
              <img src={require("../../images/wave.svg")} alt="Background" />
            </div>
            <Layout style={{ marginTop: "150px" }}>
              <Content style={{ backgroundColor: "white" }}>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    this.props.form.validateFields((err, values) => {
                      if (!err) {
                        resetPassword({
                          variables: {
                            password: values.password,
                            token: this.state.token
                          }
                        })
                          .then(res => {
                            if (res.data.resetPassword) {
                              this.props.history.push("/login");
                              openNotificationWithIcon(
                                "success",
                                "Success",
                                "Password Updated!"
                              );
                            } else {
                              openNotificationWithIcon(
                                "warning",
                                "Error",
                                "Link has expire. Try again"
                              );
                            }
                          })
                          .catch(err => {
                            openNotificationWithIcon(
                              "error",
                              "Error",
                              "Please try again later!"
                            );
                          });
                      }
                    });
                  }}
                  style={resetForm}
                >
                  <h1 style={{ textAlign: "center" }}>Reset Password</h1>
                  <Divider />
                  <FormItem {...formItemLayout} label="Password">
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your password!"
                        },
                        {
                          validator: this.validateToNextPassword
                        }
                      ]
                    })(<Input type="password" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Confirm Password">
                    {getFieldDecorator("confirm", {
                      rules: [
                        {
                          required: true,
                          message: "Please confirm your password!"
                        },
                        {
                          validator: this.compareToFirstPassword
                        }
                      ]
                    })(
                      <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                  </FormItem>
                  <FormItem {...buttonItemLayout}>
                    <Button type="primary" htmlType="submit">
                      Save Password
                    </Button>
                  </FormItem>
                </Form>
              </Content>
            </Layout>
          </div>
        )}
      </Mutation>
    );
  }
}
const resetForm = {
  maxWidth: "300px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto"
};
const WrappedForgotPasswordForm = Form.create()(ResetPassword);

export default WrappedForgotPasswordForm;
