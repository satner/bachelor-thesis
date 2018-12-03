import React, {Component} from 'react';
import {Button} from "antd";
import { NavLink } from 'react-router-dom';

// TODO: NavLink inside ol
class Navigation extends Component{
    render() {
        return (
            <div>
                <header className='site-header'>
                    <div className='container'>
                        <nav className='nav nav--inline'>
                            <div>
                                <img src={require('../images/league-of-legends.svg')} alt=""/>
                                <NavLink style={{fontFamily: 'Muli', color: 'White', fontSize: '20px'}} to='/'>Team Mate Stats</NavLink>
                                <NavLink style={{fontFamily: 'Muli', color: 'White', fontSize: '20px', marginLeft: '20px'}} to='/summoners'>Summoners</NavLink>
                            </div>
                            <div>
                                <Button ghost style={btnContainer}>Log in</Button>
                                <Button ghost style={btnContainer}>Sign up</Button>
                            </div>
                        </nav>
                    </div>
                </header>

                <hr/>
            </div>
        );
    }
}

const btnContainer = {
    marginLeft: '1em'
};

export default Navigation;