import React, {Component} from 'react';
import {BackTop} from "antd";

class Home extends Component {
  render() {
    return (
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
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, est, quam! Accusamus, alias
                consequatur distinctio earum harum laboriosam nobis officia pariatur praesentium quaerat repellendus
                reprehenderit, velit voluptates. Maxime, quisquam ratione.
              </p>
              <footer>
                <p>
                  <a className="button" href="/">Get started for free</a>
                </p>
              </footer>
            </div>
            <div className="illo">
              <img src={require('../../images/final-bg.svg')} alt='Background'/>
            </div>
          </section>
          <section className='section section--home-core'>
            <div className="container">
              <h1>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut cupiditate debitis dolorum, error
                impedit, ipsum mollitia placeat provident quas quia quos rem sint tempore! Consequatur fugit non quam
                vitae voluptates!</h1>
              <ol className="grid">
                <li>
                  <h3>lorem ipsum</h3>
                  <img src={require('../../images/one.svg')} alt='one'/>

                </li>
                <li>
                  <h3>lorem ipsum</h3>
                  <img src={require('../../images/one.svg')} alt='one'/>
                </li>
                <li>
                  <h3>lorem ipsum</h3>
                  <img src={require('../../images/one.svg')} alt='one'/>
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

          <BackTop visibilityHeight={100}>
            <div className={'ant-back-top'}>UP</div>
          </BackTop>
        </main>
    );
  }
}

export default Home;