/*
 * This is the main config for your NFT sale.
 *
 * Fill this out with all your project details.
 */

module.exports = {
  // The account seed phrase to use for deployment
  mnemonic:
    "enlist hip relief stomach skate base shallow young switch frequent cry park",
  // The RPC endpoint to query and send Stargaze transactions to
  rpcEndpoint: "https://rpc.devnet.publicawesome.dev:443",
  // The base URI to be used to programatically mint tokens
  baseTokenURI: "",
  // The number of tokens to mint
  numTokens: 0,
  // The code ID for sg721
  sg721CodeId: 40,
  // The code ID for the minter contract
  minterCodeId: 41,
  // The price (in STARS) for your NFTs
  unitPrice: 1,
  // The name of your collection
  name: "Collection Name",
  // The 3-7 letter ticker symbol for your collection
  symbol: "SYM",
  // Project description
  description: "An awesome NFT series",
  // The URI containing JSON metadata about your contract
  // Please follow: https://docs.opensea.io/docs/contract-level-metadata
  contractURI: "ipfs://...",
  // The creator's STARS address
  creator: "stars1...",
  // The address for royalites to go to (may be the same as creator)
  royaltyAddress: "stars1...",
  // Royalty share: 1 = 100%, 0.1 = 10%
  royaltyShare: 0.5,
  // The date when the sale goes live (if whitelist is enabled, only whitelisted addresses will be able to purchase)
  startTime: "25 Dec 2021 00:00:00 GMT",
  // A list of whitelisted addresses that will be able to purchase the sale early
  whitelist: ["stars1..", "stars1..."],
  // The date when the whitelist only purchasing period ends and everyone can buy
  whitelistEndTime: "26 Dec 2021 00:00:00 GMT",
  // Pinata API Key
  pinataApiKey: "",
  // Pinata Secret Key
  pinataSecretKey: "",
};
