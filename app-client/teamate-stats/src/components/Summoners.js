import React, {Component} from 'react';
import '../App.css';

class Summoners extends Component{
    render() {
        return (
            <main id="main">
                <div className="illo" style={{position: 'absolute', top: '0', zIndex: '-1', width: '100%'}}>
                    <img src={require('../images/wave.svg')} alt='Background'/>
                </div>
            </main>
        );
    }
}

export default Summoners;