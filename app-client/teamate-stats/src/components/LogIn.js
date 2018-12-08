import React, { Component } from 'react';
import {Form, Icon, Input, Button, Checkbox, Layout} from 'antd';

const {Content} = Layout;
const FormItem = Form.Item;
// TODO: refactor styles
// TODO: forgot password
// TODO: check ama einai idi log in o user

class LogIn extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
        <div>
          <div className="illo" style={{position: 'absolute', top: '0', zIndex: '-1', width: '100%'}}>
            <img src={require('../images/wave.svg')} alt='Background'/>
          </div>
          <Layout style={{marginTop: '150px'}}>
            <Content style={{backgroundColor: 'white'}}>
              <Form onSubmit={this.handleSubmit} style={loginForm}>
                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input your email!' }],
                  })(
                      <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                  })(
                      <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(
                      <Checkbox>Remember me</Checkbox>
                  )}
                  <a style={loginFormForgot} href="/">Forgot password</a>
                  <Button type="primary" htmlType="submit" style={loginFormButton}>
                    Log in
                  </Button>
                  Or <a href="/signup">register now!</a>
                </FormItem>
              </Form>
            </Content>
          </Layout>
        </div>

    );
  }
}
const WrappedNormalLoginForm = Form.create()(LogIn);

const loginForm = {
  maxWidth: '300px',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
}

const loginFormForgot = {
  float: 'right'
}

const loginFormButton = {
  width: '100%'
}

export default WrappedNormalLoginForm;