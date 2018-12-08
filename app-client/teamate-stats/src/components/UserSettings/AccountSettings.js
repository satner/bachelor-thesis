import React, {Component} from 'react';
import {Form, Input, Button, Tooltip, Icon, Select} from 'antd';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import lang from "../../languages-v2";

const FormItem = Form.Item;
const Option = Select.Option;
const UPDATE_USER = gql`
  mutation ($email: String, $password: String, $languages: [String], $token: String) {
    updateUserInfo(email: $email, password: $password, languages: $languages, token: $token)
  }
`;

class AccountSettings extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
        <Mutation mutation={UPDATE_USER}>
          {(updateUserInfo, { data }) => (
              <Form onSubmit={e => {
                e.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                  if (!err) {
                    updateUserInfo({variables: {email: values.email, password: values.password, languages: values.languages, token: localStorage.getItem('AUTH_TOKEN')}})
                    console.log(values)
                  }
                })
              }} style={updateForm}>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
              E-mail&nbsp;
                          <Tooltip title="Enter your new or your old email address">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
                    )}
                >
                  {getFieldDecorator('email', {
                    rules: [{
                      type: 'email', message: 'The input is not valid E-mail!',
                    }, {
                      required: true, message: 'Please input your E-mail!',
                    }],
                  })(
                      <Input />
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
              Password&nbsp;
                          <Tooltip title="Enter your new or your old password">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
                    )}
                >
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true,message: 'Please input your password!',
                    }, {
                      validator: this.validateToNextPassword,
                    }],
                  })(
                      <Input type="password"/>
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
              Languages&nbsp;
                          <Tooltip title="Which languages you can communicate with?">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
                    )}
                >
                  {getFieldDecorator('languages', {
                    rules: [{ required: true,message: 'Please select language!', type: 'array'}],
                  })(
                      <Select
                          mode="multiple"
                          placeholder="Please select language"
                      >
                        {
                          lang.map(l => {
                            return <Option key={l.code} value={l.code}>{l.name}</Option>
                          })
                        }
                      </Select>
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">Update Information</Button>
                </FormItem>
              </Form>
          )}
        </Mutation>

    );
  }
}

const updateForm = {
  maxWidth: '500px',
  display: 'block',
  marginRight: 'auto',
}
const WrappedUpdateForm = Form.create()(AccountSettings);
export default WrappedUpdateForm;