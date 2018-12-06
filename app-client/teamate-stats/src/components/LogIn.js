import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;
// TODO: refactor styles
// TODO: forgot password
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
            <div className="container" style={{marginTop: '150px', marginBottom: '150px',  background: 'linear-gradient(153deg, rgba(10,37,62,1) 0%, rgba(22,56,71,1) 35%, rgba(50,100,93,1) 100%)'}}>
                <Form onSubmit={this.handleSubmit} style={loginForm}>
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
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