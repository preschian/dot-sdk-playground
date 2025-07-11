import {
  DotWhitelistEntry,
  KsmWhitelistEntry,
  PasWhitelistEntry,
  Dot_asset_hubWhitelistEntry,
  Ksm_asset_hubWhitelistEntry,
  Pas_asset_hubWhitelistEntry,
  Dot_peopleWhitelistEntry,
  Ksm_peopleWhitelistEntry,
  Pas_peopleWhitelistEntry,
} from "@polkadot-api/descriptors";

const dotWhitelist: DotWhitelistEntry[] | KsmWhitelistEntry[] | PasWhitelistEntry[] = ["query.System.Account"];

const assetHubWhitelist: Dot_asset_hubWhitelistEntry[] | Ksm_asset_hubWhitelistEntry[] | Pas_asset_hubWhitelistEntry[] = [
  "query.Nfts.Account",
];

const peopleWhitelist: Dot_peopleWhitelistEntry[] | Ksm_peopleWhitelistEntry[] | Pas_peopleWhitelistEntry[] = [
  "query.Identity.IdentityOf",
];

export const whitelist = [...dotWhitelist, ...assetHubWhitelist, ...peopleWhitelist];
