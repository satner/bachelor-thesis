import React, {Component} from 'react';
import {Select, Checkbox, Form, Button} from 'antd';
import lang from '../languages-v2'
import Grid from './Summoners/Grid'
import Pagi from "./Summoners/Pagi";

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const tiers = [
  {name: 'PROVISIONAL', path: require('../images/tier-icons/provisional.png')},
  {name: 'BRONZE', path: require('../images/tier-icons/bronze.png')},
  {name: 'SILVER', path: require('../images/tier-icons/silver.png')},
  {name: 'GOLD', path: require('../images/tier-icons/gold.png')},
  {name: 'PLATINUM', path: require('../images/tier-icons/platinum.png')},
  {name: 'DIAMOND', path: require('../images/tier-icons/diamond.png')},
  {name: 'MASTER', path: require('../images/tier-icons/master.png')},
  {name: 'CHALLENGER', path: require('../images/tier-icons/challenger.png')},
];
const roles = [
  {name: 'bottom', path: require('../images/role-icons/Bottom_icon.png')},
  {name: 'support', path: require('../images/role-icons/Support_icon.png')},
  {name: 'middle', path: require('../images/role-icons/Middle_icon.png')},
  {name: 'jungle', path: require('../images/role-icons/Jungle_icon.png')},
  {name: 'top', path: require('../images/role-icons/Top_icon.png')},
  {name: 'specialist', path: require('../images/role-icons/Specialist_icon.png')},
];
const servers = [
  {shortName: 'na', name: 'North America'},
  {shortName: 'kr', name: 'Republic of korea'},
  {shortName: 'ru', name: 'Russia'},
  {shortName: 'br1', name: 'Brazil'},
  {shortName: 'eun1', name: 'Europe Nordic and East'},
  {shortName: 'euw1', name: 'Europe West'},
  {shortName: 'jp1', name: 'Japan'},
  {shortName: 'la1', name: 'Latin America North'},
  {shortName: 'la2', name: 'Latin America South'},
  {shortName: 'oc1', name: 'Ocean'},
  {shortName: 'tr1', name: 'Turkey'},
];

class Summoners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selida: 1,  // pagination stuff
      values: {}
    }
  }

  handleFilterForm = values => {
    this.setState({
      values
    })
  };

  handlePagination = (page, pageSize) => {
    this.setState({
      selida: page
    })
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    const buttonItemLayout = null;

    const formItemLayout = null;
    return (
        <main id="main" className={'test'}>
          <div className="illo" style={{position: 'absolute', top: '0', zIndex: '-1', width: '100%'}}>
            <img src={require('../images/wave.svg')} alt='Background'/>
          </div>

          <div className="summoners--container">
            {/* All the filters div*/}
            <div style={{marginLeft: '50px', width: '320px'}}>
              <Form onSubmit={e => {
                e.preventDefault();
                this.props.form.validateFields((err, values) => {
                    this.handleFilterForm(values)
                });
              }} style={{marginTop: '200px', marginLeft: '50px'}}>
                <FormItem
                    {...formItemLayout}
                >
                  {getFieldDecorator('server')(
                      <Select size='large' placeholder='Server' allowClear>
                        {
                          servers.map(s => {
                            return <Option key={s.shortName} value={s.shortName}>{s.name}</Option>
                          })
                        }
                      </Select>
                  )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                >
                  {getFieldDecorator('roles')(
                      <CheckboxGroup size='large'>
                        {
                          roles.map(r => {
                            return [
                              <Checkbox key={r.name} value={r.name}><img src={r.path}
                                                                         style={{height: '30px', width: '30px'}}
                                                                         alt={r.name}/>{r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                              </Checkbox>, <br key={r.name + 1}/>
                            ]
                          })
                        }
                      </CheckboxGroup>
                  )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                >
                  {getFieldDecorator('languages')(
                      <Select mode="multiple" placeholder='Language' size='large'>
                        {
                          lang.map(l => {
                            return <Option key={l.code} value={l.code}>{l.name}</Option>
                          })
                        }
                      </Select>
                  )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                >
                  {getFieldDecorator('tier')(
                      <Select placeholder='Tier' size='large' allowClear>
                        {
                          tiers.map(t => {
                            return <Option key={t.name}><img src={t.path} style={{height: '25px', width: '30px'}}
                                                             alt={t.name}/>{t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                            </Option>
                          })
                        }
                      </Select>
                  )}
                </FormItem>

                <FormItem {...buttonItemLayout}>
                  <Button type="primary" htmlType="submit" size='large'>Apply Filters</Button>
                </FormItem>
              </Form>
            </div>

            {/* Grid card layout of summoners*/}
            <div className="summoners--grid" style={{marginTop: '200px', marginLeft: '50px'}}>
              <div className="card--grid">
                <Grid page={this.state.selida} data={this.state.values}/>
              </div>
              {/*<Pagination defaultPageSize={6} total={this.state.totalPages} onChange={this.handlePagination} />*/}
              <Pagi onChange={this.handlePagination}/>
            </div>

          </div>
        </main>
    );
  }
}

const WrappedFilterForm = Form.create()(Summoners);

export default WrappedFilterForm;