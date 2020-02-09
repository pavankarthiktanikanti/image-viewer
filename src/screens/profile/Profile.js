import React, { Component } from 'react';
import Header from '../../common/header/Header';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core';
import Modal from 'react-modal';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import './Profile.css';

/**
 * Custom Styles used to customize material ui components
 * @param {*} theme 
 */
const styles = theme => ({
    editIcon: {
        marginLeft: '2%',
        width: '45px',
        height: '45px'
    }
});

/**
 * Container to display the contents and align to center
 * @param {*} props 
 */
const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }} >
            {props.children}
        </Typography>
    );
}

/**
 * Style the Edit Full name modal to position at the center of page
 */
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

class Profile extends Component {
    /**
    * Initialize the Component and state variables
    */
    constructor() {
        super();
        this.state = {
            isUserLoggedIn: sessionStorage.getItem('access-token') != null,
            accessToken: sessionStorage.getItem('access-token'),
            profilePicture: "",
            username: "",
            noOfPosts: 0,
            usersFollowed: 0,
            followedBy: 0,
            fullName: '',
            images: [],
            nameUpdateModalIsOpen: false,
            modifiedFullName: '',
            modifiedFullNameRequired: 'dispNone'
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
                    thisComponent.setState({
                        profilePicture: responseData.profile_picture,
                        username: responseData.username,
                        noOfPosts: responseData.counts.media,
                        usersFollowed: responseData.counts.follows,
                        followedBy: responseData.counts.followed_by,
                        fullName: responseData.full_name
                    })
                }
            });
            // Trigger a GET Request for Instagram API using access token
            xhrProfile.open('GET', this.props.baseUrl + "?access_token=" + this.state.accessToken);
            xhrProfile.send();

            let xhrMedia = new XMLHttpRequest();
            xhrMedia.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    // Read the media info from response Data and set it to state
                    let responseData = JSON.parse(this.response).data;
                    thisComponent.setState({
                        images: responseData
                    });
                }
            });
            // Trigger a GET Request for Instagram API using access token to fetch the media/images details
            xhrMedia.open('GET', this.props.baseUrl + '/media/recent?access_token=' + this.state.accessToken);
            xhrMedia.send();
        }
    }

    /**
     * Show the Edit User name modal on click of Edit icon
     */
    userNameEditHandler = () => {
        this.setState({
            modifiedFullName: '',
            modifiedFullNameRequired: 'dispNone',
            nameUpdateModalIsOpen: true
        });
    }

    /**
     * Hide the Username edit Modal on focus loss of the modal
     */
    closeModalHandler = () => {
        this.setState({ nameUpdateModalIsOpen: false });
    }

    /**
     * Set the Modified User Full name on change of data in the text box
     */
    fullNameChangeHandler = (event) => {
        this.setState({ modifiedFullName: event.target.value })
    }

    /**
     * Update the User Full name on click of Update in the Edit Modal
     */
    updateFullNameClickHandler = () => {
        // Show error validation required message if full name is empty
        if (this.state.modifiedFullName === '') {
            this.setState({ modifiedFullNameRequired: 'dispBlock' });
        } else {
            // Set the full name to the state and close the modal
            this.setState({ fullName: this.state.modifiedFullName, nameUpdateModalIsOpen: false });
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                {/**
                 * Show the header, pass the profile picture from the instagram api response
                 */}
                <Header pageId="profile" profilePicture={this.state.profilePicture} {...this.props} />
                <div className="profile-container">
                    <div className="flex-container">
                        <div className="profile-picture-section">
                            <img src={this.state.profilePicture} className="profile-picture" alt="Profile Pic" />
                        </div>
                        {/**
                         * Show the stats details like no of posts, followers etc.
                         */}
                        <div className="details-section">
                            <Typography variant="h5" component="h5">{this.state.username}</Typography>
                            <Typography component="p" className="stats-section">
                                <span>Posts: {this.state.noOfPosts}</span>
                                <span>Follows: {this.state.usersFollowed}</span>
                                <span>Followed By: {this.state.followedBy}</span>
                            </Typography>
                            {/**
                             * Edit Icon which on clicked shows the Edit Modal for updating full name
                             */}
                            <Typography variant="h6" component="h6">
                                {this.state.fullName}
                                <Fab color="secondary" className={classes.editIcon} onClick={this.userNameEditHandler} ><EditIcon /></Fab>
                            </Typography>
                            {/**
                             * Full Name Edit Modal 
                             */}
                            <Modal ariaHideApp={false} isOpen={this.state.nameUpdateModalIsOpen} contentLabel="Edit" onRequestClose={this.closeModalHandler} style={customStyles}>
                                <Typography variant="h5" component="h5">
                                    Edit
                                </Typography><br />
                                <TabContainer>
                                    <FormControl required>
                                        <InputLabel htmlFor="fullName">Full Name</InputLabel>
                                        <Input id="fullName" type="text" onChange={this.fullNameChangeHandler} />
                                        <FormHelperText className={this.state.modifiedFullNameRequired}>
                                            <span className="red">required</span>
                                        </FormHelperText>
                                    </FormControl><br /><br />
                                </TabContainer><br />
                                <Button variant="contained" color="primary" onClick={this.updateFullNameClickHandler}>Update</Button>
                            </Modal>
                        </div>
                    </div>
                    {/**
                     * Grid view of all the images posted by the user
                     */}
                    <div className="images-grid-list">
                        <GridList cellHeight={350} cols={3} className="grid-list-main">
                            {this.state.images.map(image => (
                                <GridListTile key={image.id}>
                                    <img src={image.images.standard_resolution.url} alt={image.id} />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Profile);