import React, { Component } from "react";
import { Select, Checkbox, Form, Button, Slider, Divider, BackTop } from "antd";
import lang from "../languages-v2";
import champions from "../champions";
import Grid from "./Summoners/Grid";
import Pagi from "./Summoners/Pagi";
import "./summoners.css";

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const tiers = [
  {
    name: "PROVISIONAL",
    path: require("../images/tier-icons/provisional.png")
  },
  { name: "BRONZE", path: require("../images/tier-icons/bronze.png") },
  { name: "SILVER", path: require("../images/tier-icons/silver.png") },
  { name: "GOLD", path: require("../images/tier-icons/gold.png") },
  { name: "PLATINUM", path: require("../images/tier-icons/platinum.png") },
  { name: "DIAMOND", path: require("../images/tier-icons/diamond.png") },
  { name: "MASTER", path: require("../images/tier-icons/master.png") },
  { name: "CHALLENGER", path: require("../images/tier-icons/challenger.png") }
];
const roles = [
  { name: "bottom", path: require("../images/role-icons/Bottom_icon.png") },
  { name: "support", path: require("../images/role-icons/Support_icon.png") },
  { name: "middle", path: require("../images/role-icons/Middle_icon.png") },
  { name: "jungle", path: require("../images/role-icons/Jungle_icon.png") },
  { name: "top", path: require("../images/role-icons/Top_icon.png") },
  {
    name: "specialist",
    path: require("../images/role-icons/Specialist_icon.png")
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

class Summoners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selida: 1, // pagination stuff
      values: {}
    };
  }

  handleFilterForm = values => {
    // tier number to name
    let start = values.tier[0];
    let end = values.tier[1];
    values.tier = tiers.slice(start, end + 1).map(data => {
      return data.name;
    });

    // Average gold
    values.avgGold *= 1000;

    // Average Damage
    values.avgDamage *= 5000;

    console.log(values);
    this.setState({
      values
    });
  };

  handlePagination = (page, pageSize) => {
    this.setState({
      selida: page
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const buttonItemLayout = null;
    const formItemLayout = null;
    return (
      <main id="main" className={"test"}>
        <div className={"top-svg"}>
          <div className="illo">
            <img src={require("../images/wave.svg")} alt="Background" />
          </div>
        </div>

        <div className="summoners--container">
          {/* All the filters */}
          <div>
            <Form
              className={"filter-card"}
              onSubmit={e => {
                e.preventDefault();
                this.props.form.validateFields((err, values) => {
                  this.handleFilterForm(values);
                });
              }}
              style={{ marginTop: "200px" }}
            >
              <Divider>
                <h3>Tier</h3>
              </Divider>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("tier", {
                  initialValue: [1, 3]
                })(
                  <Slider
                    range
                    min={0}
                    max={7}
                    step={1}
                    tipFormatter={index => {
                      return (
                        <img
                          height="45"
                          width="50"
                          alt={index.name}
                          src={tiers[index].path}
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                      );
                    }}
                  />
                )}
              </FormItem>

              <Divider>
                <h3>Win Ratio Over</h3>
              </Divider>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("winRatio", {
                  initialValue: 40
                })(
                  <Slider
                    step={1}
                    tipFormatter={index => {
                      return <span>{index}%</span>;
                    }}
                  />
                )}
              </FormItem>

              <Divider>
                <h3>Average Gold Over</h3>
              </Divider>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("avgGold", {
                  initialValue: 10
                })(
                  <Slider
                    step={0.5}
                    min={1}
                    tipFormatter={index => {
                      return <span>{index * 1000}</span>;
                    }}
                  />
                )}
              </FormItem>

              <Divider>
                <h3>Average Damage Over</h3>
              </Divider>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("avgDamage", {
                  initialValue: 4
                })(
                  <Slider
                    step={0.5}
                    min={1}
                    tipFormatter={index => {
                      return <span>{index * 5000}</span>;
                    }}
                  />
                )}
              </FormItem>

              <Divider>
                <h3>Champions</h3>
              </Divider>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("champions")(
                  <Select
                    mode="multiple"
                    placeholder="Champions"
                    size="large"
                    maxTagCount={5}
                  >
                    {champions.map(l => {
                      return (
                        <Option key={l.name} value={l.name}>
                          {l.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>

              <Divider>
                <h3>Server</h3>
              </Divider>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("server")(
                  <Select size="large" placeholder="Server" allowClear>
                    {servers.map(s => {
                      return (
                        <Option key={s.shortName} value={s.shortName}>
                          {s.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>

              <Divider>
                <h3>Role</h3>
              </Divider>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("roles")(
                  <CheckboxGroup size="large">
                    {roles.map(r => {
                      return [
                        <Checkbox key={r.name} value={r.name}>
                          <img
                            src={r.path}
                            style={{ height: "30px", width: "30px" }}
                            alt={r.name}
                          />
                          {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                        </Checkbox>,
                        <br key={r.name + 1} />
                      ];
                    })}
                  </CheckboxGroup>
                )}
              </FormItem>

              <Divider>
                <h3>Language</h3>
              </Divider>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("languages")(
                  <Select mode="multiple" placeholder="Language" size="large">
                    {lang.map(l => {
                      return (
                        <Option key={l.code} value={l.code}>
                          {l.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>

              <Divider>
                <h3>Search</h3>
              </Divider>
              <FormItem {...buttonItemLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  ghost
                  block
                  icon={"search"}
                >
                  Apply Filters
                </Button>
              </FormItem>
            </Form>
          </div>

          {/* Grid card layout of summoners*/}
          <div className="summoners--grid">
            <div className="card--grid">
              <Grid page={this.state.selida} data={this.state.values} />
            </div>
            <Pagi onChange={this.handlePagination} data={this.state.values} />
          </div>
        </div>
        <BackTop visibilityHeight={100}>
          <div className={"ant-back-top"}>UP</div>
        </BackTop>
      </main>
    );
  }
}

const WrappedFilterForm = Form.create()(Summoners);

export default WrappedFilterForm;
