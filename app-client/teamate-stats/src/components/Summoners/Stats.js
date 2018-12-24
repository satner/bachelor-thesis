import React, { Component } from "react";
import { Layout } from "antd";
import VisionScore from "./Stats/VisionScore";
import KDA from "./Stats/KDA";
import WinRatio from "./Stats/WinRatio";
import Kills from "./Stats/Kills";

const { Footer, Sider, Content } = Layout;

class Stats extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <div
          className="illo"
          style={{
            position: "absolute",
            top: "0",
            zIndex: "-1",
            width: "100%"
          }}
        >
          <img src={require("../../images/wave.svg")} alt="Background" />
        </div>
        <Layout style={{ marginTop: "150px", backgroundColor: "#fff" }}>
          <Content>
            <VisionScore userId={this.props.location.state.userId} />
            <KDA userId={this.props.location.state.userId} />
            <WinRatio userId={this.props.location.state.userId} />
            <Kills userId={this.props.location.state.userId} />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default Stats;
