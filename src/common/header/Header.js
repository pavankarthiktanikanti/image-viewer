import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect, Link } from 'react-router-dom';
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
            isUserLoggedIn: sessionStorage.getItem('access-token') != null,
            showMenu: false
        }
    }

    searchBoxChangeHandler = () => {

    }

    /**
     * Show or Hide the Menu on click of Profile Picture Icon
     * toggle the Menu display on click of Profile Picture on on focus loss 
     * of Menu options box
     */
    profilePictureClickHandler = (event) => {
        this.setState({
            showMenu: !this.state.showMenu,
            anchorEl: this.state.anchorEl != null ? null : event.currentTarget
        });
    }

    /**
     * Navigate to Profile Page when My Account Menu is clicked
     */
    myAccountClickHandler = () => {
        this.props.history.push("/profile");
    }

    /**
     * Logout the user and clear the session storage
     */
    logoutClickHandler = () => {
        sessionStorage.removeItem('access-token');
        this.setState({
            isUserLoggedIn: false
        });
    }

    render() {
        return (
            <div className='app-header'>
                {
                    this.state.isUserLoggedIn ? <Redirect to='/home' /> : <Redirect to='/' />
                }
                <Link to="/" className="logo">Image Viewer</Link>
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
                        <IconButton className="profile-picture-icon" onClick={this.profilePictureClickHandler}>
                            <img src={this.props.profilePicture} alt="Profile Pic" className="profile-pic" />
                        </IconButton>
                        {/**
                         * Options menu on click of Profile Picture Icon, to show My Account and Logout
                         */}
                        <Menu
                            id="profile-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={this.state.showMenu}
                            onClose={this.profilePictureClickHandler}
                            className="profile-options-menu">
                            <MenuItem onClick={this.myAccountClickHandler}>
                                <span className="menu-option">My Account</span>
                            </MenuItem>
                            {/**
                             * Display a line separator for menu options
                             */}
                            <hr />
                            <MenuItem onClick={this.logoutClickHandler}>
                                <span className="menu-option">Logout</span>
                            </MenuItem>
                        </Menu>
                    </div>
                }
            </div>
        );
    }
}

export default Header;