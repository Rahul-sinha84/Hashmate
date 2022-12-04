import { TileDocument } from "@ceramicnetwork/stream-tile";
import LitJsSdk, { uint8arrayFromString } from "lit-js-sdk";
import { getFile, fetchFile } from "./web3.storage";

const utils = {
  objToBlob: (obj) => {
    const str = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
      type: "application/json;charset=utf-8",
    });
    return blob;
  },
  unit8ArrayToString: (unit8Array) => {
    let arr = Array.from // if available
      ? Array.from(unit8Array) // use Array#from
      : [].map.call(unit8Array, (v) => v); // otherwise map()
    return JSON.stringify(arr);
  },
  createDocument: async (ceramic, content, schema) => {
    try {
      const doc = await TileDocument.create(ceramic.current, content, {
        schema,
      });
      return doc.id;
    } catch (err) {
      console.log("Error: ", err);
    }
  },
  loadSession: async (id, ceramic) => {
    try {
      return await TileDocument.load(ceramic.current, id);
    } catch (err) {
      console.log(err);
    }
  },
  decryptData: async (encData, _symmetricKey) => {
    try {
      const file = await getFile(encData);
      console.log({ file, fileData: JSON.stringify(file) });
      const data = await fetchFile(`https://ipfs.io/ipfs/${encData}/link.json`);

      // console.log({ data });

      const uint8ArrayFromString = new Uint8Array(JSON.parse(_symmetricKey));

      const decryptedFile = await LitJsSdk.decryptFile({
        file: data,
        symmetricKey: uint8ArrayFromString,
      });
      // console.log(decryptedFile);

      const blob = new Blob([decryptedFile], {
        type: "text/plain;charset=utf-8",
      });

      const jsonFile = JSON.parse(await blob.text());
      return jsonFile;
    } catch (err) {
      console.log(err);
    }
  },
};
export default utils;
