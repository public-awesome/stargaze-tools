// Launch a set of constant working collections on testnet
// Front end can point to this set of known contracts and profiles knowing that it will work
// in between blockchain upgrades, code id changes, smart contract changes, etc
// also provides concrete test examples for creators

// This script will grow and change as the network tests more front end edge cases.

//----------------------------------------------------------------
// 1. show profile when more than 30 nfts
// 2. show resized gifs in profile
// 3. show transferred nft
//----------------------------------------------------------------

// creator account
// buyer account
// gift account

// collection #1 - large collection
// collection #2 - nft gifs

// creates 2 collections
// buyer public mints 50

// must use config.js since getClient uses config.js
const config = require('../config');
const configKeys = ['rpcEndpoint', 'minterCodeId', 'sg721CodeId'];
const collection1 = require('./collection1');
// const collection2 = require('./collection2');
import { init as minterInit } from '../scripts/minter';
// import { batchMint } from '../scripts/mint';

async function testnet_init() {
  if (config.rpcEndpoint == 'https://rpc.stargaze-apis.com/') {
    throw new Error('RPC pointed to mainnet. Change rpcEndpoint in config.js');
  }
  const buyer = {
    mnemonic:
      'during genius fiscal calm host toast cruel citizen crane skate vessel source',
    addr: 'stars1kzhnfvqda4e44qvwpdgnswkrgvlqf9vlkw5esh',
  };

  // save code ids from config
  // inherit from collection1
  // setup collection1
  Object.keys(config).forEach((key) => {
    configKeys.includes(key) || delete config[key];
  });
  Object.keys(collection1).forEach((key) => {
    config[key] = collection1[key];
  });

  //   config.mnemonic = collection1.mnemonic;
  //   config.account = collection1.account;
  console.log('in testnet-launch config.account ', config.account);
  config.startTime = new Date(Date.now() + 10_000);
  const minter_addr = minterInit();
  //   config.minter = minter_addr;
  //   console.log('collection 1 minter addr: ', minter_addr);

  // 50x mint as buyer from collection #1
  //   await batchMint(buyer.addr, 50);

  // save code ids from config
  // inherit from collection2
  // set up collection2
  //   Object.keys(config).forEach((key) => {
  //     configKeys.includes(key) || delete config[key];
  //   });
  //   Object.keys(collection2).forEach((key) => {
  //     config[key] = collection2[key];
  //   });
  //   config.mnemonic = collection2.mnemonic;
  //   config.account = collection2.account;
  //   config.startTime = new Date(Date.now() + 10_000);
  //   const minter_addr2 = await minterInit();
  //   config.minter = minter_addr2;
  //   console.log('collection 2 minter addr: ', minter_addr2);

  // 5x mint as buyer from collection #2
  //   await batchMint(buyer.addr, 5);
  // transfer nft to receiver
}

testnet_init();

// stars1wh3wjjgprxeww4cgqyaw8k75uslzh3sd3s2yfk
// const creator = {
//     mnemonic:
//       'enough toddler bargain faint track vendor supreme diesel myself vibrant chase cargo',
//     addr: 'stars1wh3wjjgprxeww4cgqyaw8k75uslzh3sd3s2yfk',
//   };
//   // stars1ppqvdpdql35vg3fppshr2k297a69le33ssl5h0
//   const creator2 = {
//     mnemonic:
//       'still degree drive submit clean entire shrug purse cruel record hollow strategy',
//     addr: 'stars1ppqvdpdql35vg3fppshr2k297a69le33ssl5h0',
//   };
//   // stars1kzhnfvqda4e44qvwpdgnswkrgvlqf9vlkw5esh
//   const buyer = {
//     mnemonic:
//       'during genius fiscal calm host toast cruel citizen crane skate vessel source',
//     addr: 'stars1kzhnfvqda4e44qvwpdgnswkrgvlqf9vlkw5esh',
//   };
//   const receiver = {
//     mnemonic:
//       'giraffe kitten problem ramp before switch else eye example slide since beauty',
//     addr: 'stars1m22rfkezkkrsmd8nmqd30zhmg2gz9r9xfvt55d',
//   };
