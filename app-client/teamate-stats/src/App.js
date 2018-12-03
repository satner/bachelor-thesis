import React, {Component} from 'react';
import { Button } from 'antd';
import './App.css';

// TODO: override ant-design font-family
class App extends Component {
    render() {
        return (
            <div className="App">

                <header className='site-header'>
                    <div className='container'>
                        <nav className='nav nav--inline'>
                            <a style={{fontFamily: 'Muli', color: 'White', fontSize: '30px'}} href='/'>Team Mate Stats</a>
                            <div>
                                <Button ghost style={btnContainer}>Log in</Button>
                                <Button ghost style={btnContainer}>Sign up</Button>
                            </div>
                        </nav>
                    </div>
                </header>

                <hr/>

                <main id='main'>
                    <section className='summoner summoner--home'>
                        <div className="container">
                            <h1>
                                <span>Build, </span>
                                <span>deploy, </span>
                                <span>and manage </span>
                                <span className="smaller">modern web projects</span>
                            </h1>
                            <p>
                                An all-in-one workflow that combines global deployment,
                                continuous integration, and automatic HTTPS. And that’s just the beginning.
                            </p>
                            <footer>
                                <p>
                                    <a className="button" href="https://app.netlify.com/signup"
                                       id="cta-summoner-getstartedforfree">Get started for free</a>
                                </p>
                            </footer>
                        </div>
                        <div className="illo">
                            {/*<img src={require('./images/Layer 1.svg')} alt='Background' style={{position: 'absolute', top: '0', zIndex: '-100', left: '0'}}/>*/}
                            <img src={require('./images/final-bg.svg')} alt='Background'/>
                        </div>
                    </section>
                    <section></section>
                    <section></section>

                </main>


               {/* <section id="main-pitch" style={pitch}>
                    <h1 style={{fontFamily: 'Muli', color: 'White'}}>Search the ideal teammate</h1>
                    <p style={{fontFamily: 'Muli', color: 'White'}}>Became a member of healthy league of legends community</p>
                    <Button size={'large'}>Get started for free</Button>
                </section>*/}
            </div>
        );
    }
}

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
