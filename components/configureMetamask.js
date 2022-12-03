import { ethers } from "ethers";

export const firstFunc = async (setCurrentAccount, setMetamaskConnected) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const _signer = await provider.getSigner();
  const accounts = await provider.listAccounts();
  if (accounts.length > 0) {
    setCurrentAccount(accounts[0]);
    setMetamaskConnected(true);
  } else {
    setMetamaskConnected(false);
  }
};

export const connectMetamask = async (setMetamaskConnected) => {
  await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .then((_) => {
      setMetamaskConnected(true);
    })
    .catch((err) => {
      console.log(err);
      setMetamaskConnected(false);
    });
};

export const checkMetamaskStatus = (
  setMetamaskConnected,
  setCurrentAccount
) => {
  const accountChanged = (accounts) => {
    // when account changed
    setCurrentAccount(accounts[0] ? accounts[0] : "");
    console.log(accounts[0], "account changed");
    if (!accounts.length) {
      setMetamaskConnected(false);
    }
  };
  const disconnectAccount = () => {
    // handle when metamask disconnects
    setCurrentAccount("");
    console.log("disconnected account");
    setMetamaskConnected(false);
  };
  const connected = async () => {
    // when metamask connects
    const changedAccounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(changedAccounts[0]);
    console.log("connected");
    setMetamaskConnected(true);
  };
  window.ethereum.on("disconnect", disconnectAccount);
  window.ethereum.on("accountsChanged", accountChanged);
  window.ethereum.on("connect", connected);
  return () => {
    window.ethereum.off("disconnect", disconnectAccount);
    window.ethereum.off("accountsChanged", accountChanged);
    window.ethereum.off("connect", connected);
  };
};
