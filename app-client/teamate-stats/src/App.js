import React, {Component} from 'react';
import { Button } from 'antd';
import './App.css';

// TODO: override ant-design font-family
class App extends Component {
    render() {
        return (
            <div className="App">
                <div className='container' style={container}>
                    <div>
                        <h1 style={{fontFamily: 'Muli', color: 'White'}}>Team Mate Stats</h1>
                    </div>
                    <div>
                        <Button ghost style={btnContainer}>Log in</Button>
                        <Button ghost style={btnContainer}>Sign up</Button>
                    </div>
                </div>
                <hr/>
                <img src={require('./images/bg.svg')} alt='Background' style={{position: 'absolute', top: '0', zIndex: '-1', left: '0'}}/>

                <div id="main-pitch" style={pitch}>
                    <h1 style={{fontFamily: 'Muli', color: 'White'}}>Search the ideal teammate</h1>
                    <p style={{fontFamily: 'Muli', color: 'White'}}>Became a member of healthy league of legends community</p>
                    <Button size={'large'}>Get started for free</Button>
                </div>
            </div>
        );
    }
}

const container = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: '.618em',
    maxWidth: '60rem',
    margin: '0 auto',
};

const btnContainer = {
    marginLeft: '1em'
};

const pitch = {
    padding: '5.483em 0',
    position: 'relative',
    boxSizing: 'content-box',
    maxWidth: '60rem',
    margin: '0 auto',
    textAlign: 'left',
}
export default App;
