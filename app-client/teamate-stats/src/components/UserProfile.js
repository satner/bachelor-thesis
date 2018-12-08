import React, {Component} from 'react';
import { Layout, Tabs } from 'antd';

const {Footer, Sider, Content} = Layout;
const TabPane = Tabs.TabPane;

const BasicSettings = () => {

}

class UserProfile extends Component {
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
                  <TabPane tab="Basic Settings" key="1">Content of tab 1</TabPane>
                  <TabPane tab="Account Settings" key="2">Content of tab 2</TabPane>
                  <TabPane tab="Delete Account" key="3">Content of tab 3</TabPane>
                </Tabs>
              </Content>
            </Layout>
            <Footer style={{backgroundColor: '#fff'}}>
            </Footer>
          </Layout>
        </div>
    );
  }
}

export default UserProfile;
