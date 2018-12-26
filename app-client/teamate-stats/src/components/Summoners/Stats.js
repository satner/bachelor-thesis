import React, { Component } from "react";
import { Layout, Tabs } from "antd";
import VisionScore from "./Stats/VisionScore";
import KDA from "./Stats/KDA";
import AvgStats from "./Stats/AvgStats";
import Kills from "./Stats/Kills";
import DamageDealtToChampions from "./Stats/DamageDealtToChampions";
import CreepsPerMinDeltas from "./Stats/CreepsPerMinDeltas";
import XpPerMinDeltas from "./Stats/XpPerMinDeltas";
import GoldPerMinDeltas from "./Stats/GoldPerMinDeltas";
import CalendarTimeline from "./Stats/CalendarTimeline";
import RadarStats from "./Stats/RadarStats";
import MostPlayedChampions from "./Stats/MostPlayedChampions";

const { Content } = Layout;
const TabPane = Tabs.TabPane;

class Stats extends Component {
  render() {
    let userId = this.props.location.state.userId;
    let summonerName = this.props.location.state.summonerName;
    let server = this.props.location.state.server;
    let summonersOfAccount = this.props.location.state.summonersOfAccount;
    console.log(summonersOfAccount);

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
            <Tabs defaultActiveKey="1" tabPosition={"left"}>
              {summonersOfAccount.map((data, index) => {
                return (
                  <TabPane tab={`Account #${index + 1}`} key={index + 1}>
                    <VisionScore
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                    <KDA
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                    <AvgStats
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                    <Kills
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                    <DamageDealtToChampions
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                    <CreepsPerMinDeltas
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                    <XpPerMinDeltas
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                    <GoldPerMinDeltas
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                    <CalendarTimeline
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                    <RadarStats
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                    <MostPlayedChampions
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
                  </TabPane>
                );
              })}
            </Tabs>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default Stats;
