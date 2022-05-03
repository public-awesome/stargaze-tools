/*
 * This is the test config for testnet collection 3.
 * scripts use rpc and code ids from main config.js
 */

// these are originally hosted by the StargazeTrooprs folks.
module.exports = {
  mnemonic:
    'still degree drive submit clean entire shrug purse cruel record hollow strategy',
  account: 'stars1ppqvdpdql35vg3fppshr2k297a69le33ssl5h0',

  //// COLLECTION INFO ////
  name: 'Testnet Audio Collection',
  symbol: 'TAudio',
  description: 'Audio files for testnet',
  image: 'ipfs://QmQK7J4xhYiBA5m8cMPc9Ua43eLbmbXyuhEA47PsAEMzdG',

  //// MINTER CONTRACT ////
  baseTokenUri:
    'ipfs://bafybeifh43z2pcopsjb32xlwu4tofdcsx76o4icmduwqmjj2bahiistklm/galaxyb6j8PT',
  numTokens: 50,
  unitPrice: 162,
  perAddressLimit: 5,
};
