import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Tooltip,
  Icon,
  Select,
  notification,
  Checkbox
} from "antd";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import lang from "../../languages-v2";

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const UPDATE_USER = gql`
  mutation(
    $id: String!
    $email: String
    $password: String
    $languages: [String]
    $roles: [String]
  ) {
    updateUserInfo(
      id: $id
      email: $email
      password: $password
      languages: $languages
      roles: $roles
    )
  }
`;
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
const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg
  });
};

class AccountSettings extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
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
      <Mutation mutation={UPDATE_USER}>
        {(updateUserInfo, { data }) => (
          <Form
            layout="vertical"
            onSubmit={e => {
              e.preventDefault();
              this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  updateUserInfo({
                    variables: {
                      email: values.email,
                      password: values.password,
                      languages: values.languages,
                      roles: values.roles,
                      id: this.props.data.id
                    }
                  })
                    .then(d => {
                      if (d.data.updateUserInfo) {
                        openNotificationWithIcon(
                          "success",
                          "Success",
                          "Your account updated successful"
                        );
                      } else {
                        openNotificationWithIcon(
                          "warning",
                          "Error",
                          "Your account has not updated"
                        );
                      }
                    })
                    .catch(e => {
                      openNotificationWithIcon(
                        "error",
                        "Error",
                        "Please try again later"
                      );
                    });
                }
              });
            }}
            style={updateForm}
          >
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  E-mail&nbsp;
                  <Tooltip title="Enter your new e-mail address">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator(
                "email",
                { initialValue: this.props.data.email },
                {
                  rules: [
                    {
                      type: "email",
                      message: "The input is not valid E-mail!"
                    }
                  ]
                }
              )(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Password&nbsp;
                  <Tooltip title="Enter your new password">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator(
                "password",
                { initialValue: "" },
                {
                  rules: [
                    {
                      validator: this.validateToNextPassword
                    }
                  ]
                }
              )(<Input type="password" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Languages&nbsp;
                  <Tooltip title="Enter your new language">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator(
                "languages",
                { initialValue: this.props.data.languages },
                {
                  rules: [{ message: "Please select language!", type: "array" }]
                }
              )(
                <Select mode="multiple" placeholder="Please select language">
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
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Roles&nbsp;
                  <Tooltip title="Enter your new role">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator(
                "roles",
                { initialValue: this.props.data.roles },
                {
                  rules: [{ message: "Please select role!", type: "array" }]
                }
              )(
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
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Update Information
              </Button>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

const updateForm = {
  maxWidth: "500px",
  display: "block",
  marginRight: "auto",
  paddingBottom: "70px"
};
const WrappedUpdateForm = Form.create()(AccountSettings);
export default WrappedUpdateForm;
