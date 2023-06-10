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
  // NFT.storage endpoint
  nftStorageEndpoint: 'https://api.nft.storage',
  // NFT.storage API key
  nftStorageApiKey: '',
  // Pinata API Key (optional)
  pinataApiKey: '',
  // Pinata Secret Key (optional)
  pinataSecretKey: '',

  //// NETWORK CONFIG ////
   // The RPC endpoint for Stargaze testnet
   mainnetRpc: 'https://rpc.stargaze-apis.com/',
   // The RPC endpoint for Stargaze mainnet
   testnetRpc: 'https://rpc.elgafar-1.stargaze-apis.com/',
  // Set this to true if you are using Stargaze mainnet
    mainnet: false, 
  // Names contract address for Stargaze testnet
    testnetNamesContract: 'stars1rgn9tuxnl3ju9td3mfxdl2vm4t8xuaztcdakgtyx23c4ffm97cus25fvjs',
  // Names contract address for Stargaze mainnet
    mainnetNamesContract: 'stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr',

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
  // 'mint_count' is the number of NFTs that can be minted by the address in the flexible whitelist
  // whitelistFlex: [{address: 'stars1...', mint_count: 2}, {address: 'stars1...', mint_count: 1}],
  // The list of admin addresses that can perform actions on the whitelist after its instantiation
  // admins: ['stars1...'],
  // adminsMutable: true,
  // The date when the whitelist only purchasing period ends and everyone can buy (in ISO format)
  // whitelistStartTime: '2023-05-14T21:00:00.000Z',
  // whitelistEndTime: '2023-05-15T21:00:00.000Z',
  // The price (in STARS) for the whitelist (minimum 0 STARS)
  // whitelistPrice: 50,
  // The Per Address Limit during whitelist period this can be different than the main public limit
  // whitelistPerAddressLimit: 5,
  // The number of members in the whitelist (max 5000, each 1000 is 100 STARS)
  // whitelistMemberLimit: 100,
  // The contract address for your whitelist contract
  // Get this after running `yarn whitelist`
  // whitelistContract: 'stars1...',


  //// MINTER CONTRACT Configuration ////
  // The base URI to be used to programmatically mint tokens
  baseTokenUri: 'ipfs://...',
  // The number of tokens to mint
  numTokens: 100,
  // The price (in STARS) for your NFTs (minimum 0 STARS)
  mintPrice: 100,
  // Specify a payment address if different from the account
  paymentAddress: 'stars1...',
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
  sg721BaseCodeId: 2092,
  // The code ID for sg721-updatable
  sg721UpdatableCodeId: 1912,
  // The code ID for base minter
  baseMinterCodeId: 1910,
  // Address for the base factory contract
  baseFactory:
    'stars18kzfpdgx36m95mszchegnk7car4sq03uvg25zeph2j7xg3rk03cs007sxr',
  // The code ID for vending minter
  vendingMinterCodeId: 2091,
  // The code ID for updatable vending minter
  updatableVendingMinterCodeId: 1909,
  // The code ID for vending flexible minter for use with whitelist flexible
  flexibleVendingMinterCodeId: 2080,
  // Addr for vending factory contract
  vendingFactory:
    'stars1ukaladct74um4lhn6eru0d9hdrcqzj3q8sjrfcg7226xey0xc2gsy0gl22',
  // Addr for updatable vending factory contract
  updatableVendingFactory:
    'stars1fnfywcnzzwledr93at65qm8gf953tjxgh6u2u4r8n9vsdv7u75eqe7ecn3',
  // Addr for flexible vending factory contract
  flexibleVendingFactory:
    'stars1gy6hr9sq9fzrykzw0emmehnjy27agreuepjrfnjnlwlugg29l2qqt0yu2j',
  // The code ID for the whitelist contract
  whitelistCodeId: 2093,
  // The code ID for the whitelist flexible contract
  whitelistFlexCodeId: 2005,
  // The marketplace contract address
  //   marketplace:
  //     'stars18cszlvm6pze0x9sz32qnjq4vtd45xehqs8dq7cwy8yhq35wfnn3qgzs5gu',

  // //// CONTRACT CODE IDs: Mainnet ////
  // // The code ID for sg721
  // sg721BaseCodeId: 41,
  // // The code ID for sg721-updatable
  // sg721UpdatableCodeId: 57,
  // // The code ID for base minter
  // baseMinterCodeId: 40,
  // // Address for the base factory contract
  // baseFactory:
  //   'stars1a9hmesdu8ckzrc0k8lp2hsf2r2j23qw7rk864e7h3my53cwtyp8s6d8hw7',
  // // The code ID for the minter contract
  // vendingMinterCodeId: 49,
  // flexibleVendingMinterCodeId: 54,
  // // Addr for vending factory contract
  // vendingFactory:
  //  'stars1yv0xyj44s33r6ccj2l00z336xsm9dwdqegmada37ajxaqr36t77qmcgcej',
  // flexibleVendingFactory:
  //   'stars1gy6hr9sq9fzrykzw0emmehnjy27agreuepjrfnjnlwlugg29l2qqt0yu2j',
  // // The code ID for the whitelist contract
  // whitelistCodeId: 50,
  // whitelistFlexCodeId: 53,
  // The marketplace contract address
  //   marketplace:
  //       'stars1fvhcnyddukcqfnt7nlwv3thm5we22lyxyxylr9h77cvgkcn43xfsvgv0pl',

    // //// SPLITS CONTRACT (OPTIONAL) ////

  // // Mainnet Use  
  // // The code ID for the cw4-group contract
  // cw4GroupCodeId: 26,
  // // The code ID for the splits contract
  // splitsCodeId: 35,

  // // Testnet Use
  // // The code ID for the cw4-group contract
  // cw4GroupCodeId: 1904,
  // // The code ID for the splits contract
  // splitsCodeId: 1905,

  // // This admin can add/remove members from the group (optional)
  // // If not set, the group is immutable forever, so it's best to set this.
  // groupAdmin: 'stars1...',
  // // This admin can control distribution from the splits contract (optional)
  // // If not set, any member of the group can control distribution (recommended)
  // splitsAdmin: 'stars1...',
  // // Members and their weights
  // members: [
  //   { addr: 'stars1...', weight: 90 },
  //   { addr: 'stars1...', weight: 10 },
  // ],
  // groupContract: 'stars1...',
  // // The contract address of your splits contract to distribute funds 
  // splitsContract: 'stars1...',
};

