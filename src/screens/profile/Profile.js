import React, { Component } from 'react';
import Header from '../../common/header/Header';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
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
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import './Profile.css';

/**
 * Custom Styles used to customize material ui components
 * @param {*} theme 
 */
const styles = theme => ({
    // Style the width and height of edit icon
    editIcon: {
        marginLeft: '2%',
        width: '45px',
        height: '45px'
    },
    // Style for bold font
    boldFont: {
        "font-weight": 600
    },
    // Provide 0 padding for the favorite icon
    fav: {
        padding: 0
    },
    // Style header with padding left and bottom
    cardHeader: {
        padding: '0 0 10px 10px'
    },
    // Comments section display in a row and on same line
    addComment: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline"
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

/**
 * Style the Image view modal opened on click of grid image
 */
const imageModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vh'
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
            modifiedFullNameRequired: 'dispNone',
            imageModalIsOpen: false,
            selectedImage: {}
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
                    responseData.forEach(image => {
                        // Parse the caption and split the text
                        image.caption.text = image.caption.text.split('\n');
                        image.userComments = [];
                        image.commentText = '';
                    });
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
     * Set the selected image on click of grid image to show in the modal
     */
    gridImageClickHandler = (image) => {
        this.setState({ selectedImage: image, imageModalIsOpen: true });
    }

    /**
     * Hide the Username edit Modal on focus loss of the modal
     */
    closeModalHandler = () => {
        this.setState({ nameUpdateModalIsOpen: false, imageModalIsOpen: false });
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

    /**
     * Update the like counts when user clicks on the Favorite Icon
     * Checks if already liked, toggles the liked flag i.e. true to false and viceversa
     */
    likeButtonClickHandler = (image) => {
        if (image.user_has_liked) {
            if (image.likes.count > 0) {
                image.likes.count--;
            } else {
                image.likes.count = 0;
            }
        } else {
            image.likes.count++;
        }
        image.user_has_liked = !image.user_has_liked;
        // Set the state to update the content on page
        this.setState({ ...this.state });
    }

    /**
     * Store the image comments added in the text box and the image id
     * for which the comment is added on change of data in the text box
     */
    commentsChangeHandler = (event, image) => {
        this.setState({
            commentedImageId: image.id
        });
        image.commentText = event.target.value;
    }

    /**
     * Show the new comment under the image and clear the input
     * text box
     */
    addCommentsClickHandler = (event, image) => {
        if (image.commentText !== '') {
            image.comments.count++;
            image.userComments.push({
                id: image.comments.count,
                text: image.commentText,
                username: this.state.username
            });
            image.commentText = '';
            // Set the state to update the content on page
            this.setState({ ...this.state });
        }
    }

    render() {
        const { classes } = this.props;
        let selectedImage = this.state.selectedImage;
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
                        <GridList cellHeight={350} spacing={5}>
                            {this.state.images.map(image => (
                                <Grid key={"post" + image.id} item xs={12} sm={6} lg={4} className="image-grid" onClick={() => this.gridImageClickHandler(image)}>
                                    <img src={image.images.standard_resolution.url} alt={image.id} />
                                </Grid>))
                            }
                        </GridList>
                        {/**
                         * Individual Image details modal on click on grid view image
                         */}
                        <Modal ariaHideApp={false} isOpen={this.state.imageModalIsOpen} contentLabel="view" onRequestClose={this.closeModalHandler} style={imageModalStyles}>
                            {selectedImage.images &&
                                <div>
                                    <div className="image-section">
                                        <img src={selectedImage.images.standard_resolution.url} className="image-post" alt={selectedImage.id} />
                                    </div>
                                    <div className="right-section">
                                        {/**
                                         * Card Header with profile picture, username and the time of image creation
                                         */}
                                        <CardHeader className={classes.cardHeader}
                                            classes={{ title: classes.boldFont }}
                                            avatar={
                                                <Avatar
                                                    src={selectedImage.user.profile_picture}>
                                                </Avatar>
                                            }
                                            title={selectedImage.user.username}>
                                        </CardHeader>
                                        <hr />
                                        {/**
                                         * Show the image caption and the hash tags
                                         */}
                                        <div className="content">
                                            <Typography className={classes.boldFont}>
                                                {selectedImage.caption.text[0]}
                                            </Typography>
                                            <Typography className="image-hash-tag">
                                                {selectedImage.tags.map(tag => '#' + tag + ' ')}
                                            </Typography>
                                            {/**
                                             * Show the comments added earlier for this image with the username who added
                                             */}
                                            <div className="comments-section">
                                                {selectedImage.userComments !== null && selectedImage.userComments.map(comment => (
                                                    <div key={selectedImage.id + "comment" + comment.id}>
                                                        <Typography>
                                                            <span className="comment-username">{comment.username}:&nbsp;</span>
                                                            <span className="comment-text">{comment.text}</span>
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="likes-add-comment-section">
                                                {/**
                                                 * Show Favorite Icon with red color when liked, Border Icon otherwise
                                                 */}
                                                <IconButton onClick={() => this.likeButtonClickHandler(selectedImage)} className={classes.fav} >
                                                    {selectedImage.user_has_liked
                                                        ? <FavoriteIcon fontSize="large" color='error' />
                                                        : <FavoriteBorderIcon fontSize="large" className="favorite-icon" />
                                                    }
                                                </IconButton>
                                                {/**
                                                 * Show the Likes count based on user actions
                                                 */}
                                                <Typography className="likes-count">
                                                    {selectedImage.likes.count === 1
                                                        ? <span>{selectedImage.likes.count} like</span>
                                                        : <span>{selectedImage.likes.count} likes</span>
                                                    }
                                                </Typography>
                                                {/**
                                                 * Comments Input box and Add button
                                                 * */}
                                                <div className="add-comments-section">
                                                    <FormControl className={classes.addComment}>
                                                        <InputLabel htmlFor="comments">Add a comment</InputLabel>
                                                        {/**
                                                         * If the last entered comment is the one related to this image card, then clear the comments input box
                                                         * */}
                                                        <Input id={"comments" + selectedImage.id} className="comments-input"
                                                            onChange={(event) => this.commentsChangeHandler(event, selectedImage)} value={selectedImage.commentText}></Input>
                                                        <Button variant="contained" color="primary" onClick={(event) => this.addCommentsClickHandler(event, selectedImage)}>ADD</Button>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Profile);