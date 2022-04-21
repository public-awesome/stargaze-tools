/*
 * This is the test config for testnet collection 1.
 * scripts use rpc and code ids from main config.js
 */

module.exports = {
  mnemonic:
    'enough toddler bargain faint track vendor supreme diesel myself vibrant chase cargo',
  account: 'stars1wh3wjjgprxeww4cgqyaw8k75uslzh3sd3s2yfk',

  //// COLLECTION INFO ////
  name: 'Testnet Moons Collection',
  symbol: 'MOON',
  description: 'large 1050 NFT series for testnet',
  image: 'ipfs://QmPYqcz3p89SNzHnsdHt6JCbXdB7EceLckdVSQGZBqNZeX/1.png',

  //// MINTER CONTRACT ////
  baseTokenUri: 'ipfs://QmVnos4WEq5z2zLwX8CR5EkaHyBUiF2RZYQLDWL4gm5DDU',
  numTokens: 1050,
  unitPrice: 100,
  perAddressLimit: 50,
};
