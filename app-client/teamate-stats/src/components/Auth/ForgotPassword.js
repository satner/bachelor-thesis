import React from 'react';
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {Form, Button, Input, Layout, notification} from 'antd'

const FormItem = Form.Item;
const {Content} = Layout;
const FORGOT_PASSWORD = gql`
  mutation ($email: String!) {
    forgotPassword(email: $email)
  }
`;

const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg,
  });
};
const ForgotPassword = (props) => {
  const {getFieldDecorator} = props.form;
  const formItemLayout = null;
  const buttonItemLayout = null;

  return (
      <Mutation mutation={FORGOT_PASSWORD}>
        {(forgotPassword, {data}) => (
            <div>
              <div className="illo" style={{position: 'absolute', top: '0', zIndex: '-1', width: '100%'}}>
                <img src={require('../../images/wave.svg')} alt='Background'/>
              </div>
              <Layout style={{marginTop: '150px'}}>
                <Content style={{backgroundColor: 'white'}}>
                  <Form onSubmit={e => {
                    e.preventDefault();
                    props.form.validateFields((err, values) => {
                      if (!err) {
                        forgotPassword({variables: {email: values.email}})
                            .then(res => {
                              if (res.data.forgotPassword) {
                                openNotificationWithIcon('success', 'Success', 'Check your email for reset link')
                              } else {
                                openNotificationWithIcon('warning', 'Error', 'Check your email')
                              }
                            })
                            .catch(err => {
                              openNotificationWithIcon('error', 'Error', 'Please try again later!')
                            })
                      }
                    });
                  }} style={forgotForm}>
                    <FormItem
                        {...formItemLayout}
                        label="E-mail"
                    >
                      {getFieldDecorator('email', {
                        rules: [{
                          type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                          required: true, message: 'Please input your E-mail!',
                        }],
                      })(
                          <Input/>
                      )}
                    </FormItem>
                    <FormItem {...buttonItemLayout}>
                      <Button type="primary" htmlType="submit">Reset Password</Button>
                    </FormItem>
                  </Form>
                </Content>
              </Layout>

            </div>
        )}
      </Mutation>
  );
};
const forgotForm = {
  maxWidth: '300px',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};
const WrappedForgotPasswordForm = Form.create()(ForgotPassword);

export default WrappedForgotPasswordForm;
