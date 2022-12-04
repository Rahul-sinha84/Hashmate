import React from "react";
import { connect } from "react-redux";
import { changeMetamaskStatus } from "../redux/action";

const Welcome = ({ state, changeMetamaskStatus }) => {
  const { metamaskConnectFunction } = state;

  return (
    <div className="welcome-page">
      <div className="welcome-page__container">
        <div className="welcome-page__container--header">
          <div className="welcome-page__container--header__title">
            Hashmate, <span>A decentralised password storage !!</span>
          </div>
          <div className="welcome-page__container--header__para">
            Connect to Metamask wallet to continue...
          </div>
        </div>
        <div className="welcome-page__container--body">
          <div className="welcome-page__container--body__btn-container">
            <button
              onClick={() => metamaskConnectFunction(changeMetamaskStatus)}
              className="primary"
            >
              Connect Metamask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps, { changeMetamaskStatus })(Welcome);
