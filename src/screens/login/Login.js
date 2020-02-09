import React, { Component } from 'react';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import './Login.css';

/**
 * Login Component for user Login Screen
 */
class Login extends Component {
    /**
     * Initialize the Component and state variables
     */
    constructor() {
        super();
        this.state = {
            username: "",
            usernameRequired: "dispNone",
            password: "",
            passwordRequired: "dispNone",
            incorrectUsernamePassword: "dispNone",
            isUserLoggedIn: sessionStorage.getItem('access-token') != null
        }
    }

    /**
     * Set the Input username field value to state variable
     */
    usernameChangeHandler = (e) => {
        this.setState({ username: e.target.value });
    }

    /**
     * Set the Input password field value to state variable
     */
    passwordChangeHandler = (e) => {
        this.setState({ password: e.target.value });
    }

    /**
     * Handler on click of login Button on Login Card.
     * Validate Required fields and set the css for showing up the Form helper text as required.
     * If valid username and password is provided, then user token is added to session Storage and 
     * redirect to Home page.
     */
    loginClickHandler = () => {
        // Default username and password
        let validUser = "instagram";
        let validPassword = "u94rad";
        // Upgrad user access token
        let accessToken = "8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784";

        // Validate for empty field input data, show required red message under the input fields
        this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState(
            { usernameRequired: "dispNone" });
        this.state.password === "" ? this.setState({ passwordRequired: "dispBlock" }) : this.setState(
            { passwordRequired: "dispNone" });

        // If any of the field is empty, then incorrect message shouldn't be shown
        if (this.state.username === "" || this.state.password === "") {
            this.setState({ incorrectUsernamePassword: "dispNone" });
        } else if (this.state.username === validUser || this.state.password === validPassword) {
            // Set access token in session storage and redirect to Home page
            sessionStorage.setItem("access-token", accessToken);
            this.props.history.push("/home");
        } else {
            // If both fields are provided with inputs and doesn't match with valid credentials
            // Show an error message as incorrect username or password
            this.setState({ incorrectUsernamePassword: "dispBlock" });
        }
    }

    render() {
        return (
            <div>
                {/**
                 * Redirect to home page if the user is logged in
                 */
                    this.state.isUserLoggedIn && <Redirect to='/home' />
                }
                <Header />
                <Card className="card-style">
                    <CardContent>
                        {/**
                         *  Show the Login Headline for the Card 
                         */}
                        <Typography variant="subtitle1" component="p">
                            <span className="login-headline">Login</span>
                        </Typography><br />
                        {/** 
                         * Input fields for user name/password and respective field validation messages
                        */}
                        <FormControl required className="formControl" fullWidth>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" type="text" onChange={this.usernameChangeHandler} />
                            <FormHelperText className={this.state.usernameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required className="formControl" fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input id="password" type="password" onChange={this.passwordChangeHandler} />
                            <FormHelperText className={this.state.passwordRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl><br /><br />
                        {/**
                         * Error Text message if in case the provided username/password doesn't match with valid
                         * credentials
                         */}
                        <FormHelperText className={this.state.incorrectUsernamePassword}>
                            <span className="red">Incorrect username and/or password</span>
                        </FormHelperText>
                        <br />
                        {/**
                         * Login Button for the Login Card which on clicked validates the inputs and redirects
                         * to Home page after successful authentication
                         */}
                        <Button variant="contained" color="primary" onClick={this.loginClickHandler}>Login</Button>
                    </CardContent>
                </Card>
            </div>

        );
    }
}

export default Login;