import React, { Component } from "react";
import { BackTop, Card, Divider, Icon } from "antd";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <main id="main">
        <section className="summoner summoner--home">
          <div className="container">
            <h1>
              <span style={{ fontSize: "50px" }}>lorem ipsum </span>
              <span className="smaller">lorem ipsum</span>
            </h1>
            <p style={{ fontSize: "25px" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores,
              est, quam! Accusamus, alias consequatur distinctio earum harum
              laboriosam nobis officia pariatur praesentium quaerat repellendus
              reprehenderit, velit voluptates. Maxime, quisquam ratione.
            </p>
            <footer>
              <p>
                <Link className="button" to="/signup">
                  Get started for free
                </Link>
              </p>
            </footer>
          </div>
          <div className="illo">
            <img src={require("../../images/final-bg.svg")} alt="Background" />
          </div>
        </section>
        <section className="section section--home-core">
          <div className="container">
            <h1
              style={{ fontSize: "3em", fontWeight: "500", lineWeight: "1.2" }}
            >
              Find teammate in seconds*
            </h1>
            <ol className="grid">
              <li>
                <h2>1. Connect your accounts</h2>
                <Card className="landing-page--card " bordered={false}>
                  <p>
                    <h3>Faker</h3> <h5>Republic of Korea</h5>
                  </p>
                  <Divider />
                  <p>
                    <h3>Bjergsen</h3> <h5>North America</h5>
                  </p>
                  <Divider />
                  <p>
                    <h3>PozerasLeeSin</h3> <h5>Europe Nordic and East</h5>
                  </p>
                  <Divider />
                  <p>
                    <h3>An Active Member</h3> <h5>Europe Nordic and East</h5>
                  </p>
                </Card>
              </li>
              <li>
                <h2>2. Search players</h2>
                <Card className="landing-page--card " bordered={false}>
                  <h4>Win Ratio</h4>
                  <Divider />
                  <h4>Average Gold</h4>
                  <Divider />
                  <h4>Role</h4>
                  <Divider />
                  <h4>Language</h4>
                  <Divider />
                  <h4>Tier</h4>
                  <Divider />
                  <h4>Average Damage</h4>
                </Card>
              </li>
              <li>
                <h2>3. Explore their Stats</h2>
                <Card className="landing-page--card " bordered={false}>
                  <p>
                    <Icon type="area-chart" /> Activity
                  </p>
                  <Divider />
                  <p>
                    <Icon type="pie-chart" /> Win Ratio
                  </p>
                  <Divider />
                  <p>
                    <Icon type="bar-chart" /> Loved Champions
                  </p>
                  <Divider />
                  <p>
                    <Icon type="line-chart" /> KDA
                  </p>
                  <Divider />
                  <p>
                    <Icon type="radar-chart" /> Gold Aggregate
                  </p>
                  <Divider />
                  <p>
                    <Icon type="dot-chart" /> Damage
                  </p>
                </Card>
              </li>
            </ol>
            <footer>
              <p id="footnote-core">
                *Nope, no gotcha here. <br />
                It just takes a few clicks.
              </p>
              <p>
                <Link className="button" to="/signup">
                  Get started for free
                </Link>
              </p>
            </footer>
          </div>
        </section>

        <BackTop visibilityHeight={100}>
          <div className={"ant-back-top"}>UP</div>
        </BackTop>
      </main>
    );
  }
}

export default Home;
