import { DID } from "dids";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { getResolver as get3IDResolver } from "@ceramicnetwork/3id-did-resolver";
import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { createDefinition, publishSchema } from "@ceramicstudio/idx-tools";

async function authenticateWithEthereum() {
  try {
    const { ethereum } = window;
    let ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
    let threeID = new ThreeIdConnect();
    // Request accounts from the Ethereum provider
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    // Create an EthereumAuthProvider using the Ethereum provider and requested account
    const authProvider = new EthereumAuthProvider(ethereum, accounts[0]);
    // Connect the created EthereumAuthProvider to the 3ID Connect instance so it can be used to
    // generate the authentication secret
    await threeID.connect(authProvider);

    const did = new DID({
      // Get the DID provider from the 3ID Connect instance
      provider: threeID.getDidProvider(),
      resolver: {
        ...get3IDResolver(ceramic),
        ...getKeyResolver(),
      },
    });
    // Authenticate the DID using the 3ID provider
    await did.authenticate();
    ceramic.did = did;
    return ceramic;
  } catch (e) {
    console.log("Error : ", e);
  }
}

const HasMateProfileSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "HashmateProfile",
  type: "object",
  properties: {
    sessions: {
      type: "array",
      title: "sessions",
      items: {
        type: "object",
        title: "session",
        properties: {
          id: {
            $ref: "#/definitions/CeramicStreamId",
          },
          name: {
            type: "string",
            title: "name",
            maxLength: 500,
          },
        },
      },
    },
  },
  definitions: {
    CeramicStreamId: {
      type: "string",
      pattern: "^ceramic://.+(\\\\?version=.+)?",
      maxLength: 150,
    },
  },
};

const passwordStoreSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "passwordStore",
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "name",
      maxLength: 20,
    },
    cid: {
      type: "string",
      title: "cid",
    },
    link: {
      type: "string",
      title: "link",
      maxLength: 2000,
    },
    timestamp: {
      type: "string",
      title: "timestamp",
      maxLength: 2000,
    },
    encSecret: {
      type: "string",
      title: "encSecret",
    },
  },
};

const createSchmeaDocument = async (ceramic, schema) => {
  const doc = await TileDocument.create(ceramic, schema);
  return doc.commitId;
};

export const run = async () => {
  const ceramic = await authenticateWithEthereum();
  const sessionSchemaId = await createSchmeaDocument(
    ceramic,
    passwordStoreSchema
  );
  console.log({ sessionSchemaId: sessionSchemaId.toString() });

  const profileSchema = await publishSchema(ceramic, {
    content: HasMateProfileSchema,
  });
  const sessionsDefinition = await createDefinition(ceramic, {
    name: "sessions",
    description: "Hashmate session",
    schema: profileSchema.commitId.toUrl(),
  });

  const config = {
    definitions: {
      HashmateProfile: sessionsDefinition.id.toString(),
    },
    schemas: {
      profile: profileSchema.commitId.toUrl(),
    },
  };

  console.log({ config });
};
