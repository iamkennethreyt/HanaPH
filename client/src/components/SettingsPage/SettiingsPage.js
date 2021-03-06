import React, { Component } from "react";

import PropTypes from "prop-types";
import classnames from "classnames";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import

import { getCurrentUser, updateCurrentUser } from "../../actions/usersActions";

class RegisterApplicant extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      contactInfo: "",
      cityProvince: "",
      completeAddress: "",
      details: "",
      errors: {},
      selectedFile: ""
    };
  }

  onSuccess = () => {
    confirmAlert({
      message: "You had successfully updated your account",
      buttons: [
        {
          label: "Ok"
        }
      ]
    });
  };

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  componentDidMount() {
    this.props.getCurrentUser();
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.currentUser) {
      const {
        name,
        email,
        contactInfo,
        cityProvince,
        completeAddress,
        details
      } = nextProps.currentUser;
      this.setState({
        name,
        email,
        contactInfo,
        cityProvince,
        completeAddress,
        details
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const data = {
      name: this.state.name,
      email: this.state.email,
      contactInfo: this.state.contactInfo,
      cityProvince: this.state.cityProvince,
      completeAddress: this.state.completeAddress,
      details: this.state.details
    };

    this.props.updateCurrentUser(data, this.onSuccess);
  };
  render() {
    // console.log(this.props.currentUser.resume);
    const { errors } = this.state;
    return (
      <div className="p-2 mt-5 mb-5">
        <form className="border border-light p-2 pb-2" onSubmit={this.onSubmit}>
          <p className="h4 mb-4">Profile Settings</p>

          {this.props.auth.user.type === "Applicant" ? (
            <input
              type="text"
              className={classnames("form-control mt-2", {
                "is-invalid": errors.name
              })}
              placeholder="Full name"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
            />
          ) : (
            <input
              type="text"
              className={classnames("form-control mt-2", {
                "is-invalid": errors.name
              })}
              placeholder="Company Name"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
            />
          )}

          <input
            disabled
            type="email"
            className={classnames("form-control mt-2", {
              "is-invalid": errors.email
            })}
            placeholder="Email Address"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
          />

          <input
            type="text"
            className={classnames("form-control mt-2", {
              "is-invalid": errors.contactInfo
            })}
            placeholder="Phone Number"
            name="contactInfo"
            value={this.state.contactInfo}
            onChange={this.onChange}
          />

          <div className="form-group mt-2">
            <select
              id="cityProvince"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.cityProvince
              })}
              name="cityProvince"
              value={this.state.cityProvince}
              onChange={this.onChange}
            >
              <option hidden>City/Province</option>
              {["Cebu", "Bohol", "Samar", "Leyte", "Manila", "davao"].map(
                option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>

          {this.props.auth.user.type === "applicant" ? (
            <textarea
              rows="3"
              placeholder="Complete address"
              className={classnames("form-control mt-2", {
                "is-invalid": errors.completeAddress
              })}
              name="completeAddress"
              value={this.state.completeAddress}
              onChange={this.onChange}
            />
          ) : (
            <div>
              <textarea
                rows="3"
                placeholder="Company complete address"
                className={classnames("form-control mt-2", {
                  "is-invalid": errors.completeAddress
                })}
                name="completeAddress"
                value={this.state.completeAddress}
                onChange={this.onChange}
              />
              <textarea
                rows="3"
                placeholder="Company Details"
                className={classnames("form-control mt-2", {
                  "is-invalid": errors.details
                })}
                name="details"
                value={this.state.details}
                onChange={this.onChange}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-block mt-2 teal darken-2  waves-effect"
          >
            Save
          </button>

          <Link
            to="/"
            className="btn btn-block mt-2 btn-outline-default waves-effect"
          >
            Cancel
          </Link>

          <Link
            to="/settings/password"
            className="btn btn-block mt-2 teal darken-2 waves-effect"
          >
            Password Settings
          </Link>
        </form>

        {this.props.auth.user.type === "applicant" ? (
          <div className="">
            {this.props.currentUser.resume !== "nothing" ? (
              <button
                className="btn btn-block mt-2 btn-outline-default waves-effect"
                onClick={() => {
                  confirmAlert({
                    message: "Are you sure do you want to delete your resume?",
                    buttons: [
                      {
                        label: "Ok",
                        onClick: () =>
                          axios.delete("/api/users/deleteresume").then(() => {
                            window.location.reload();
                          })
                      },
                      {
                        label: "Cancel"
                      }
                    ]
                  });
                }}
              >
                Delete Current Resume
              </button>
            ) : (
              <form
                className="mb-5 p-1"
                encType="multipart/form-data"
                onSubmit={e => {
                  e.preventDefault();

                  const formData = new FormData();
                  formData.append(
                    "file",
                    this.state.selectedFile,
                    this.state.selectedFile.name
                  );
                  axios
                    .post("/api/users/upload", formData, {
                      headers: {
                        "Content-Type": "multipart/form-data"
                      }
                    })
                    .then(() => {
                      // import { confirmAlert } from "react-confirm-alert"; // Import
                      confirmAlert({
                        message: "You had successfully update your resume",
                        buttons: [
                          {
                            label: "Ok",
                            onClick: () => window.location.reload()
                          }
                        ]
                      });
                    })
                    .catch(err => {
                      confirmAlert({
                        message: "You have not selected resume yet",
                        buttons: [
                          {
                            label: "Ok"
                          }
                        ]
                      });
                    });
                }}
              >
                <p className="text-center">RESUME</p>
                <div className="custom-file">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="custom-file-input"
                    onChange={this.handleselectedFile}
                  />
                  <label htmlFor="file" className="custom-file-label">
                    Choose your Resume
                  </label>
                </div>
                <input
                  type="submit"
                  value="Upload Resume"
                  className="btn mt-1 teal darken-2 btn-block"
                />
              </form>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

RegisterApplicant.protoTypes = {
  getCurrentUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  updateCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  currentUser: state.users.currentUser
});

export default connect(
  mapStateToProps,
  { getCurrentUser, updateCurrentUser }
)(withRouter(RegisterApplicant));
