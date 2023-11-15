import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';


//bools to allow for acc creation
let userLength = true;
let userAvailable = true;
let passProper = true;
let passMatch = true;

let LoginInfo = [ /*array of usernames and passwords for testing, will reroute to use the database of user info instead later*/
    {
        Username : "User1",
        Password : "Password1"
    },
    {
        Username : "User2",
        Password : "Password2"
    },
    {
        Username : "User3",
        Password : "Password3"
    },
];
function toggleOn(value, id){
    var text = document.getElementById(id);
    if(value){
        text.style.display = "block";
    }else{
        text.style.display = "none";
    }
}

function register(username, password) {
    LoginInfo.push({ Username: username, Password: password });
}


const LoginPage = () => {
    const [UsernameTerm, setUsernameTerm] = useState('');
    const [PasswordTerm, setPasswordTerm] = useState('');
    const [newUsernameTerm, setNewUsernameTerm] = useState('');
    const [newPasswordTerm1, setNewPasswordTerm1] = useState('');
    const [newPasswordTerm2, setNewPasswordTerm2] = useState('');

    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        const username = e.target.value;
        setUsernameTerm(username);
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPasswordTerm(password);
    };

    const handleNewUsername = (e) => {
        const newUsername = e.target.value;
        setNewUsernameTerm(newUsername);
        if (newUsername.length < 4) {
            toggleOn(true, "bad_user");
            //disable acc creation (all params must be true to allow acc creation)
            userLength = false;
        }else{
            toggleOn(false, "bad_user");
            //enable acc creation
            userLength = true;
        }

        const checkUser = LoginInfo.filter((credentials) =>
            credentials.Username === (newUsername)
        );

        if(checkUser.length > 0 && newUsername.length >= 4){
            toggleOn(true,"unavailable_user");
            //disable acc creation (all params must be true to allow acc creation)
            userAvailable = false;
        }else{
            toggleOn(false, "unavailable_user");
            //enable acc creation
            userAvailable = true;
        }
    };

    const handleNewPassword1 = (e) => {
        const newPassword = e.target.value;
        setNewPasswordTerm1(newPassword);
        //active check a usaable password (length, can add other requirements like numbers and/or special char later)
        if(newPassword.length < 7){
            toggleOn(true, "bad_pass");
            //disable acc creation (all params must be true to allow acc creation)
            passProper = false;
        }else{
            toggleOn(false, "bad_pass");
            //enable acc creation
            passProper = true;
        }
    };

    const handleNewPassword2 = (e) => {
        const newConfirmPassword = e.target.value;
        setNewPasswordTerm2(newConfirmPassword);
        if (newConfirmPassword != newPasswordTerm1) {
            toggleOn(true, "missmatch_pass");
            //disable acc creation (all params must be true to allow acc creation)
            passMatch = false;
        }else{
            toggleOn(false, "missmatch_pass");
            //enable acc creation
            passMatch = true;
        }
    };

    const AddUser = () => {
        if(newUsernameTerm != "" && newPasswordTerm1 != "" && userLength && userAvailable && passProper && passMatch){
            register(newUsernameTerm, newPasswordTerm1);
            SwitchToLogin();
        }else{
            toggleOn(true, "failed_creation");
        }

        //redirect back to a fresh login page to ensure login

    }

    const ResetFields = () => {
        setUsernameTerm('');
        setPasswordTerm('');
        setNewUsernameTerm('');
        setNewPasswordTerm1('');
        setNewPasswordTerm2('');
        toggleOn(false, "bad_credentials_user");
        toggleOn(false, "bad_credentials_pass");
        toggleOn(false, "unavailable_user");
        toggleOn(false, "bad_user");
        toggleOn(false, "bad_pass");
        toggleOn(false, "missmatch_pass");
        toggleOn(false, "failed_creation");
    }

    const SwitchToMakeAccount = () => {
        toggleOn(false, "login");
        toggleOn(true, "make_account");
        //reset everything
    }

    const SwitchToLogin = () => {
        toggleOn(false, "make_account");
        toggleOn(true, "login");
        //reset everything
        ResetFields();
    }

    const LoginCheck = () => {
        console.log(UsernameTerm);
        console.log(PasswordTerm);
        //replace LoginInfo with the database holding users login info
        const checkCred = LoginInfo.filter((credentials) =>
            credentials.Username === (UsernameTerm) &&
            credentials.Password === (PasswordTerm)
        );

        if(checkCred.length > 0 && UsernameTerm.length > 0 && PasswordTerm.length > 0){//username and password found
            //success
            console.log("Working Login");
            navigate('/')
        }else{

            const checkUser = LoginInfo.filter((credentials) => 
            credentials.Username === (UsernameTerm)
            );

            if(checkUser <= 0 || UsernameTerm.length <= 0){
                console.log("User on");
                toggleOn(true, "bad_credentials_user");
            }else{
                console.log("User off");
                toggleOn(false, "bad_credentials_user");
            }
            if(UsernameTerm != ""){
                const checkPass = LoginInfo.filter((credentials) => 
                credentials.Username === (UsernameTerm) &&
                credentials.Password === (PasswordTerm)
                );

                if(checkPass <= 0 || PasswordTerm.length <= 0){
                    console.log("Pass on");
                    toggleOn(true, "bad_credentials_pass");
                }else{
                    console.log("pass off");
                    toggleOn(false, "bad_credentials_pass");
                }
            }
            console.log("Bad Login Credentials");
        }

    };
return(
    <div className="login-page-container">
        <div id="login" class="login-container">
            <label for="">Username</label>
            <div className="username-container">
                <input
                type="text"
                placeholder="Username"
                value={UsernameTerm}
                onChange={handleUsernameChange}
                />
            </div>
            <label for="">Password</label>
            <div className="password-container">
                <input
                type="password"
                placeholder="Password"
                value={PasswordTerm}
                onChange={handlePasswordChange}
                />
            </div>
            <p id="bad_credentials_user" class="bad_credentials">Invalid Username</p>
            <p id="bad_credentials_pass" class="bad_credentials">Invalid Password</p>
            
            <button className="login-button" onClick={LoginCheck}>Login</button>
            
            <button className="switch-make-account-button" onClick={SwitchToMakeAccount}>Don't Have An Account?</button>
        </div>

        <div id="make_account" class="make-account-container">
            <label for="">Username</label>
            <div className="new-username-container">
                <input
                type="text"
                placeholder="Username"
                value={newUsernameTerm}
                onChange={handleNewUsername}
                />
            </div>
            <label for="">Password</label>
            <div className="new-password-1-container">
                <input
                type="password"
                placeholder="Password"
                value={newPasswordTerm1}
                onChange={handleNewPassword1}
                />
            </div>
            <label for="">Confirm Password</label>
            <div className="new-password-2-container">
                <input
                type="password"
                placeholder="Confirm Password"
                value={newPasswordTerm2}
                onChange={handleNewPassword2}
                />
            </div>
            <p id="unavailable_user" class="bad_credentials">Username Unavailable</p>
            <p id="bad_user" class="bad_credentials">Username Must Be 4 Or More Characters Long</p>
            <p id="bad_pass" class="bad_credentials">Password Must Be 7 Or More Characters Long</p>
            <p id="missmatch_pass" class="bad_credentials">Passwords Do Not Match</p>

            <p id="failed_creation" class="bad_credentials">Failed To Create Account</p>
            
            <button className="create-account-button" onClick={AddUser}>Create Account</button>

            <button className="switch-login-button" onClick={SwitchToLogin}>Already Have An Account?</button>
        </div> 
    </div>
    /*
    <div class="container">
        <form class="form" id="login">
            <h1 class="form__title">Login</h1>
            <div class="form__message form__message--error">Incorrect username or password combination</div>
            <div class="form__input-group">
                <input type="text" class="form__input" autofocus placeholder="Username"></input>
                <div class="form__input-error-message"></div>
            </div>
            <div class="form__input-group">
                <input type="password" class="form__input" autofocus placeholder="Password"></input>
                <div class="form__input-error-message"></div>
            </div>
            <button class="form__button" type="submit">Continue</button>
            <p class="form__text">
                <a href="#" class="form__link">Forgot your password?</a>
            </p>
            <p class="form__text">
                <a class="form__link" href="./" id="linkCreateAccount">Don't have an account? Create account</a>
            </p>
        </form>
        <form class="form form--hidden" id="createAccount">
            <h1 class="form__title">Create Account</h1>
            <div class="form__message form__message--error"></div>
            <div class="form__input-group">
                <input type="text" id="signupUsername" class="form__input" autofocus placeholder="Username"></input>
                <div class="form__input-error-message"></div>
            </div>
            <div class="form__input-group">
                <input type="text" class="form__input" autofocus placeholder="Email Address">
                <div class="form__input-error-message"></div>
            </div>
            <div class="form__input-group">
                <input type="password" class="form__input" autofocus placeholder="Password"></input>
                <div class="form__input-error-message"></div>
            </div>
            <div class="form__input-group">
                <input type="password" class="form__input" autofocus placeholder="Confirm password"></input>
                <div class="form__input-error-message"></div>
            </div>
            <button class="form__button" type="submit">Continue</button>
            <p class="form__text">
                <a class="form__link" href="./" id="linkLogin">Already have an account? Sign in</a>
            </p>
        </form>
    </div>
    */
);
}

export default LoginPage;