import React, { Component } from "react";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Select,
  Button,
  notification,
  Checkbox,
  Divider
} from "antd";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import lang from "../../languages-v2";

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const ADD_USER = gql`
  mutation(
    $email: String
    $languages: [String]
    $password: String
    $roles: [String]
  ) {
    signup(
      email: $email
      languages: $languages
      password: $password
      roles: $roles
    )
  }
`;
const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg
  });
};
const roles = [
  { name: "bottom", path: require("../../images/role-icons/Bottom_icon.png") },
  {
    name: "support",
    path: require("../../images/role-icons/Support_icon.png")
  },
  { name: "middle", path: require("../../images/role-icons/Middle_icon.png") },
  { name: "jungle", path: require("../../images/role-icons/Jungle_icon.png") },
  { name: "top", path: require("../../images/role-icons/Top_icon.png") },
  {
    name: "specialist",
    path: require("../../images/role-icons/Specialist_icon.png")
  }
];

class SignUp extends Component {
  state = {
    confirmDirty: false
  };

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
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <Mutation mutation={ADD_USER}>
        {(signup, { data }) => (
          <div>
            <div>
              <div className={"top-svg"}>
                <div className="illo">
                  <img
                    src={require("../../images/wave.svg")}
                    alt="Background"
                  />
                </div>
              </div>
              <div
                className="container"
                style={{ marginTop: "150px", marginBottom: "150px" }}
              >
                <Form
                  layout="vertical"
                  onSubmit={e => {
                    e.preventDefault();
                    this.props.form.validateFieldsAndScroll((err, values) => {
                      if (!err) {
                        signup({
                          variables: {
                            email: values.email,
                            password: values.password,
                            languages: values.languages,
                            roles: values.roles
                          }
                        })
                          .then(res => {
                            if (res.data.signup) {
                              // user created!
                              this.props.history.push("/login");
                              openNotificationWithIcon(
                                "success",
                                "Success",
                                "You are ready!"
                              );
                            } else {
                              openNotificationWithIcon(
                                "warning",
                                "Error",
                                "Email or Summoner already exists!"
                              );
                            }
                          })
                          .catch(rej => {
                            openNotificationWithIcon(
                              "error",
                              "Error",
                              "Please try again later!"
                            );
                          });
                      }
                    });
                  }}
                  style={registerForm}
                >
                  <h1 style={{ textAlign: "center" }}>Sign Up</h1>
                  <Divider />
                  <FormItem {...formItemLayout} label="E-mail">
                    {getFieldDecorator("email", {
                      rules: [
                        {
                          type: "email",
                          message: "The input is not valid E-mail!"
                        },
                        {
                          required: true,
                          message: "Please input your E-mail!"
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
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
                  <FormItem
                    {...formItemLayout}
                    label={
                      <span>
                        Roles&nbsp;
                        <Tooltip title="Which roles can you play?">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator("roles", {
                      rules: [
                        {
                          required: true,
                          message: "Please select role!",
                          type: "array"
                        }
                      ]
                    })(
                      <CheckboxGroup>
                        {roles.map(r => {
                          return [
                            <Checkbox key={r.name} value={r.name}>
                              <img
                                src={r.path}
                                style={{ height: "30px", width: "30px" }}
                                alt={r.name}
                              />
                              {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                            </Checkbox>,
                            <br key={r.name + 1} />
                          ];
                        })}
                      </CheckboxGroup>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <span>
                        Languages&nbsp;
                        <Tooltip title="Which languages you can communicate with?">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator("languages", {
                      rules: [
                        {
                          required: true,
                          message: "Please select language!",
                          type: "array"
                        }
                      ]
                    })(
                      <Select
                        mode="multiple"
                        placeholder="Please select language"
                      >
                        {lang.map(l => {
                          return (
                            <Option key={l.code} value={l.code}>
                              {l.name}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                      Register
                    </Button>
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

const registerForm = {
  maxWidth: "500px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto"
};
const WrappedRegistrationForm = Form.create()(SignUp);
export default WrappedRegistrationForm;
