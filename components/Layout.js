import { useEffect } from "react";
import {
  checkMetamaskStatus,
  connectMetamask,
  firstFunc,
} from "./configureMetamask";

import { connect } from "react-redux";
import {
  changeLoad,
  changeCurrentAccount,
  changeMetamaskConnectFunction,
  changeMetamaskStatus,
} from "../redux/action";

const Layout = ({
  children,
  changeMetamaskConnectFunction,
  changeCurrentAccount,
  changeLoad,
  changeMetamaskStatus,
  state,
}) => {
  const { currentAccount, load, metamaskStatus, metamaskConnectFunction } =
    state;

  //default
  useEffect(() => {
    firstFunc(changeCurrentAccount, changeMetamaskStatus);
    checkMetamaskStatus(changeMetamaskStatus, changeCurrentAccount);
    changeMetamaskConnectFunction(connectMetamask);
  }, []);

  // for updating the change when metamask configuration changes !!
  useEffect(() => {
    // function to update the values of state
    //    getContractData();
    // for listening of events
    //    listenToEvents(contract);
  }, [currentAccount, load]);

  return (
    <>
      <h1>Hello, Blockchain !!</h1>
      {!metamaskStatus ? (
        <button onClick={() => metamaskConnectFunction(changeMetamaskStatus)}>
          Connect Metamask
        </button>
      ) : (
        <>
          {children}
          <h4>Current account: {currentAccount}</h4>
        </>
      )}
    </>
  );
};

const mapStateToState = (state) => ({ state });
export default connect(mapStateToState, {
  changeMetamaskConnectFunction,
  changeLoad,
  changeMetamaskStatus,
  changeCurrentAccount,
})(Layout);
