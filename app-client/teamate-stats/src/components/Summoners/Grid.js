import React, { Component } from "react";
import { Query } from "react-apollo";
import { Avatar, Card, Icon, Spin, Divider, Tooltip, Alert } from "antd";
import gql from "graphql-tag";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faPercent, faBolt } from "@fortawesome/free-solid-svg-icons";
import lang from "../../languages-v2";
import Link from "react-router-dom/es/Link";

library.add(faCoins, faPercent, faBolt); // Icons

const LIMIT = 6;
const { Meta } = Card;
const PAGINATION_USERS = gql`
  query(
    $limit: Int
    $skip: Int
    $tier: [String]
    $roles: [String]
    $server: String
    $languages: [String]
    $winRatio: Int
    $avgDamage: Int
    $avgGold: Int
    $champions: [String]
  ) {
    getPaginationUsers(
      limit: $limit
      skip: $skip
      tier: $tier
      roles: $roles
      server: $server
      languages: $languages
      winRatio: $winRatio
      avgDamage: $avgDamage
      avgGold: $avgGold
      champions: $champions
    ) {
      _id
      summoner {
        name
        server
        tier
        profileIconId
        summonerLevel
        winRatio
        avgGold
        avgDamage
        mostPlayedChampions {
          name
          championTotalGames
        }
      }
      languages
      roles
      latestPatchNumber
    }
  }
`;
const tiers = [
  {
    name: "PROVISIONAL",
    path: require("../../images/tier-icons/provisional.png")
  },
  { name: "BRONZE", path: require("../../images/tier-icons/bronze.png") },
  { name: "SILVER", path: require("../../images/tier-icons/silver.png") },
  { name: "GOLD", path: require("../../images/tier-icons/gold.png") },
  { name: "PLATINUM", path: require("../../images/tier-icons/platinum.png") },
  { name: "DIAMOND", path: require("../../images/tier-icons/diamond.png") },
  { name: "MASTER", path: require("../../images/tier-icons/master.png") },
  {
    name: "CHALLENGER",
    path: require("../../images/tier-icons/challenger.png")
  }
];
const roles = [
  { name: "bottom", path: require("../../images/role-icons/Bottom_icon.png") },
  {
    name: "support",
    path: require("../../images/role-icons/Support_icon.png")
  },
  { name: "middle", path: require("../../images/role-icons/Middle_icon.png") },
  { name: "jungle", path: require("../../images/role-icons/Jungle_icon.png") },
  { name: "top", path: require("../../images/role-icons/Top_icon.png") },
  {
    name: "specialist",
    path: require("../../images/role-icons/Specialist_icon.png")
  }
];
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
const gridStyleFirstLine = {
  width: "33.3%",
  textAlign: "center"
};

const gridStyleThirdLine = {
  width: "33.3%",
  textAlign: "center",
  minHeight: "220px",
  maxHeight: "220px",
  overflow: "auto"
};

class Grid extends Component {
  unfoldServerName = server => {
    let res = servers.filter(s => s.shortName === server);
    return res[0].name;
  };

  unfoldRoles = roleList => {
    let iconPathRoles = [];
    roleList.forEach(r => {
      iconPathRoles.push(roles.filter(fr => fr.name === r)[0].path);
    });
    return iconPathRoles;
  };

  unfoldTier = tier => {
    let res = tiers.filter(t => t.name === tier);
    return res[0].path;
  };

  unfoldLanguages = codesList => {
    let langNames = [];
    codesList.forEach(l => {
      langNames.push(lang.filter(fl => fl.code === l)[0].name);
    });
    return langNames;
  };

  render() {
    return (
      <Query
        query={PAGINATION_USERS}
        variables={{
          limit: LIMIT,
          skip: (this.props.page - 1) * LIMIT,
          tier: this.props.data.tier,
          roles: this.props.data.roles,
          server: this.props.data.server,
          languages: this.props.data.languages,
          winRatio: this.props.data.winRatio,
          avgDamage: this.props.data.avgDamage,
          avgGold: this.props.data.avgGold,
          champions: this.props.data.champions
        }}
        errorPolicy="all"
      >
        {({ loading, error, data }) => {
          if (loading) return <Spin size="large" />;
          if (error)
            return (
              <Alert
                message=" An Error Occurred"
                description="please refresh the page"
                type="error"
              />
            );
          return data.getPaginationUsers.map((u, i) => {
            return (
              <Card
                key={"test" + i}
                hoverable={true}
                className={"summoner-card"}
                style={{ width: 400 }}
                cover={
                  <Divider>
                    <Avatar
                      size="large"
                      src={`http://ddragon.leagueoflegends.com/cdn/${
                        u.latestPatchNumber
                      }/img/profileicon/${u.summoner[0].profileIconId}.png`}
                    />
                  </Divider>
                }
                actions={[
                  <Tooltip title="Total accounts of that user">
                    <span>
                      <Icon type="team" /> {u.summoner.length}
                    </span>
                  </Tooltip>,
                  <Tooltip title="User account level">
                    <span>
                      <Icon type="rise" /> {u.summoner[0].summonerLevel}
                    </span>
                  </Tooltip>,
                  <Tooltip title="See stats">
                    <Link
                      to={{
                        pathname: "/stats",
                        state: {
                          userId: u._id,
                          summonersOfAccount: u.summoner
                        }
                      }}
                    >
                      <Icon type="area-chart" />
                    </Link>
                  </Tooltip>
                ]}
              >
                <Meta
                  title={u.summoner[0].name}
                  description={this.unfoldServerName(u.summoner[0].server)}
                  style={{ textAlign: "center", paddingBottom: "20px" }}
                />

                <Card.Grid style={gridStyleFirstLine}>
                  <Meta
                    title={
                      <Tooltip title="Win Ratio">
                        <FontAwesomeIcon icon={faPercent} />
                      </Tooltip>
                    }
                    description={u.summoner[0].winRatio}
                    style={{
                      textAlign: "center",
                      paddingBottom: "20px",
                      fontSize: "20px"
                    }}
                  />
                </Card.Grid>

                <Card.Grid style={gridStyleFirstLine}>
                  <Meta
                    title={
                      <Tooltip title="Average Gold">
                        <FontAwesomeIcon icon={faCoins} />
                      </Tooltip>
                    }
                    description={u.summoner[0].avgGold
                      .toString()
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                    style={{
                      textAlign: "center",
                      paddingBottom: "20px",
                      fontSize: "20px"
                    }}
                  />
                </Card.Grid>

                <Card.Grid style={gridStyleFirstLine}>
                  <Meta
                    title={
                      <Tooltip title="Average Damage">
                        <FontAwesomeIcon icon={faBolt} />
                      </Tooltip>
                    }
                    description={u.summoner[0].avgDamage
                      .toString()
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                    style={{
                      textAlign: "center",
                      paddingBottom: "20px",
                      fontSize: "20px"
                    }}
                  />
                </Card.Grid>

                <Card.Grid style={{ width: "100%" }}>
                  <Meta
                    title="Most Played Champions"
                    description={u.summoner[0].mostPlayedChampions.map(data => {
                      return (
                        <div
                          style={{ display: "inline", marginLeft: "15px" }}
                          key={data.name}
                        >
                          <Tooltip
                            title={
                              <div style={{ textAlign: "center" }}>
                                <span>{data.name}</span>
                                <br />
                                Total games: {data.championTotalGames}
                              </div>
                            }
                            placement="bottom"
                          >
                            <Avatar
                              size="large"
                              src={`http://ddragon.leagueoflegends.com/cdn/${
                                u.latestPatchNumber
                              }/img/champion/${data.name}.png`}
                            />
                          </Tooltip>
                        </div>
                      );
                    })}
                    style={{
                      textAlign: "center",
                      paddingBottom: "20px",
                      fontSize: "20px"
                    }}
                  />
                </Card.Grid>

                <Card.Grid style={gridStyleThirdLine}>
                  <Meta
                    title="Roles"
                    description={this.unfoldRoles(u.roles).map((i, index) => {
                      return (
                        <Tooltip
                          title={u.roles[index]}
                          key={i}
                          placement="bottom"
                        >
                          <Avatar size="large" src={i} />
                        </Tooltip>
                      );
                    })}
                    style={{ textAlign: "center", paddingBottom: "20px" }}
                  />
                </Card.Grid>

                <Card.Grid style={gridStyleThirdLine}>
                  <Meta
                    title="Languages"
                    description={this.unfoldLanguages(u.languages).map(i => {
                      return (
                        <span key={i}>
                          <Icon type="caret-right" />
                          {i} <br />
                        </span>
                      );
                    })}
                    style={{ textAlign: "center", paddingBottom: "20px" }}
                  />
                </Card.Grid>

                <Card.Grid style={gridStyleThirdLine}>
                  <Meta
                    title="Tier"
                    description={
                      <Tooltip title={u.summoner[0].tier} placement="bottom">
                        <Avatar
                          style={{ height: "70px", width: "70px" }}
                          size="large"
                          src={this.unfoldTier(u.summoner[0].tier)}
                        />
                      </Tooltip>
                    }
                    style={{ textAlign: "center", paddingBottom: "20px" }}
                  />
                </Card.Grid>
              </Card>
            );
          });
        }}
      </Query>
    );
  }
}

export default Grid;
