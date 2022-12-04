import {
  CURRENT_ACCOUNT,
  IS_CERAMIC_AUTHENTICATED,
  LOAD,
  METAMASK_CONNECT_FUNCTION,
  METAMASK_STATUS,
  SHOW_LOADER,
} from "./types";

export const changeCurrentAccount = (payload) => ({
  type: CURRENT_ACCOUNT,
  payload,
});
export const changeLoad = (payload) => ({ type: LOAD, payload });
export const changeMetamaskConnectFunction = (payload) => ({
  type: METAMASK_CONNECT_FUNCTION,
  payload,
});
export const changeMetamaskStatus = (payload) => ({
  type: METAMASK_STATUS,
  payload,
});
export const changeShowLoader = (payload) => ({ type: SHOW_LOADER, payload });
export const changeCeramicAuthenticated = (payload) => ({
  type: IS_CERAMIC_AUTHENTICATED,
  payload,
});
