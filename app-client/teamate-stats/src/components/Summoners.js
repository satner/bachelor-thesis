import React, {Component} from 'react';
import {Select, Checkbox, Badge} from 'antd';
import lang from '../languages-v2'
import SummonerGridDetail from './SummonerGridDetail'
import Pagi from "./Pagi";

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const tiers = [
  {name: 'provisional', path: require('../images/tier-icons/provisional.png')},
  {name: 'bronze', path: require('../images/tier-icons/bronze.png')},
  {name: 'silver', path: require('../images/tier-icons/silver.png')},
  {name: 'gold', path: require('../images/tier-icons/gold.png')},
  {name: 'platinum', path: require('../images/tier-icons/platinum.png')},
  {name: 'diamond', path: require('../images/tier-icons/diamond.png')},
  {name: 'master', path: require('../images/tier-icons/master.png')},
  {name: 'challenger', path: require('../images/tier-icons/challenger.png')},
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
      listTier: [],
      listRoles: [],
      listLanguages: [],
      server: '',
      badgeTier: 0,
      badgeLanguage: 0,
      selida: 1,  // pagination stuff
    }
  }

  handleChangeTier = listTier => {
    let badgeTier = listTier.length;
    this.setState({
      listTier,
      badgeTier
    });
  };

  handleChangeRoles = (listRoles) => {
    this.setState({
      listRoles
    });
  };

  handleChangeServer = server => {
    this.setState({
      server
    });
  };

  handleChangeLanguage = listLanguages => {
    let badgeLanguage = listLanguages.length;
    this.setState({
      listLanguages,
      badgeLanguage
    });
  };

  handlePagination = (page, pageSize) => {
    this.setState({
      selida: page
    })
  };

  render() {
    return (
        <main id="main" className={'test'}>
          <div className="illo" style={{position: 'absolute', top: '0', zIndex: '-1', width: '100%'}}>
            <img src={require('../images/wave.svg')} alt='Background'/>
          </div>

          <div className="summoners--container">
            {/* All the filters div*/}
            <div id='filters' style={{marginTop: '200px', marginLeft: '50px'}}>

              {/* Filter selection of tier */}
              <Badge count={this.state.badgeTier} offset={[10, 0]} title={'Number of selected tiers'}>
                <h1>Select tier</h1>
              </Badge>
              <Select
                  mode="multiple"
                  style={{width: '320px'}}
                  placeholder="Select tier"
                  size={'large'}
                  showArrow={true}
                  onChange={this.handleChangeTier}
              >
                {
                  tiers.map(t => {
                    return <Option key={t.name}><img src={t.path} style={{height: '25px', width: '30px'}}
                                                     alt={t.name}/>{t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                    </Option>
                  })
                }
              </Select>

              {/* Filter selection of roles */}
              <h1>Select Roles</h1>
              <CheckboxGroup onChange={this.handleChangeRoles}>
                {
                  roles.map(r => {
                    return [
                      <Checkbox key={r.name} value={r.name}><img src={r.path} style={{height: '30px', width: '30px'}}
                                                                 alt={r.name}/>{r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                      </Checkbox>, <br key={r.name + 1}/>
                    ]
                  })
                }
              </CheckboxGroup>

              {/* Filter selection of server */}
              <h1>Server Regions</h1>
              <Select
                  style={{width: '320px'}}
                  size={'large'}
                  placeholder="Any"
                  allowClear={true}
                  onChange={this.handleChangeServer}>
                {
                  servers.map(s => {
                    return <Option key={s.shortName} value={s.shortName}>{s.name}</Option>
                  })
                }
              </Select>

              {/* Filter selection of languages */}
              <Badge count={this.state.badgeLanguage} offset={[10, 0]} title={'Number of selected languages'}>
                <h1>Languages</h1>
              </Badge>
              <Select
                  mode="multiple"
                  style={{width: '320px'}}
                  placeholder="Any"
                  size={'large'}
                  onChange={this.handleChangeLanguage}
              >
                {
                  lang.map(l => {
                    return <Option key={l.code} value={l.code}>{l.name}</Option>
                  })
                }
              </Select>
            </div>

            {/* Grid card layout of summoners*/}
            <div className="summoners--grid" style={{marginTop: '200px', marginLeft: '50px'}}>
              <div className="card--grid">
                <SummonerGridDetail page={this.state.selida}/>
              </div>
              {/*<Pagination defaultPageSize={6} total={this.state.totalPages} onChange={this.handlePagination} />*/}
              <Pagi onChange={this.handlePagination}/>
            </div>

          </div>
        </main>
    );
  }
}

export default Summoners;