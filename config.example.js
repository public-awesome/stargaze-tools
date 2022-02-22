/*
 * This is the main config for your NFT sale.
 *
 * Fill this out with all your project details.
 */

module.exports = {
  //// ACCOUNT INFO ////
  // The account seed phrase to use for deployment
  mnemonic:
    'enlist hip relief stomach skate base shallow young switch frequent cry park',
  // Your STARS address
  account: 'stars1...',

  //// COLLECTION INFO ////
  // The name of your collection
  name: 'Collection Name',
  // The 3-7 letter ticker symbol for your collection
  symbol: 'SYM',
  // Project description
  description: 'An awesome NFT series',
  // The URI containing JSON metadata about your contract
  // Please follow: https://docs.opensea.io/docs/contract-level-metadata
  contractUri: 'ipfs://...',

  //// MINTER CONTRACT ////
  // The base URI to be used to programatically mint tokens
  baseTokenUri: '',
  // The number of tokens to mint
  numTokens: 0,
  // The price (in STARS) for your NFTs
  unitPrice: 1,
  // The minter contract address
  // Get this after running `yarn run init`
  minter: 'stars1...',
  // The address for royalites to go to (may be the same as creator)
  royaltyAddress: 'stars1...',
  // Royalty share: 1 = 100%, 0.1 = 10%
  royaltyShare: '0.5',
  // The date when the sale goes live
  // If whitelist is enabled, only whitelisted addresses will be able to purchase
  startTime: '25 Dec 2021 00:00:00 GMT',

  //// WHITELIST CONTRACT ////
  // A list of whitelisted addresses that will be able to purchase the sale early
  whitelist: ['stars1..', 'stars1...'],
  // The date when the whitelist only purchasing period ends and everyone can buy
  whitelistEndTime: '26 Dec 2021 00:00:00 GMT',
  // The contract address for your whitelist contract
  // Get this after running `yarn run whitelist`
  whitelistContract: 'stars1...',

  //// API CONFIG ////
  // The RPC endpoint to query and send Stargaze transactions to
  rpcEndpoint: 'https://rpc.big-bang-1.stargaze-apis.com/',
  // Pinata API Key (optional)
  pinataApiKey: '',
  // Pinata Secret Key (optional)
  pinataSecretKey: '',

  //// CONTRACT CODE IDs ////
  // The code ID for sg721
  sg721CodeId: 4,
  // The code ID for the minter contract
  minterCodeId: 5,
  // The code ID for the whitelist contract
  whitelistCodeId: 6,
};
