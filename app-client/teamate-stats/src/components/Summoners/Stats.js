import React, { Component } from "react";
import { Layout, Collapse, Icon } from "antd";
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
import Link from "react-router-dom/es/Link";

const { Content } = Layout;
const Panel = Collapse.Panel;

class Stats extends Component {
  render() {
    let collapse;
    let userId = this.props.location.state.userId;
    let summonerName = this.props.location.state.summonerName;
    let server = this.props.location.state.server;
    let otherSummonerAccounts = this.props.location.state
      .restSummonersOfAccount;

    /*if (otherSummonerAccounts) {
        collapse = (
            <Collapse defaultActiveKey={["1"]}>
              {otherSummonerAccounts.map((data, index) => {
                return (
                    <Panel header={`${index + 1} summoner account`} key={index}>
                      <Link
                          to={{
                            pathname: "/stats",
                            state: {
                              userId
                            }
                          }}
                      >
                        <Icon type="ellipsis" />
                      </Link>
                    </Panel>
                );
              })}
            </Collapse>
        );
    }*/
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
            {/*{collapse}*/}
            <VisionScore
              userId={userId}
              summonerName={summonerName}
              server={server}
            />
            <KDA userId={userId} summonerName={summonerName} server={server} />
            <AvgStats
              userId={userId}
              summonerName={summonerName}
              server={server}
            />
            <Kills
              userId={userId}
              summonerName={summonerName}
              server={server}
            />
            <DamageDealtToChampions
              userId={userId}
              summonerName={summonerName}
              server={server}
            />
            <CreepsPerMinDeltas
              userId={userId}
              summonerName={summonerName}
              server={server}
            />
            <XpPerMinDeltas
              userId={userId}
              summonerName={summonerName}
              server={server}
            />
            <GoldPerMinDeltas
              userId={userId}
              summonerName={summonerName}
              server={server}
            />
            <CalendarTimeline
              userId={userId}
              summonerName={summonerName}
              server={server}
            />
            <RadarStats
              userId={userId}
              summonerName={summonerName}
              server={server}
            />
            <MostPlayedChampions
              userId={userId}
              summonerName={summonerName}
              server={server}
            />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default Stats;
