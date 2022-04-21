/*
 * This is the test config for testnet collection 2.
 * scripts use rpc and code ids from main config.js
 */

// special thanks to Ziggy and Cosmos Constellations for permission to use in testnet
module.exports = {
  mnemonic:
    'still degree drive submit clean entire shrug purse cruel record hollow strategy',
  account: 'stars1ppqvdpdql35vg3fppshr2k297a69le33ssl5h0',

  //// COLLECTION INFO ////
  name: 'Testnet Ziggy Super Gifs Collection',
  symbol: 'TZIG',
  description: 'Super large gifs for testnet',
  image: 'ipfs://bafybeihtn57o7uos7xhjwty6g2o5gkz5qti65neycp4r37x2wu2b4zbina',

  //// MINTER CONTRACT ////
  baseTokenUri:
    'ipfs://bafybeiaf2qzkva4tnxak4k5trnnyzuinzzoxrookm7t4wa753rdarsoetm/metadata',
  numTokens: 20,
  unitPrice: 500,
  perAddressLimit: 5,
};
