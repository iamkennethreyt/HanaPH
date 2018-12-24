import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

//Register Applicant
export const registerApplicant = (userdata, history) => dispatch => {
  axios
    .post("/api/users/register/applicant", userdata)
    .then(res => history.push("/"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Register Employer
export const registerEmployer = (userdata, history) => dispatch => {
  axios
    .post("/api/users/register/employer", userdata)
    .then(res => history.push("/"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login User
export const loginUser = userdata => dispatch => {
  axios
    .post("/api/users/login", userdata)
    .then(res => {
      //save to local storage
      const { token } = res.data;

      //set token to localstorage
      localStorage.setItem("jwtToken", token);

      //set token to auth header
      setAuthToken(token);

      //decode token to get user data
      const decoded = jwt_decode(token);

      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Change password
export const changePassword = (userdata, history) => dispatch => {
  axios
    .post("/api/users/accountsettings", userdata)
    .then(() => history.push("/"))
    .then(() => alert("SUCCESSFULLY CHANGED THE PASSWORD"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//logout user
export const logoutUser = () => dispatch => {
  //remove token from localstorage
  localStorage.removeItem("jwtToken");

  //remove auth header for future requests
  setAuthToken(false);

  //set current user to {} which will set isAuthenticated is false
  dispatch(setCurrentUser({}));
};
