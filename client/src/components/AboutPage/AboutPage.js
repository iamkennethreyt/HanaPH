import React, { Component } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import { confirmAlert } from "react-confirm-alert"; // Import

class AboutPAge extends Component {
  state = {
    message: ""
  };
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div className="p-2 mt-5">
        <div className="text-center text-black-50 mt-5">
          <h2 className="font-weight-bold">
            Contact <span className="text-default">Us</span>
          </h2>
        
          
          <form
            className="text-center border border-light p-2"
            onSubmit={e => {
              e.preventDefault();
              Axios.post("/api/advertisements/sendemailtoadmin", {
                message: this.state.message,
                email: this.props.auth.user.email
              }).then(res => {
                confirmAlert({
                  message:
                    "You had successfully send message to the HanaPH developers",
                  buttons: [
                    {
                      label: "Ok"
                    }
                  ]
                });
                console.log(res.data);
              });
            }}
          >
            <p className="h4 mb-4">Send us a message</p>
             
        <p className="text-left">
           From
           </p>
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Your Email"
              name="email"
              defaultValue={this.props.auth.user.email}
              disabled
            />

            <textarea
              rows="3"
              placeholder="your message"
              className="form-control mt-2"
              name="message"
              onChange={e => this.setState({ message: e.target.value })}
            />

            <button className="btn teal darken-2 btn-block mt-2" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(AboutPAge));
