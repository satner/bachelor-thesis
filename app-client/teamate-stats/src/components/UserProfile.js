import React, {Component} from 'react';
import { Layout, Tabs } from 'antd';
import jwt from 'jsonwebtoken';
import AccountSettings from './UserSettings/AccountSettings';
import DeleteAccount from "./UserSettings/DeleteAccount";
import LinkedAccounts from "./UserSettings/LinkedAccounts";

const {Footer, Sider, Content} = Layout;
const TabPane = Tabs.TabPane;

class UserProfile extends Component {
  constructor(props) {
    super(props);
    let token = localStorage.getItem('AUTH_TOKEN');
    let userData = jwt.decode(token);
    this.state =  {...userData}
  }
  render() {
    return (
        <div>
          <div className="illo" style={{position: 'absolute', top: '0', zIndex: '-1', width: '100%'}}>
            <img src={require('../images/wave.svg')} alt='Background'/>
          </div>
          <Layout style={{marginTop: '150px'}}>
            <Layout>
              <Sider style={{backgroundColor: '#fff'}}>
              </Sider>
              <Content style={{backgroundColor: '#fff'}}>
                <Tabs
                    defaultActiveKey="1"
                    tabPosition={'left'}
                    style={{ height: 220 }}
                >
                  <TabPane tab="Account Settings" key="1"> <AccountSettings data={this.state}/></TabPane>
                  <TabPane tab="Linked Accounts" key="2"> <LinkedAccounts data={this.state}/></TabPane>
                  <TabPane tab="Delete Account" key="3"><DeleteAccount {...this.props}/></TabPane>
                </Tabs>
              </Content>
              <Sider style={{backgroundColor: '#fff'}}>
              </Sider>
            </Layout>
            <Footer style={{backgroundColor: '#fff'}}>
            </Footer>
          </Layout>
        </div>
    );
  }
}

export default UserProfile;
