import React, { Component } from 'react';
import Header from '../../common/header/Header';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import './Home.css';

/**
 * Styles used in the current component
 * @param {*} theme 
 */
const styles = theme => ({
    // Style the grid container with equal margins 
    // on left and right with 90% width
    gridContainer: {
        width: "90%",
        margin: "0px auto 0px auto"
    },
    // Give the Image content full width
    cardContentImg: {
        width: "100%"
    },
    // Style for bold font
    boldFont: {
        "font-weight": 600
    },
    // Provide 0 padding for the favorite icon
    fav: {
        padding: 0
    },
    // Comments section display in a row and on same line
    addComment: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline"
    }
});

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
            username: '',
            postedImages: [],
            displayImages: [],
            commentedImageId: ''
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

            let xhrMedia = new XMLHttpRequest();
            xhrMedia.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    let responseData = JSON.parse(this.response).data;
                    // Update the response data with the date and splitting the caption text for
                    // each image
                    responseData.forEach(image => {
                        image.created_time = thisComponent.parseDate(image.created_time);
                        image.caption.text = image.caption.text.split('\n');
                        image.userComments = [];
                        image.commentText = '';
                    });
                    // Set the Images data to state
                    thisComponent.setState({
                        postedImages: responseData,
                        displayImages: responseData,
                        commentText: ''
                    });
                }
            });
            // Trigger a GET Request for Instagram API using access token to fetch the media/images details
            xhrMedia.open('GET', this.props.baseUrl + '/media/recent?access_token=' + this.state.accessToken);
            xhrMedia.send();
        }
    }

    /**
     * Parse the date to the required format to be displayed on the Image card
     * dd/mm/yyyy HH:MM:SS
     */
    parseDate = (time) => {
        let dateTime = new Date(time * 1000);
        let formattedDate = this.appendLeadingZeros(dateTime.getDate()) + '/' +
            this.appendLeadingZeros(dateTime.getMonth() + 1) + '/' +
            dateTime.getFullYear() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' +
            dateTime.getSeconds();
        return formattedDate;
    }

    /**
     * Formats the number by prefixing 0 if less than 10
     * used for Date display
     */
    appendLeadingZeros = (num) => {
        if (num <= 9) {
            return '0' + num;
        }
        return num;
    }

    /**
     * Search the Images based on the search text entered in the header
     * If Search Text is empty/cleared from previous input, show all images
     * Else match the text with the image captions and show the matched images
     */
    searchBoxChangeHandler = (searchText) => {
        let displayImages = (searchText === "")
            ? this.state.postedImages
            : this.state.postedImages.filter(image => image.caption.text[0].toLowerCase().includes(searchText.toLowerCase())
                || image.caption.text[1].toLowerCase().includes(searchText.toLowerCase()));
        // Set the state to update the content on page
        this.setState({ displayImages: displayImages });
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
        return (
            <div>
                {/**
                 * Add the Header to home page, pass the Profile Picture from the state object
                 * which is set when component is mounted
                 */}
                <Header pageId="home" profilePicture={this.state.profilePicture} {...this.props} searchBoxChangeHandler={this.searchBoxChangeHandler} />
                <Grid container spacing={3} className={classes.gridContainer} >
                    {/**
                     * Display the image cards in a grid with 2 images in full view, and show
                     * one image in a row if the screen is reduced, to be responsive
                     */}
                    {this.state.displayImages.map(image => (
                        <Grid key={"post" + image.id} item xs={12} sm={6} >
                            <Card>
                                {/**
                                 * Card Header with profile picture, username and the time of image creation
                                 */}
                                <CardHeader
                                    classes={{ title: classes.boldFont }}
                                    avatar={
                                        <Avatar
                                            src={image.user.profile_picture}>
                                        </Avatar>
                                    }
                                    title={image.user.username}
                                    subheader={image.created_time}>
                                </CardHeader>
                                {/**
                                 * Card content with the image, caption with any hashtags and likes
                                 */}
                                <CardContent>
                                    <img src={image.images.standard_resolution.url} alt="post" className={classes.cardContentImg} />
                                    <hr className="line-separator" />
                                    <Typography className={classes.boldFont}>
                                        {image.caption.text[0]}
                                    </Typography>
                                    <Typography className="image-hash-tag">
                                        {image.tags && image.tags.map(tag => '#' + tag + ' ')}
                                    </Typography>
                                    {/**
                                     * Show Favorite Icon with red color when liked, Border Icon otherwise
                                     */}
                                    <IconButton onClick={() => this.likeButtonClickHandler(image)} className={classes.fav} >
                                        {image.user_has_liked
                                            ? <FavoriteIcon fontSize="large" color='error' />
                                            : <FavoriteBorderIcon fontSize="large" className="favorite-icon" />
                                        }
                                    </IconButton>
                                    {/**
                                     * Show the Likes count based on user actions
                                     */}
                                    <Typography className="likes-count">
                                        {image.likes.count === 1
                                            ? <span>{image.likes.count} like</span>
                                            : <span>{image.likes.count} likes</span>
                                        }
                                    </Typography>
                                    {/**
                                     * Show the comments added earlier for this image with the username who added
                                     */}
                                    <div className="comments-section">
                                        {image.userComments !== null && image.userComments.map(comment => (
                                            <div key={image.id + "comment" + comment.id}>
                                                <Typography>
                                                    <span className="comment-username">{comment.username}:&nbsp;</span>
                                                    <span className="comment-text">{comment.text}</span>
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                                    {/**
                                     * Comments Input box and Add button
                                     */}
                                    <div className="add-comments-section">
                                        <FormControl className={classes.addComment} fullWidth>
                                            <InputLabel htmlFor="comments">Add a comment</InputLabel>
                                            {/**
                                             * If the last entered comment is the one related to this image card, then clear the comments input box
                                             */}
                                            <Input id={"comments" + image.id} className="comments-input"
                                                onChange={(event) => this.commentsChangeHandler(event, image)} value={image.id === this.state.commentedImageId
                                                    ? image.commentText : ''}></Input>
                                            <Button variant="contained" color="primary" onClick={(event) => this.addCommentsClickHandler(event, image)}>ADD</Button>
                                        </FormControl>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div >
        );
    }
}

export default withStyles(styles)(Home);