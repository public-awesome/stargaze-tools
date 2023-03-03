/*
 * This is the main config for your NFT sale.
 *
 * Fill this out with all your project details.
 */

module.exports = {
  //// ACCOUNT INFO ////
  // The account seed phrase to use for deployment
  mnemonic:
    'mixture daring fatigue range piano famous window ranch flock boy property city',
  // Your STARS address
  account: 'stars1...',

  //// API CONFIG ////
  // The RPC endpoint for Stargaze testnet
  rpcEndpoint: 'https://rpc.elgafar-1.stargaze-apis.com/',
  // The RPC endpoint for Stargaze mainnet
  // rpcEndpoint: 'https://rpc.stargaze-apis.com/',
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
  // Link to image to use as the main image for the collection.
  // Either IPFS or valid http links allowed. Gif compatible.
  // (at least 500 x 500 pixels)
  image:
    'ipfs://bafybeigi3bwpvyvsmnbj46ra4hyffcxdeaj6ntfk5jpic5mx27x6ih2qvq/images/1.png',
  // External_link is optional. Gif compatible
  //   external_link:
  // 'https://c.tenor.com/o656qFKDzeUAAAAC/rick-astley-never-gonna-give-you-up.gif',
  // The address for royalties to go to (may be the same as `account`)
  // Comment out both below if not using royalties
  // royaltyPaymentAddress: 'stars1...',
  // Royalty share: 1 = 100%, 0.1 = 10%
  // royaltyShare: '0.1',

  //// WHITELIST CONTRACT (OPTIONAL) ////
  // A list of whitelisted addresses that will be able to purchase the sale early
  // Comment out if not using a whilelist
  // whitelist: ['stars1..', 'stars1...'],
  // The date when the whitelist only purchasing period ends and everyone can buy (in ISO format)
  // whitelistStartTime: '2022-03-11T21:00:00.000Z',
  // whitelistEndTime: '2022-03-13T21:00:00.000Z',
  // The price (in STARS) for the whitelist (minimum 25 STARS)
  // whitelistPrice: 50,
  // The Per Address Limit during whitelist period this can be different than the main public limit
  // whitelistPerAddressLimit: 5,
  // The number of members in the whitelist (max 5000, each 1000 is 100 STARS)
  // whitelistMemberLimit: 100,
  // The contract address for your whitelist contract
  // Get this after running `yarn whitelist`
  // whitelistContract: 'stars1...',

  //// MINTER CONTRACT ////
  // The base URI to be used to programmatically mint tokens
  baseTokenUri: 'ipfs://...',
  // The number of tokens to mint
  numTokens: 100,
  // The price (in STARS) for your NFTs (minimum 50 STARS)
  mintPrice: 100,
  // The max amount of NFTs an address can mint
  perAddressLimit: 1,
  // The date when the sale goes live
  // If whitelist is enabled, only whitelisted addresses will be able to purchase
  // startTime in ISO format
  startTime: '2022-08-11T19:00:00.000Z',
  // The date when secondary sales goes live
  // If this is not enabled a default offset will be used (usually 2 weeks)
  // That is set by governance
  // startTradingTime: '2022-08-11T19:00:00.000Z',
  // The minter contract address
  // Get this after running `yarn minter`
  minter: 'stars1...',
  // SG721 contract address
  // Get this after running `yarn minter`
  sg721: 'stars1...',

  //// CONTRACT CODE IDs: Testnet ////
  // The code ID for sg721_base
  sg721BaseCodeId: 274,
  // The code ID for sg721-updatable
  sg721UpdatableCodeId: 1652,
  // The code ID for base minter
  baseMinterCodeId: 1641,
  // Address for the base factory contract
  baseFactory:
    'stars1vqm5yjmv64ncgtjdue3uxaxaave0gutavsk3szwdzz4flpk5palskdx6pu',
  // The code ID for vending minter
  vendingMinterCodeId: 275,
  // The code ID for updatable vending minter
  updatableVendingMinterCodeId: 1654,
  // Addr for vending factory contract
  vendingFactory:
    'stars1j4qn9krchp5xs8nued4j4vcr4j654wxkhf7acy76734xe5fsz08sku28s2',
  // Addr for updatable vending factory contract
  updatableVendingFactory:
    'stars1csq2m3gpca9syyq386v6rsfq5r3cp8llee9eyx5uj4wcmxcmg98sqx5xzg',
  // The code ID for the whitelist contract
  whitelistCodeId: 277,
  // The marketplace contract address
  //   marketplace:
  //     'stars18cszlvm6pze0x9sz32qnjq4vtd45xehqs8dq7cwy8yhq35wfnn3qgzs5gu',

  // //// CONTRACT CODE IDs: Mainnet ////
  // // The code ID for sg721
  // sg721BaseCodeId: 15,
  // // The code ID for the minter contract
  // vendingMinterCodeId: 16,
  // // Addr for vending factory contract
  // vendingFactory:
  //  'stars15p5xmrj4ryfh39pdvlphdr64kunm4zrvq3p6rku82zlahkn63vtqm3gmpt',
  // // The code ID for the whitelist contract
  // whitelistCodeId: 18,
  // The marketplace contract address
  //   marketplace:
  //       'stars1fvhcnyddukcqfnt7nlwv3thm5we22lyxyxylr9h77cvgkcn43xfsvgv0pl',
};
