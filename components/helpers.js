import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { DID } from "dids";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { getResolver as get3IDResolver } from "@ceramicnetwork/3id-did-resolver";
import LitJsSdk, { uint8arrayFromString } from "lit-js-sdk";
import utils from "./utils";
import { storeFile } from "./web3.storage";
import { CERAMIC_SESSION_SCHEMA_ID } from "./constants";
import { IDX } from "@ceramicstudio/idx";
import { config } from "./config.json";

const {
  objToBlob,
  createDocument,
  unit8ArrayToString,
  loadSession,
  decryptData,
} = utils;

export const authenticateWithEthereum = async (
  currentAccount,
  threeid,
  ceramic
) => {
  try {
    const { ethereum } = window;
    const authProvider = new EthereumAuthProvider(ethereum, currentAccount);
    await threeid.current.connect(authProvider);

    const did = new DID({
      provider: threeid.current.getDidProvider(),
      resolver: {
        ...get3IDResolver(ceramic.current),
        ...getKeyResolver(),
      },
    });

    await did.authenticate();
    ceramic.current.did = did;
    console.log("Authenticated !!");
    console.log({ did });
  } catch (err) {
    console.log("Error:", err);
  }
};

export const storeOnIpfs = async (obj, ceramic) => {
  try {
    const blob = objToBlob(obj);
    const { name, link } = obj;

    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({
      file: blob,
    });

    const cid = await storeFile([encryptedFile]);
    console.log({ cid });
    let now = new Date();
    // console.log({ name, link, now });
    const streamId = await createDocument(
      ceramic,
      {
        name,
        link,
        timestamp: `${now}`,
        encSecret: unit8ArrayToString(symmetricKey),
        cid,
      },
      CERAMIC_SESSION_SCHEMA_ID
    );
    console.log({ streamId });

    const idx = new IDX({
      ceramic: ceramic.current,
      aliases: config.definitions,
    });
    const sessions = await idx.get(config.definitions.HashmateProfile);
    console.log({ sessions });
    const _sessions = sessions?.sessions || [];

    await idx.set(config?.definitions?.HashmateProfile, {
      sessions: [
        {
          id: streamId.toUrl(),
          name,
        },
        ..._sessions,
      ],
    });
  } catch (err) {
    console.log(err);
  }
};

export const getItems = async (ceramic) => {
  try {
    const idx = new IDX({
      ceramic: ceramic.current,
      aliases: config.definitions,
    });

    const streams = await idx.get(config?.definitions?.HashmateProfile);
    console.log(streams.sessions);

    streams.sessions.forEach(async (val, ind) => {
      await loadSession(val.id, ceramic).then(async (res) => {
        const data = res.content;
        await decryptData(data.cid, data.encSecret);
      });
    });
  } catch (err) {
    console.log(err);
  }
};
