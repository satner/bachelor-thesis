import React, { Component } from "react";
import { Form, Icon, Input, Button, Layout, notification, Divider } from "antd";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const { Content } = Layout;
const FormItem = Form.Item;
const LOG_IN = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;
const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg
  });
};
// TODO: refactor styles
class LogIn extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Mutation mutation={LOG_IN}>
        {(login, { data }) => (
          <div>
            <div className={"top-svg"}>
              <div className="illo">
                <img src={require("../../images/wave.svg")} alt="Background" />
              </div>
            </div>
            <Layout style={{ marginTop: "150px" }}>
              <Content style={{ backgroundColor: "white" }}>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    this.props.form.validateFields((err, values) => {
                      if (!err) {
                        login({
                          variables: {
                            email: values.email,
                            password: values.password
                          }
                        })
                          .then(res => {
                            if (res.data.login) {
                              localStorage.setItem(
                                "AUTH_TOKEN",
                                res.data.login
                              );
                              this.props.history.push("/");
                            } else {
                              openNotificationWithIcon(
                                "warning",
                                "Error",
                                "Check your credentials"
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
                  style={loginForm}
                >
                  <h1 style={{ textAlign: "center" }}>Log In</h1>
                  <Divider />
                  <FormItem>
                    {getFieldDecorator("email", {
                      rules: [
                        { required: true, message: "Please input your email!" }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="user"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        placeholder="Email"
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your Password!"
                        }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        type="password"
                        placeholder="Password"
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={loginFormButton}
                    >
                      Log in
                    </Button>
                    <a style={loginFormForgot} href="/forgot-password">
                      Forgot password?
                    </a>{" "}
                    Or <a href="/signup">register now!</a>
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

const WrappedNormalLoginForm = Form.create()(LogIn);

const loginForm = {
  maxWidth: "300px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto"
};

const loginFormForgot = {
  float: "right"
};

const loginFormButton = {
  width: "100%"
};

export default WrappedNormalLoginForm;
