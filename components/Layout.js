import { useEffect, useRef } from "react";
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
  changeShowLoader,
  changeCeramicAuthenticated,
} from "../redux/action";
import { ThreeIdConnect } from "@3id/connect";
import { CeramicClient } from "@ceramicnetwork/http-client";
import utils from "./utils";
import { authenticateWithEthereum, storeOnIpfs, getItems } from "./helpers";
import Welcome from "../pages/Welcome";
import Dashboard from "../pages/Dashboard";
import LoaderModal from "../pages/comp/LoaderModal";

const Layout = ({
  children,
  changeMetamaskConnectFunction,
  changeCurrentAccount,
  changeLoad,
  changeMetamaskStatus,
  changeShowLoader,
  changeCeramicAuthenticated,
  state,
}) => {
  const {
    currentAccount,
    load,
    metamaskStatus,
    metamaskConnectFunction,
    showLoader,
  } = state;

  const { objToBlob, unit8ArrayToString } = utils;

  const ceramic = useRef(null);
  const threeid = useRef(null);

  //default
  useEffect(() => {
    changeShowLoader(true);
    firstFunc(changeCurrentAccount, changeMetamaskStatus);
    checkMetamaskStatus(changeMetamaskStatus, changeCurrentAccount);
    changeMetamaskConnectFunction(connectMetamask);
    changeShowLoader(false);
  }, []);

  useEffect(() => {
    if (metamaskStatus && currentAccount) {
      (async () => {
        changeShowLoader(true);
        ceramic.current = new CeramicClient(
          "https://ceramic-clay.3boxlabs.com"
        );
        threeid.current = new ThreeIdConnect();
        await authenticateWithEthereum(currentAccount, threeid, ceramic);
        changeCeramicAuthenticated(true);
        // run();
        // let obj = { name: "rahul", link: "test.com" };
        // await storeOnIpfs(obj, ceramic);
        // await getItems(ceramic);
        changeShowLoader(false);
      })();
    }
  }, [currentAccount]);

  return (
    <>
      {/* <h1>Hello, Blockchain !!</h1> */}
      {!metamaskStatus ? (
        <Welcome />
      ) : (
        // <button onClick={() => metamaskConnectFunction(changeMetamaskStatus)}>
        //   Connect Metamask
        // </button>
        <>
          <Dashboard ceramic={ceramic} />
          {children}
          {/* <h4>Current account: {currentAccount}</h4> */}
        </>
      )}
      <LoaderModal active={showLoader} />
    </>
  );
};

const mapStateToState = (state) => ({ state });
export default connect(mapStateToState, {
  changeMetamaskConnectFunction,
  changeLoad,
  changeMetamaskStatus,
  changeCurrentAccount,
  changeShowLoader,
  changeCeramicAuthenticated,
})(Layout);
let obj = { name: "rahul", link: "test.com" };
