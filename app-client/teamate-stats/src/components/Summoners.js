import React, {Component} from 'react';
import { Select, Checkbox } from 'antd';
import lang from '../languages-v2'

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

class Summoners extends Component{
    constructor(props) {
        super(props);
        this.state = {
            listTier: [],
            listRoles: [],
            listLanguages: [],
            server: ''
        }
    }

    handleChangeTier = listTier => {
        this.setState({
            listTier
        });
    }

    handleChangeRoles = (listRoles) => {
        this.setState({
            listRoles
        });
    }

    handleChangeServer = server => {
        this.setState({
        server
        })
    }

    handleChangeLanguage = listLanguages => {
        console.log(listLanguages)
        this.setState({
            listLanguages
        })
    }

    render() {
        let langHTML = []
        lang.forEach(l => {
            langHTML.push(<Option key={l.code}>{l.name}</Option>)
        })

        return (
            <main id="main">
                <div className="illo" style={{position: 'absolute', top: '0', zIndex: '-1', width: '100%'}}>
                    <img src={require('../images/wave.svg')} alt='Background'/>
                </div>

                {/* All the filters div*/}
                <div style={{ marginTop: '200px', marginLeft: '50px' }}>
                    {/* Filter selection of tier */}
                    <h1>Select tier</h1>
                    <Select
                        mode="multiple"
                        style={{ width: '320px' }}
                        placeholder="Select tier"
                        size={'large'}
                        showArrow={true}
                        onChange={this.handleChangeTier}
                    >
                        <Option key={'provisional'}><img src={require('../images/tier-icons/provisional.png')} style={{height: '25px', width: '30px'}} alt=""/> Provisional</Option>
                        <Option key={'bronze'}><img src={require('../images/tier-icons/bronze.png')} style={{height: '25px', width: '30px'}} alt=""/> Bronze</Option>
                        <Option key={'silver'}><img src={require('../images/tier-icons/silver.png')} style={{height: '25px', width: '30px'}} alt=""/> Silver</Option>
                        <Option key={'gold'}><img src={require('../images/tier-icons/gold.png')} style={{height: '25px', width: '30px'}} alt=""/> Gold</Option>
                        <Option key={'platinum'}><img src={require('../images/tier-icons/platinum.png')} style={{height: '25px', width: '30px'}} alt=""/> Platinum</Option>
                        <Option key={'diamond'}><img src={require('../images/tier-icons/diamond.png')} style={{height: '25px', width: '30px'}} alt=""/> Diamond</Option>
                        <Option key={'master'}><img src={require('../images/tier-icons/master.png')} style={{height: '25px', width: '30px'}} alt=""/> Master</Option>
                        <Option key={'challenger'}><img src={require('../images/tier-icons/challenger.png')} style={{height: '25px', width: '30px'}} alt=""/> Challenger</Option>
                    </Select>

                    {/* Filter selection of roles */}
                    <h1>Select Roles</h1>
                    <CheckboxGroup onChange={this.handleChangeRoles} >
                        <Checkbox value={'bottom'}><img src={require('../images/role-icons/Bottom_icon.png')} style={{height: '30px', width: '30px'}} alt='Bottom role'/></Checkbox>
                        <br />
                        <Checkbox value={'support'}><img src={require('../images/role-icons/Support_icon.png')} style={{height: '30px', width: '30px'}} alt='Support role'/></Checkbox>
                        <br />
                        <Checkbox value={'middle'}><img src={require('../images/role-icons/Middle_icon.png')} style={{height: '30px', width: '30px'}} alt='Middle role'/></Checkbox>
                        <br />
                        <Checkbox value={'jungle'}><img src={require('../images/role-icons/Jungle_icon.png')} style={{height: '30px', width: '30px'}} alt='Jungle role'/></Checkbox>
                        <br />
                        <Checkbox value={'top'}><img src={require('../images/role-icons/Top_icon.png')} style={{height: '30px', width: '30px'}} alt='Top role'/></Checkbox>
                        <br />
                        <Checkbox value={'specialist'}><img src={require('../images/role-icons/Specialist_icon.png')} style={{height: '30px', width: '30px'}} alt='Specialist role'/></Checkbox>
                        <br />
                    </CheckboxGroup>

                    {/* Filter selection of server */}
                    <h1>Server Regions</h1>
                    <Select
                        style={{ width: '320px' }}
                        size={'large'}
                        placeholder="Any"
                        allowClear={true}
                        onChange={this.handleChangeServer}>
                        <Option value='na'>North America</Option>
                        <Option value='kr'>Republic of korea</Option>
                        <Option value='ru'>Russia</Option>
                        <Option value='br1'>Brazil</Option>
                        <Option value='eun1'>Europe Nordic and East</Option>
                        <Option value='euw1'>Europe West</Option>
                        <Option value='jp1'>Japan</Option>
                        <Option value='la1'>Latin America North</Option>
                        <Option value='la2'>Latin America South</Option>
                        <Option value='oc1'>Ocean</Option>
                        <Option value='tr1'>Turkey</Option>
                    </Select>

                    {/* Filter selection of languages */}
                    <h1>Languages</h1>
                    <Select
                        mode="multiple"
                        style={{ width: '320px' }}
                        placeholder="Any"
                        size={'large'}
                        onChange={this.handleChangeLanguage}
                    >
                        {langHTML}
                    </Select>
                </div>
            </main>
        );
    }
}

export default Summoners;