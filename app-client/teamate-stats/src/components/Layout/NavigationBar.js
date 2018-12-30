import React, { Component } from "react";
import { Button } from "antd";
import { NavLink } from "react-router-dom";
import decode from "jwt-decode";

const checkAuth = () => {
  const token = localStorage.getItem("AUTH_TOKEN");
  // const refreshToken = localStorage.getItem('refreshToken');
  // if (!token || !refreshToken) return false;
  if (!token) return false;
  try {
    const { exp } = decode(token);
    if (exp < new Date().getTime() / 1000) return false;
  } catch (e) {
    return false;
  }
  return true;
};

class NavigationBar extends Component {
  render() {
    return (
      <div>
        <header className="site-header">
          <div className="container">
            <nav className="nav nav--inline">
              <div id={"navlinks"}>
                <img
                  src={require("../../images/league-of-legends.svg")}
                  alt=""
                />
                <NavLink className={"navlinks-li"} to="/">
                  TeamMate
                </NavLink>
                <NavLink
                  className={"navlinks-li navlinks-li-space"}
                  to="/summoners"
                >
                  Summoners
                </NavLink>
                {checkAuth() ? (
                  <NavLink
                    className={"navlinks-li navlinks-li-space"}
                    to="/account"
                  >
                    Account
                  </NavLink>
                ) : (
                  <div> </div>
                )}
              </div>
              <div>
                {checkAuth() ? (
                  <div> </div>
                ) : (
                  <div>
                    <Button ghost href="/login">
                      Log in
                    </Button>
                    <Button ghost href="/signup" className={"auth-btn"}>
                      Sign up
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </header>

        <hr />
      </div>
    );
  }
}

export default NavigationBar;
