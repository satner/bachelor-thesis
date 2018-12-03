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
                            <a style={{fontFamily: 'Muli', color: 'White', fontSize: '30px'}} href='/'>
                                <img src={require('./images/league-of-legends.svg')} alt=""/>Team Mate Stats</a>
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
                                <span style={{fontSize: '50px'}}>lorem ipsum </span>
                                <span style={{fontSize: '50px'}}>lorem ipsum</span>
                                <span style={{fontSize: '50px'}}>lorem ipsum</span>
                                <span className="smaller">lorem ipsum</span>
                            </h1>
                            <p style={{fontSize: '25px'}}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, est, quam! Accusamus, alias consequatur distinctio earum harum laboriosam nobis officia pariatur praesentium quaerat repellendus reprehenderit, velit voluptates. Maxime, quisquam ratione.
                            </p>
                            <footer>
                                <p>
                                    <a className="button" href="/">Get started for free</a>
                                </p>
                            </footer>
                        </div>
                        <div className="illo">
                            {/*<img src={require('./images/Layer 1.svg')} alt='Background' style={{position: 'absolute', top: '0', zIndex: '-100', left: '0'}}/>*/}
                            <img src={require('./images/final-bg.svg')} alt='Background'/>
                        </div>
                    </section>
                    <section className='section section--home-core'>
                        <div className="container">
                            <h1>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut cupiditate debitis dolorum, error impedit, ipsum mollitia placeat provident quas quia quos rem sint tempore! Consequatur fugit non quam vitae voluptates!</h1>
                            <ol className="grid">
                                <li>
                                    <h3>lorem ipsum</h3>
                                    <img src={require('./images/one.svg')} alt='one'/>

                                </li>
                                <li>
                                    <h3>lorem ipsum</h3>
                                    <img src={require('./images/one.svg')} alt='one'/>
                                </li>
                                <li>
                                    <h3>lorem ipsum</h3>
                                    <img src={require('./images/one.svg')} alt='one'/>
                                </li>
                            </ol>
                            <footer>
                                <p id="footnote-core">
                                    *Nope, no gotcha here. <br/>
                                    It just takes a few clicks.
                                </p>
                                <p>
                                    <a className="button" href="/">Get started for free</a>
                                </p>
                            </footer>
                        </div>
                    </section>

                    <footer className='site-footer'>
                        <div className="container">
                            <div className="hr hr--top">

                            </div>
                            <p>Made with <span role='img'>❤</span>️ <a href="https://github.com/satner">Satner</a> </p>
                        </div>
                    </footer>

                </main>
            </div>
        );
    }
}

const btnContainer = {
    marginLeft: '1em'
};

export default App;
