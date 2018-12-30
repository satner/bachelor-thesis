import React, { Component } from "react";
import { Divider, Form, Layout, Tabs } from "antd";
import jwt from "jsonwebtoken";
import AccountSettings from "./UserProfile/AccountSettings";
import DeleteAccount from "./UserProfile/DeleteAccount";
import LinkedAccounts from "./UserProfile/LinkedAccounts";

const { Footer, Content } = Layout;
const TabPane = Tabs.TabPane;

class UserProfile extends Component {
  constructor(props) {
    super(props);
    let token = localStorage.getItem("AUTH_TOKEN");
    let userData = jwt.decode(token);
    this.state = { ...userData, shouldUpdate: false };
  }

  render() {
    return (
      <div>
        <div className={"top-svg"}>
          <div className="illo">
            <img src={require("../images/wave.svg")} alt="Background" />
          </div>
        </div>

        <Layout style={summonerProfileStyle}>
          <Layout>
            <Content style={{ backgroundColor: "#fff" }}>
              <h1 style={{ textAlign: "center" }}>Account Configurations</h1>
              <Divider />
              <Tabs
                defaultActiveKey="1"
                tabPosition={"left"}
                style={{ height: 570 }}
              >
                <TabPane tab="Account Settings" key="1">
                  {" "}
                  <AccountSettings data={this.state} />
                </TabPane>
                <TabPane tab="Linked Accounts" key="2">
                  {" "}
                  <LinkedAccounts data={this.state} />
                </TabPane>
                <TabPane tab="Delete Account" key="3">
                  <DeleteAccount {...this.props} />
                </TabPane>
              </Tabs>
            </Content>
          </Layout>
          <Footer style={{ backgroundColor: "#fff" }} />
        </Layout>
      </div>
    );
  }
}

const summonerProfileStyle = {
  marginTop: "170px",
  maxWidth: "700px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto"
};

export default UserProfile;
