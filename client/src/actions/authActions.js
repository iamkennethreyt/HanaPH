import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, GET_CURRENT_USER } from "./types";

//Register Applicant
export const registerApplicant = (userdata, history, onSuccess) => dispatch => {
  axios
    .post("/api/users/register", userdata)
    .then(res => {
      history.push("/");
      onSuccess();
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Register Employer
export const registerEmployer = (userdata, history, onSuccess) => dispatch => {
  axios
    .post("/api/users/register", userdata)
    .then(res => {
      history.push("/");
      onSuccess();
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//Login User
export const loginUser = (userdata, history) => dispatch => {
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

      history.push("/home");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//get current
export const getCurrentUser = () => dispatch => {
  axios
    .get("/api/users/login")
    .then(res => {
      dispatch({
        type: GET_CURRENT_USER,
        payload: res.data
      });
    })
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
export const logoutUser = history => dispatch => {
  //remove token from localstorage
  localStorage.removeItem("jwtToken");
  window.location.href = "/";
  //remove auth header for future requests
  setAuthToken(false);

  //set current user to {} which will set isAuthenticated is false
  dispatch(setCurrentUser({}));
};
