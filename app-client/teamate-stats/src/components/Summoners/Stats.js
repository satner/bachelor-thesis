import React, { Component } from "react";
import { Layout } from "antd";
import VisionScore from "./Stats/VisionScore";
import KDA from "./Stats/KDA";
import AvgStats from "./Stats/AvgStats";
import Kills from "./Stats/Kills";
import DamageDealtToChampions from "./Stats/DamageDealtToChampions";
import CreepsPerMinDeltas from "./Stats/CreepsPerMinDeltas";
import XpPerMinDeltas from "./Stats/XpPerMinDeltas";
import GoldPerMinDeltas from "./Stats/GoldPerMinDeltas";
import CalendarTimeline from "./Stats/CalendarTimeline";

const { Content } = Layout;

class Stats extends Component {
  render() {
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
            <AvgStats userId={this.props.location.state.userId} />
            <Kills userId={this.props.location.state.userId} />
            <DamageDealtToChampions userId={this.props.location.state.userId} />
            <CreepsPerMinDeltas userId={this.props.location.state.userId} />
            <XpPerMinDeltas userId={this.props.location.state.userId} />
            <GoldPerMinDeltas userId={this.props.location.state.userId} />
            <CalendarTimeline userId={this.props.location.state.userId} />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default Stats;
