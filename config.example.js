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

  //// API CONFIG ////
  // The RPC endpoint to query and send Stargaze transactions to
  rpcEndpoint: 'https://rpc.big-bang-1.stargaze-apis.com/',
  // NFT.storage endpoint
  nftStorageEndpoint: 'https://api.nft.storage',
  // NFT.storage API key
  nftStorageApiKey: '',
  // Pinata API Key (optional)
  pinataApiKey: '',
  // Pinata Secret Key (optional)
  pinataSecretKey: '',

  //// COLLECTION INFO ////
  // The name of your collection
  name: 'Collection Name',
  // The 3-7 letter ticker symbol for your collection
  symbol: 'SYM',
  // Project description
  description: 'An awesome NFT series',
  // Path to image to use as the main image for the collection
  // (at least 500 x 500 pixels)
  image: 'images/1.png',
  // The URI containing JSON metadata about your contract
  // Please follow: https://docs.opensea.io/docs/contract-level-metadata
  contractUri: 'ipfs://...',

  //// WHITELIST CONTRACT (OPTIONAL) ////
  // A list of whitelisted addresses that will be able to purchase the sale early
  // Comment out if not using a whilelist
  // whitelist: ['stars1..', 'stars1...'],
  // The date when the whitelist only purchasing period ends and everyone can buy
  // whitelistStartTime: '02 Mar 2022 22:00:00 GMT',
  // whitelistEndTime: '02 Mar 2022 22:00:00 GMT',
  // The price (in STARS) for the whitelist (minimum 25 STARS)
  // whitelistPrice: 50,
  // The Per Address Limit during whitelist period this can be different than the main public limit
  // whitelistPerAddressLimit: 1,
  // The contract address for your whitelist contract
  // Get this after running `yarn run whitelist`
  // whitelistContract: 'stars1...',

  //// MINTER CONTRACT ////
  // The base URI to be used to programatically mint tokens
  baseTokenUri: 'ipfs://...',
  // The number of tokens to mint
  numTokens: 100,
  // The price (in STARS) for your NFTs (minimum 50 STARS)
  unitPrice: 100,
  // The address for royalites to go to (may be the same as `account`)
  // Comment out both below if not using royalites
  royaltyPaymentAddress: 'stars1...',
  // Royalty share: 1 = 100%, 0.1 = 10%
  royaltyShare: '0.1',
  // The date when the sale goes live
  // If whitelist is enabled, only whitelisted addresses will be able to purchase
  startTime: '02 Mar 2022 22:00:00 GMT',
  // The minter contract address
  // Get this after running `yarn run minter`
  minter: 'stars1...',
  // SG721 contract address
  // Get this after running `yarn run minter`
  sg721: 'stars1...',

  //// CONTRACT CODE IDs ////
  // The code ID for sg721
  sg721CodeId: 49,
  // The code ID for the minter contract
  minterCodeId: 50,
  // The code ID for the whitelist contract
  whitelistCodeId: 51,
};
