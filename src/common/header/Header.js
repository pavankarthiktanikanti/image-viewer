import React, { Component } from 'react';
import './Header.css';

/**
 * Header Component to show the Banner and header text
 */
class Header extends Component {
    render() {
        return (
            <div className='app-header'>
                <span className='logo'>
                    Image Viewer
                </span>
            </div>
        );
    }
}

export default Header;