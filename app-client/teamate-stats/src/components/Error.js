import React from 'react';
import errorImage from '../images/404.jpg'

// TODO: Refactor styles
const Error = () => {
    return (
        <div id="page-404" style={errorStyle}>
            <section style={sectionStyle}><h1 style={headingStyle}>404</h1><p style={paragraphStyle}>That page does not exist <br/> but you can explore our <a href="/summoners">summoners</a></p></section>
        </div>
    );
};

const errorStyle = {
    backgroundColor: 'white',
    height: '100%',
    backgroundImage: `url(${errorImage})`,
    width: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundPosition: '50%',
    backgroundSize: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '100'
}

const sectionStyle = {
    position: 'absolute',
    top: '48%',
    left: '55%',
    margin: '-103px 0 0 -120px',
    textAlign: 'center'
}

const headingStyle = {
    color: '#1890ff',
    fontSize: '120px',
    fontWeight: '500',
}

const paragraphStyle = {
    color: '#314659',
    fontSize: '18px'
}

export default Error;