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
} from "../redux/action";
import { ThreeIdConnect } from "@3id/connect";
import { CeramicClient } from "@ceramicnetwork/http-client";
import utils from "./utils";
import { authenticateWithEthereum, storeOnIpfs, getItems } from "./helpers";

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

  const { objToBlob, unit8ArrayToString } = utils;

  const ceramic = useRef(null);
  const threeid = useRef(null);

  //default
  useEffect(() => {
    firstFunc(changeCurrentAccount, changeMetamaskStatus);
    checkMetamaskStatus(changeMetamaskStatus, changeCurrentAccount);
    changeMetamaskConnectFunction(connectMetamask);
  }, []);

  useEffect(() => {
    if (metamaskStatus && currentAccount) {
      (async () => {
        ceramic.current = new CeramicClient(
          "https://ceramic-clay.3boxlabs.com"
        );
        threeid.current = new ThreeIdConnect();
        await authenticateWithEthereum(currentAccount, threeid, ceramic);
        // run();
        // let obj = { name: "rahul", link: "test.com" };
        // await storeOnIpfs(obj, ceramic);
        await getItems(ceramic);
      })();
    }
  }, [currentAccount]);

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
let obj = { name: "rahul", link: "test.com" };
