import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import './Header.css';

/**
 * Header Component to show the Banner and header text
 * With a Search Box and Profile Icon when the user is logged in 
 */
class Header extends Component {
    /**
     * Initialize the Component and state variables
     */
    constructor() {
        super();
        this.state = {
            isUserLoggedIn: sessionStorage.getItem('access-token') != null
        }
    }

    searchBoxChangeHandler = () => {

    }

    profilePictureClickHandler = () => {

    }
    render() {
        return (
            <div className='app-header'>
                <span className='logo'>
                    Image Viewer
                </span>
                {/**
                 * Show the Search box and Profile icon only when the user is logged in
                 */}
                {this.state.isUserLoggedIn &&
                    <div className="header-right-content">
                        {/** Show the Search Box with a Magnifier Search Icon to be shown only on Home Page */}
                        {this.props.pageId === 'home' &&
                            <div className="search-box-header">
                                <SearchIcon className="search-icon" />
                                <Input placeholder="Search..." disableUnderline={true} className="search-box" onChange={this.searchBoxChangeHandler} />
                            </div>
                        }
                        {/**
                         * Profile Icon to be shown on top right corner of the page
                         */}
                        <div>
                            <IconButton className="profile-picture-icon" onClick={this.profilePictureClickHandler}>
                                <img src={this.props.profilePicture} alt="Profile Pic" className="profile-pic" />
                            </IconButton>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Header;