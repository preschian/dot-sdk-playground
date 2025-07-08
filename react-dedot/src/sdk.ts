import { DedotClient, WsProvider } from "dedot";
import type {
  PolkadotApi,
  PolkadotAssetHubApi,
  PolkadotPeopleApi,
  KusamaApi,
  KusamaAssetHubApi,
  KusamaPeopleApi,
  PaseoApi,
  PaseoAssetHubApi,
  PaseoPeopleApi,
} from "@dedot/chaintypes";
import { hexToString } from "dedot/utils";
import type { PalletIdentityRegistration } from "@dedot/chaintypes/polkadot-people";

function apiInterface(chain = "polkadot") {
  if (chain === "kusama") {
    return {
      api: DedotClient.new<KusamaApi>(new WsProvider("wss://ksm-rpc.stakeworld.io")),
      assetHubApi: DedotClient.new<KusamaAssetHubApi>(new WsProvider("wss://ksm-rpc.stakeworld.io/assethub")),
      peopleApi: DedotClient.new<KusamaPeopleApi>(new WsProvider("wss://ksm-rpc.stakeworld.io/people")),
    }
  } else if (chain === "paseo") {
    return {
      api: DedotClient.new<PaseoApi>(new WsProvider("wss://pas-rpc.stakeworld.io")),
      assetHubApi: DedotClient.new<PaseoAssetHubApi>(new WsProvider("wss://pas-rpc.stakeworld.io/assethub")),
      peopleApi: DedotClient.new<PaseoPeopleApi>(new WsProvider("wss://pas-rpc.stakeworld.io/people")),
    }
  }

  return {
    api: DedotClient.new<PolkadotApi>(new WsProvider("wss://dot-rpc.stakeworld.io")),
    assetHubApi: DedotClient.new<PolkadotAssetHubApi>(new WsProvider("wss://dot-rpc.stakeworld.io/assethub")),
    peopleApi: DedotClient.new<PolkadotPeopleApi>(new WsProvider("wss://dot-rpc.stakeworld.io/people")),
  }
}

const ADDRESS = "16JGzEsi8gcySKjpmxHVrkLTHdFHodRepEz8n244gNZpr9J";

const identityDataToString = (data: PalletIdentityRegistration | undefined | null) => {
  if (data?.info.display.type !== "Raw") return undefined;

  const display = data.info.display.value;
  return typeof display === "string" ? display : hexToString(display);
};

export async function getData(chain = "polkadot", address?: string) {
  const targetAddress = address?.trim() || ADDRESS;
  const selected = apiInterface(chain)
  const api = await selected.api
  const assetHubApi = await selected.assetHubApi
  const peopleApi = await selected.peopleApi

  if (!api || !assetHubApi || !peopleApi) {
    throw new Error("Invalid chain");
  }

  const [account, nfts, identity] = await Promise.all([
    api.query.system.account(targetAddress),
    assetHubApi.query.nfts.account.entries(targetAddress),
    chain !== "paseo" ? peopleApi.query.identity.identityOf(targetAddress) : null,
  ]);

  const chainSpec = await api.chainSpec.properties();
  const tokenDecimals = Number(chainSpec.tokenDecimals ?? 12);

  const name = identityDataToString(identity) ?? targetAddress;
  const freeBalance = Number(account.data.free ?? 0) / Math.pow(10, tokenDecimals);

  console.log(chain, name, freeBalance, nfts.length);
  return { name, freeBalance, nfts: nfts.length };
}

// console.clear();
// await getData("polkadot");
// await getData("kusama");
// await getData("paseo");
