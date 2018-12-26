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
import UpdateSummoner from "./Stats/UpdateSummoner";

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const servers = [
  { shortName: "na", name: "North America" },
  { shortName: "kr", name: "Republic of korea" },
  { shortName: "ru", name: "Russia" },
  { shortName: "br1", name: "Brazil" },
  { shortName: "eun1", name: "Europe Nordic and East" },
  { shortName: "euw1", name: "Europe West" },
  { shortName: "jp1", name: "Japan" },
  { shortName: "la1", name: "Latin America North" },
  { shortName: "la2", name: "Latin America South" },
  { shortName: "oc1", name: "Ocean" },
  { shortName: "tr1", name: "Turkey" }
];

class Stats extends Component {
  unfoldServerName = server => {
    let res = servers.filter(s => s.shortName === server);
    return res[0].name;
  };
  render() {
    let userId = this.props.location.state.userId;
    let summonersOfAccount = this.props.location.state.summonersOfAccount;

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
                    <h1>
                      {data.name}{" "}
                      <span>
                        <UpdateSummoner
                          summonerName={data.name}
                          server={data.server}
                        />
                      </span>
                    </h1>
                    <h3>{this.unfoldServerName(data.server)}</h3>
                    <h3>{data.tier}</h3>

                    <CalendarTimeline
                      userId={userId}
                      summonerName={data.name}
                      server={data.server}
                    />
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
