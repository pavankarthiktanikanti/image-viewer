import React, { Component } from 'react';
import Header from '../../common/header/Header';

class Home extends Component {
    /**
     * Initialize the Component and state variables
     */
    constructor() {
        super();
        this.state = {
            isUserLoggedIn: sessionStorage.getItem('access-token') != null,
            accessToken: sessionStorage.getItem('access-token'),
            profilePicture: '',
            username: ''
        }
    }

    /**
     * Loads the Profile Picture and username from the Instagram API once
     * the Component is Mounted
     */
    componentDidMount() {
        // Call the Instagram API only when the user is logged in
        if (this.state.isUserLoggedIn) {
            let thisComponent = this;
            let xhrProfile = new XMLHttpRequest();
            // Access the Instagram base API to fetch the profile picture and username
            // of logged in user
            xhrProfile.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    let responseData = JSON.parse(this.response).data;
                    // Set the Profile Picture and username of logged user to state
                    thisComponent.setState({
                        profilePicture: responseData.profile_picture,
                        username: responseData.username
                    })
                }
            });
            // Trigger a GET Request for Instagram API using access token
            xhrProfile.open('GET', this.props.baseUrl + "?access_token=" + this.state.accessToken);
            xhrProfile.send();
        }
    }
    render() {
        return (
            <div>
                {/**
                 * Add the Header to home page, pass the Profile Picture from the state object
                 * which is set when component is mounted
                 */}
                <Header pageId="home" profilePicture={this.state.profilePicture} {...this.props} />
            </div>
        );
    }
}

export default Home;