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

// TODO: NavLink inside ol
class NavigationBar extends Component {
  render() {
    return (
      <div>
        <header className="site-header">
          <div className="container">
            <nav className="nav nav--inline">
              <div>
                <img
                  src={require("../../images/league-of-legends.svg")}
                  alt=""
                />
                <NavLink
                  style={{
                    fontFamily: "Muli",
                    color: "White",
                    fontSize: "20px"
                  }}
                  to="/"
                >
                  TeamMate
                </NavLink>
                <NavLink
                  style={{
                    fontFamily: "Muli",
                    color: "White",
                    fontSize: "20px",
                    marginLeft: "20px"
                  }}
                  to="/summoners"
                >
                  Summoners
                </NavLink>
                {checkAuth() ? (
                  <NavLink
                    style={{
                      fontFamily: "Muli",
                      color: "White",
                      fontSize: "20px",
                      marginLeft: "20px"
                    }}
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
                    <Button ghost href="/login" style={btnContainer}>
                      Log in
                    </Button>
                    <Button ghost href="/signup" style={btnContainer}>
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

const btnContainer = {
  marginLeft: "1em"
};

export default NavigationBar;
