import React, { Component } from 'react';
import Header from '../../common/header/Header';

class Home extends Component {
    render() {
        return (
            <div><Header pageId="home" {...this.props} /></div>
        );
    }
}

export default Home;