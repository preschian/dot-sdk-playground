import {
    AhkWhitelistEntry,
    AhpWhitelistEntry,
} from "@polkadot-api/descriptors";

// TODO: Add more whitelists for other chains
const assetHubWhitelist: AhkWhitelistEntry[] | AhpWhitelistEntry[] = [
    "query.Nfts.*",
]

export const whitelist = [...assetHubWhitelist]