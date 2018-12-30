import React, { Component } from "react";
import { Layout, Tabs } from "antd";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faPastafarianism,
  faLevelUpAlt
} from "@fortawesome/free-solid-svg-icons";
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
import "./Stats/graphs.css";

library.add(faCoins, faPastafarianism, faLevelUpAlt); // Tab icons

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
        <div className={"top-svg"}>
          <div className="illo">
            <img src={require("../../images/wave.svg")} alt="Background" />
          </div>
        </div>
        <Layout style={{ marginTop: "150px", backgroundColor: "#fff" }}>
          <Content>
            <Tabs defaultActiveKey="1" tabPosition={"left"}>
              {summonersOfAccount.map((data, index) => {
                return (
                  <TabPane tab={`Account #${index + 1}`} key={index + 1}>
                    <div className="card card-1">
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
                    </div>

                    <div className="card card-1">
                      <h3>Summoner Activity</h3>
                      <CalendarTimeline
                        userId={userId}
                        summonerName={data.name}
                        server={data.server}
                      />
                    </div>

                    <div id="radar-liquid-graph">
                      <div className="card card-1" style={{ width: "40%" }}>
                        <AvgStats
                          userId={userId}
                          summonerName={data.name}
                          server={data.server}
                        />
                      </div>
                      <div className="card card-1" style={{ width: "60%" }}>
                        <h3>Focus On</h3>
                        <RadarStats
                          userId={userId}
                          summonerName={data.name}
                          server={data.server}
                        />
                      </div>
                    </div>

                    <div className="card card-1">
                      <h3>Vision per Game</h3>
                      <VisionScore
                        userId={userId}
                        summonerName={data.name}
                        server={data.server}
                      />
                    </div>

                    <div className="card card-1">
                      <h3>KDA per Game</h3>
                      <KDA
                        userId={userId}
                        summonerName={data.name}
                        server={data.server}
                      />
                    </div>

                    <div className="card card-1">
                      <h3>Kills Class</h3>
                      <Kills
                        userId={userId}
                        summonerName={data.name}
                        server={data.server}
                      />
                    </div>

                    <div className="card card-1">
                      <h3>Damage per Game</h3>
                      <DamageDealtToChampions
                        userId={userId}
                        summonerName={data.name}
                        server={data.server}
                      />
                    </div>

                    <Tabs defaultActiveKey="1">
                      <TabPane
                        tab={
                          <span>
                            <FontAwesomeIcon icon={faPastafarianism} />
                            <span style={{ paddingLeft: 15 }}>
                              Creeps Per 10 mins
                            </span>
                          </span>
                        }
                        key="1"
                      >
                        <div className="card card-1">
                          <CreepsPerMinDeltas
                            userId={userId}
                            summonerName={data.name}
                            server={data.server}
                          />
                        </div>
                      </TabPane>
                      <TabPane
                        tab={
                          <span>
                            <FontAwesomeIcon icon={faLevelUpAlt} />
                            <span style={{ paddingLeft: 15 }}>
                              XP Per 10 mins
                            </span>
                          </span>
                        }
                        key="2"
                      >
                        <div className="card card-1">
                          <XpPerMinDeltas
                            userId={userId}
                            summonerName={data.name}
                            server={data.server}
                          />
                        </div>
                      </TabPane>
                      <TabPane
                        tab={
                          <span>
                            <FontAwesomeIcon icon={faCoins} />
                            <span style={{ paddingLeft: 15 }}>
                              Gold Per 10 mins
                            </span>
                          </span>
                        }
                        key="3"
                      >
                        <div className="card card-1">
                          <GoldPerMinDeltas
                            userId={userId}
                            summonerName={data.name}
                            server={data.server}
                          />
                        </div>
                      </TabPane>
                    </Tabs>

                    <div className="card card-1">
                      <h3>5 Most Played Champions</h3>
                      <MostPlayedChampions
                        userId={userId}
                        summonerName={data.name}
                        server={data.server}
                      />
                    </div>
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
