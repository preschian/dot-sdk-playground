import {
  dot,
  dot_asset_hub,
  dot_people,
  ksm,
  ksm_asset_hub,
  ksm_people,
  pas,
  pas_asset_hub,
  pas_people,
  IdentityData,
} from "@polkadot-api/descriptors";
import { Binary, createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";

// polkadot
const dotClient = createClient(getWsProvider("wss://dot-rpc.stakeworld.io"));
const dotApi = dotClient.getTypedApi(dot);
const dotAssetHubClient = createClient(getWsProvider("wss://dot-rpc.stakeworld.io/assethub"));
const dotAssetHubApi = dotAssetHubClient.getTypedApi(dot_asset_hub);
const dotPeopleClient = createClient(getWsProvider("wss://dot-rpc.stakeworld.io/people"));
const dotPeopleApi = dotPeopleClient.getTypedApi(dot_people);

// kusama
const ksmClient = createClient(getWsProvider("wss://ksm-rpc.stakeworld.io"));
const ksmApi = ksmClient.getTypedApi(ksm);
const ksmAssetHubClient = createClient(getWsProvider("wss://ksm-rpc.stakeworld.io/assethub"));
const ksmAssetHubApi = ksmAssetHubClient.getTypedApi(ksm_asset_hub);
const ksmPeopleClient = createClient(getWsProvider("wss://ksm-rpc.stakeworld.io/people"));
const ksmPeopleApi = ksmPeopleClient.getTypedApi(ksm_people);

// paseo
const pasClient = createClient(getWsProvider("wss://pas-rpc.stakeworld.io"));
const pasApi = pasClient.getTypedApi(pas);
const pasAssetHubClient = createClient(getWsProvider("wss://pas-rpc.stakeworld.io/assethub"));
const pasAssetHubApi = pasAssetHubClient.getTypedApi(pas_asset_hub);
const pasPeopleClient = createClient(getWsProvider("wss://pas-rpc.stakeworld.io/people"));
const pasPeopleApi = pasPeopleClient.getTypedApi(pas_people);

await Promise.all([
  dotApi.compatibilityToken,
  dotAssetHubApi.compatibilityToken,
  dotPeopleApi.compatibilityToken,
  ksmApi.compatibilityToken,
  ksmAssetHubApi.compatibilityToken,
  ksmPeopleApi.compatibilityToken,
  pasApi.compatibilityToken,
  pasAssetHubApi.compatibilityToken,
  pasPeopleApi.compatibilityToken,
]);

const ADDRESS = "16JGzEsi8gcySKjpmxHVrkLTHdFHodRepEz8n244gNZpr9J";

const identityDataToString = (data: IdentityData | undefined) => {
  if (!data || data.type === "None" || data.type === "Raw0") return null;
  if (data.type === "Raw1") return Binary.fromBytes(new Uint8Array(data.value)).asText();
  return data.value.asText();
};

export async function getData(chain = "polkadot") {
  let api, client, assetHubApi, peopleApi;

  if (chain === "polkadot") {
    api = dotApi;
    client = dotClient;
    assetHubApi = dotAssetHubApi;
    peopleApi = dotPeopleApi;
  } else if (chain === "kusama") {
    api = ksmApi;
    client = ksmClient;
    assetHubApi = ksmAssetHubApi;
    peopleApi = ksmPeopleApi;
  } else if (chain === "paseo") {
    api = pasApi;
    client = pasClient;
    assetHubApi = pasAssetHubApi;
    peopleApi = pasPeopleApi;
  }

  if (!api || !client || !assetHubApi || !peopleApi) {
    throw new Error("Invalid chain");
  }

  const [account, nfts, identity] = await Promise.all([
    api.query.System.Account.getValue(ADDRESS),
    assetHubApi.query.Nfts.Account.getEntries(ADDRESS),
    chain !== "paseo" ? peopleApi.query.Identity.IdentityOf.getValue(ADDRESS) : null,
  ]);

  const chainSpec = await client.getChainSpecData();
  const tokenDecimals = chainSpec.properties.tokenDecimals;

  const name = identityDataToString(identity?.info.display) ?? ADDRESS;
  const freeBalance = Number(account.data.free) / Math.pow(10, tokenDecimals);

  console.log(chain, name, freeBalance, nfts.length);
  return { name, freeBalance, nfts: nfts.length };
}

// console.clear();
// await getData("polkadot");
// await getData("kusama");
// await getData("paseo");
