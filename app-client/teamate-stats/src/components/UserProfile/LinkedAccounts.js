import React, {Component} from 'react';
import {notification, List, Button, Skeleton, BackTop, Icon, Modal, Form, Input, Tooltip, Select} from 'antd';
import gql from "graphql-tag";
import {Mutation, Query} from "react-apollo";

const ADD_SUMMONER = gql`
  mutation ($id: String!, $summoner: String!, $server: String!) {
    addSummoner(id: $id, summoner: $summoner, server: $server)
  }
`;
const DELETE_SUMMONER = gql`
  mutation ($id: String!, $summoner: String!, $server: String!){
    deleteSummoner(id: $id, summoner: $summoner, server: $server)
  }
`;
const GET_SUMMONERS = gql`
  query ($id: String!){
    getUserInfos(id: $id) {
      _id
      summoner {
        name
        server
      }
    }
  }
`;
const servers = [
  {shortName: 'na', name: 'North America'},
  {shortName: 'kr', name: 'Republic of korea'},
  {shortName: 'ru', name: 'Russia'},
  {shortName: 'br1', name: 'Brazil'},
  {shortName: 'eun1', name: 'Europe Nordic and East'},
  {shortName: 'euw1', name: 'Europe West'},
  {shortName: 'jp1', name: 'Japan'},
  {shortName: 'la1', name: 'Latin America North'},
  {shortName: 'la2', name: 'Latin America South'},
  {shortName: 'oc1', name: 'Ocean'},
  {shortName: 'tr1', name: 'Turkey'},
];

const DeleteSummoner = (props) => (
    <Mutation mutation={DELETE_SUMMONER}>
      {(deleteSummoner, {data}) => (
          <Button shape="circle" icon="delete" value={props.id + " " + props.item.name + " " + props.item.server}
                  onClick={e => {
                    let temp = e.target.value.split(' ');
                    deleteSummoner({variables: {id: temp[0], summoner: temp[1], server: temp[2]}})
                        .then(res => {
                          if (res.data.deleteSummoner) {
                            openNotificationWithIcon('success', 'Success', 'Summoner Account Deleted!')
                          } else {
                            openNotificationWithIcon('warning', 'Error', 'Summoner Account has not Deleted!')
                          }
                        })
                        .catch(rej => {
                          openNotificationWithIcon('error', 'Error', 'Please try again later!')
                        })
                  }}/>
      )}
    </Mutation>
);


const SummonerAccounts = (props) => (
    <Query query={GET_SUMMONERS} variables={{id: props.data}}>
      {({loading, error, data}) => {
        if (loading) return <Skeleton paragraph={{rows: 2}} active/>;
        if (error) return `Error! ${error.message}`;
        return (
            <List
                itemLayout="horizontal"
                dataSource={data.getUserInfos.summoner}
                renderItem={item => (
                    <List.Item actions={[<DeleteSummoner item={item} id={data.getUserInfos._id}/>]}>
                      <List.Item.Meta
                          title={item.name.toUpperCase()}
                          description={props.serverNameFunc(item.server)}
                      />
                    </List.Item>
                )}
            />
        );
      }}
    </Query>
);
const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg,
  });
};
const FormItem = Form.Item;
const Option = Select.Option;

class LinkedAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {...props, visible: false}
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  unfoldServerName = (server) => {
    let res =servers.filter(s => s.shortName === server)
    return res[0].name
  };

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
        <Mutation mutation={ADD_SUMMONER}>
          {(addSummoner, {data}) => (
              <div>
                <SummonerAccounts data={this.state.data.id} serverNameFunc={this.unfoldServerName}/>
                <Modal
                    title="Add League of Legends Account"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                  <Form layout={'vertical'} onSubmit={e => {
                    e.preventDefault();
                    this.props.form.validateFieldsAndScroll((err, values) => {
                      if (!err) {
                        addSummoner({
                          variables: {
                            id: this.state.data.id,
                            summoner: values.summoner,
                            server: values.server
                          }
                        })
                            .then(d => {
                              if (d.data.addSummoner) {
                                openNotificationWithIcon('success', 'Success', 'Maybe take a few minutes');
                                this.handleCancel()

                              } else {
                                openNotificationWithIcon('warning', 'Error', 'Summoner doe not exists!')
                              }
                            })
                            .catch(rej => {
                              openNotificationWithIcon('error', 'Error', 'Please try again later!')
                            })
                      }
                    });
                  }}>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
              Summoner Name&nbsp;
                              <Tooltip title="What is you league of legends summoner name?">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
                        )}
                    >
                      {getFieldDecorator('summoner', {
                        rules: [{required: true, message: 'Please input your summoner name!', whitespace: true}],
                      })(
                          <Input/>
                      )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
              Server&nbsp;
                              <Tooltip title="Which server is the account?">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
                        )}
                    >
                      {getFieldDecorator('server', {
                        rules: [{required: true, message: 'Please select server game!', whitespace: true}],
                      })(
                          <Select
                              placeholder="Please select server"
                          >
                            {
                              servers.map(s => {
                                return <Option key={s.shortName} value={s.shortName}>{s.name}</Option>
                              })
                            }
                          </Select>
                      )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                      <Button type="primary" htmlType="submit">Add Account</Button>
                    </FormItem>
                  </Form>
                </Modal>
                <BackTop visibilityHeight={-100} onClick={this.showModal}>
                  <div style={addButton}><Icon type="user-add"/></div>
                </BackTop>
              </div>

          )}
        </Mutation>
    )
  }
}

const addButton = {
  height: '40px',
  width: '40px',
  lineHeight: '40px',
  borderRadius: '25px',
  textAlign: 'center'
};
const WrappedAddSummonerForm = Form.create()(LinkedAccounts);
export default WrappedAddSummonerForm