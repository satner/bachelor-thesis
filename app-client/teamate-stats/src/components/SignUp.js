import React, {Component} from 'react';
import { Form, Input, Tooltip, Icon, Select, Button } from 'antd';
import lang from '../languages-v2'

const FormItem = Form.Item;
const Option = Select.Option;

class SignUp extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
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

        let langHTML = []
        lang.forEach(l => {
            langHTML.push(<Option key={l.code}>{l.name}</Option>)
        })
        return (
            <div className="container" style={{marginTop: '150px', marginBottom: '150px'}}>
                <Form onSubmit={this.handleSubmit} style={registerForm}>
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
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Password"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: 'Please input your password!',
                            }, {
                                validator: this.validateToNextPassword,
                            }],
                        })(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Confirm Password"
                    >
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true, message: 'Please confirm your password!',
                            }, {
                                validator: this.compareToFirstPassword,
                            }],
                        })(
                            <Input type="password" onBlur={this.handleConfirmBlur} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
              Summoner Name&nbsp;
                                <Tooltip title="What is you league of legends summoner name?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                        )}
                    >
                        {getFieldDecorator('summoner', {
                            rules: [{ required: true, message: 'Please input your summoner name!', whitespace: true }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
              Server&nbsp;
                                <Tooltip title="Which server is the account?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                        )}
                    >
                        {getFieldDecorator('server', {
                            rules: [{ required: true, message: 'Please select server game!', whitespace: true }],
                        })(
                            <Select
                                placeholder="Please select server"
                            >
                                <Option value='na'>North America</Option>
                                <Option value='kr'>Republic of korea</Option>
                                <Option value='ru'>Russia</Option>
                                <Option value='br1'>Brazil</Option>
                                <Option value='eun1'>Europe Nordic and East</Option>
                                <Option value='euw1'>Europe West</Option>
                                <Option value='jp1'>Japan</Option>
                                <Option value='la1'>Latin America North</Option>
                                <Option value='la2'>Latin America South</Option>
                                <Option value='oc1'>Ocean</Option>
                                <Option value='tr1'>Turkey</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
              Languages&nbsp;
                                <Tooltip title="Which languages you can communicate with?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                        )}
                    >
                        {getFieldDecorator('languages', {
                            rules: [{ required: true, message: 'Please select language!', type: 'array'}],
                        })(
                            <Select
                                mode="multiple"
                                placeholder="Please select language"
                            >
                                {langHTML}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">Register</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
const registerForm = {
    maxWidth: '500px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
}
const WrappedRegistrationForm = Form.create()(SignUp);
export default WrappedRegistrationForm;